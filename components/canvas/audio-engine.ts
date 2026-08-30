/**
 * A small ambient synth, entirely synthesized — no audio file to source or
 * license. Module-singleton, same shape as signal-engine.ts: plain module
 * state, not a React hook/context, so any component can read it.
 *
 * The AudioContext is only ever created inside startAudioEngine(), which
 * must be called from a user gesture (browser autoplay policy) — that
 * maps cleanly onto a physical "power on" control, fitting the tape-deck
 * aesthetic (see SignalToggle).
 *
 * getAudioEnergy()/getAudioBands() never block on "is audio on" — when the
 * engine is off they return a gentle synthetic idle pulse, so anything
 * driven by them never looks dead before the user opts in.
 *
 * No dependency on signal-engine.ts (signal-engine imports this module to
 * modulate its own draws, so this file must stay a leaf — no cycle).
 */

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let analyser: AnalyserNode | null = null;
let on = false;

let timeData: Uint8Array<ArrayBuffer> | null = null;
let freqData: Uint8Array<ArrayBuffer> | null = null;
let energy = 1;
let bands: [number, number, number] = [0.3, 0.25, 0.2];
let lastAnalysisT = -1;

function buildGraph(context: AudioContext) {
  const master = context.createGain();
  master.gain.value = 0;

  const analyserNode = context.createAnalyser();
  analyserNode.fftSize = 512;
  analyserNode.smoothingTimeConstant = 0.75;

  // Low drone: two detuned oscillators through a slowly modulated lowpass.
  const oscA = context.createOscillator();
  oscA.type = "sine";
  oscA.frequency.value = 55; // A1
  const gainA = context.createGain();
  gainA.gain.value = 0.5;

  const oscB = context.createOscillator();
  oscB.type = "sawtooth";
  oscB.frequency.value = 55 * 1.5; // fifth above
  const filterB = context.createBiquadFilter();
  filterB.type = "lowpass";
  filterB.frequency.value = 800;
  const gainB = context.createGain();
  gainB.gain.value = 0.22;

  const filterLfo = context.createOscillator();
  filterLfo.type = "sine";
  filterLfo.frequency.value = 0.05;
  const filterLfoDepth = context.createGain();
  filterLfoDepth.gain.value = 400;

  // Tape hiss texture: looped white noise through a highpass.
  const noiseBuffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
  const noiseData = noiseBuffer.getChannelData(0);
  for (let i = 0; i < noiseData.length; i++) noiseData[i] = Math.random() * 2 - 1;
  const noise = context.createBufferSource();
  noise.buffer = noiseBuffer;
  noise.loop = true;
  const noiseFilter = context.createBiquadFilter();
  noiseFilter.type = "highpass";
  noiseFilter.frequency.value = 2000;
  const noiseGain = context.createGain();
  noiseGain.gain.value = 0.03;

  // Slow amplitude "breathing" so the signal has real movement to track,
  // not just a flat drone.
  const tremoloLfo = context.createOscillator();
  tremoloLfo.type = "sine";
  tremoloLfo.frequency.value = 0.12;
  const tremoloDepth = context.createGain();
  tremoloDepth.gain.value = 0.05;

  filterLfo.connect(filterLfoDepth);
  filterLfoDepth.connect(filterB.frequency);

  tremoloLfo.connect(tremoloDepth);
  tremoloDepth.connect(master.gain);

  oscA.connect(gainA);
  oscB.connect(filterB);
  filterB.connect(gainB);
  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);

  gainA.connect(master);
  gainB.connect(master);
  noiseGain.connect(master);

  master.connect(analyserNode);
  analyserNode.connect(context.destination);

  oscA.start();
  oscB.start();
  noise.start();
  filterLfo.start();
  tremoloLfo.start();

  masterGain = master;
  analyser = analyserNode;
  timeData = new Uint8Array(analyserNode.frequencyBinCount);
  freqData = new Uint8Array(analyserNode.frequencyBinCount);
}

/** Idempotent within a single rAF tick — callers all pass the same `t`. */
function ensureAnalysis(t: number) {
  if (!on || !analyser || !timeData || !freqData) return;
  if (t === lastAnalysisT) return;
  lastAnalysisT = t;

  analyser.getByteTimeDomainData(timeData);
  analyser.getByteFrequencyData(freqData);

  let sumSquares = 0;
  for (let i = 0; i < timeData.length; i++) {
    const v = (timeData[i] - 128) / 128;
    sumSquares += v * v;
  }
  const rms = Math.sqrt(sumSquares / timeData.length);
  const target = Math.min(2.2, Math.max(0.4, 1 + rms * 6));
  energy += (target - energy) * 0.15;

  const n = freqData.length;
  const bassEnd = Math.floor(n * 0.08);
  const midEnd = Math.floor(n * 0.32);
  bands = [
    average(freqData, 0, bassEnd) / 255,
    average(freqData, bassEnd, midEnd) / 255,
    average(freqData, midEnd, n) / 255,
  ];
}

function average(data: Uint8Array, start: number, end: number): number {
  let sum = 0;
  for (let i = start; i < end; i++) sum += data[i];
  return sum / Math.max(1, end - start);
}

export function startAudioEngine() {
  if (on) return;
  if (typeof window === "undefined") return;

  if (!ctx) {
    const AudioContextCtor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AudioContextCtor();
    buildGraph(ctx);
  }

  ctx.resume();
  masterGain?.gain.cancelScheduledValues(ctx.currentTime);
  masterGain?.gain.linearRampToValueAtTime(0.16, ctx.currentTime + 0.8);
  on = true;
}

export function stopAudioEngine() {
  if (!on || !ctx || !masterGain) return;
  masterGain.gain.cancelScheduledValues(ctx.currentTime);
  masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
  const context = ctx;
  window.setTimeout(() => context.suspend(), 450);
  on = false;
  energy = 1;
  bands = [0.3, 0.25, 0.2];
}

export function isAudioEngineOn(): boolean {
  return on;
}

/** ~1.0 at idle, higher on transients. Synthetic idle pulse when off. */
export function getAudioEnergy(t = performance.now() / 1000): number {
  if (!on) return 1 + 0.15 * Math.sin(t * 0.4);
  ensureAnalysis(t);
  return energy;
}

/** [bass, mid, treble], each ~0..1. Synthetic idle values when off. */
export function getAudioBands(t = performance.now() / 1000): [number, number, number] {
  if (!on) {
    return [0.3 + 0.1 * Math.sin(t * 0.3), 0.25 + 0.1 * Math.sin(t * 0.37 + 1), 0.2 + 0.1 * Math.sin(t * 0.43 + 2)];
  }
  ensureAnalysis(t);
  return bands;
}
