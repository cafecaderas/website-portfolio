"use client";

import { useState } from "react";
import {
  getTone,
  getWaveform,
  isAudioEngineOn,
  setTone,
  setWaveform,
  startAudioEngine,
  stopAudioEngine,
  type Waveform,
} from "@/components/canvas/audio-engine";

const WAVEFORMS: { id: Waveform; label: string }[] = [
  { id: "sine", label: "SIN" },
  { id: "sawtooth", label: "SAW" },
  { id: "square", label: "SQR" },
];

/**
 * The one user gesture that unlocks real audio site-wide (browsers block
 * autoplay). Everything the audio engine drives — the oscilloscopes, the
 * tape transport, the shader hero — already falls back to a synthetic idle
 * signal when this is off, so toggling it never breaks anything visually.
 *
 * Once on, two ways to shape the signal — kept deliberately simple: a
 * waveform pick (sine/saw/square) and one TONE knob that sweeps the
 * filter's cutoff + resonance and the noise floor together.
 */
export function SignalToggle() {
  const [on, setOn] = useState(false);
  const [waveform, setWaveformState] = useState<Waveform>(getWaveform());
  const [tone, setToneState] = useState(getTone());

  const toggle = () => {
    if (isAudioEngineOn()) {
      stopAudioEngine();
      setOn(false);
    } else {
      startAudioEngine();
      setOn(true);
    }
  };

  const pickWaveform = (w: Waveform) => {
    setWaveform(w);
    setWaveformState(w);
  };

  const adjustTone = (v: number) => {
    setTone(v);
    setToneState(v);
  };

  return (
    <div className="signal-controls">
      <button type="button" className="signal-toggle mono" onClick={toggle} aria-pressed={on}>
        {on && <span className="led-dot animate__animated animate__pulse animate__infinite" />}
        SIGNAL: {on ? "ON" : "OFF"}
      </button>
      {on && (
        <div className="signal-mod">
          <div className="signal-wave mono" role="group" aria-label="Waveform">
            {WAVEFORMS.map((w) => (
              <button
                key={w.id}
                type="button"
                aria-pressed={waveform === w.id}
                onClick={() => pickWaveform(w.id)}
              >
                {w.label}
              </button>
            ))}
          </div>
          <label className="signal-tone mono">
            <span>TONE</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={tone}
              onChange={(e) => adjustTone(Number(e.target.value))}
              aria-label="Filter and noise/feedback"
            />
          </label>
        </div>
      )}
    </div>
  );
}
