/**
 * Shared canvas signal engine — one requestAnimationFrame loop for the
 * whole page, not one per canvas. Every oscilloscope, the header
 * hairline, and the tape transport register a draw callback here.
 *
 * Under prefers-reduced-motion: reduce, the loop never starts; callers
 * draw a single static frame instead (see prefersReducedMotion()).
 */

import { getAudioEnergy } from "./audio-engine";
import { getInteractionEnergy } from "./interaction-engine";

export type CanvasMetrics = { w: number; h: number; ctx: CanvasRenderingContext2D };

type Entry = {
  id: number;
  draw: (t: number) => void;
  isActive: () => boolean;
};

let entries: Entry[] = [];
let nextId = 0;
let running = false;
let t0 = 0;

/**
 * Global amplitude multiplier for every scope — the Tweak Bar's
 * "Signal intensity" control. Read at draw time, so no re-registration
 * is needed when it changes.
 */
let signalIntensity = 1.2;

export function setSignalIntensity(value: number) {
  signalIntensity = value;
}

export function getSignalIntensity(): number {
  return signalIntensity;
}

/**
 * The live "phosphor" signal color, read from the CSS custom property so
 * every canvas stays in sync with --phosphor (including Tweak Bar edits)
 * instead of hardcoding a color that can drift from the rest of the site.
 */
export function getPhosphorColor(): string {
  if (typeof window === "undefined") return "#ff0000";
  const value = getComputedStyle(document.documentElement).getPropertyValue("--phosphor").trim();
  return value || "#ff0000";
}

/**
 * Resolves any valid CSS color string (keyword, hex, rgb(), ...) to 0-255
 * RGB via the browser's own color parser, rather than hand-parsing hex.
 * Needed because CSS minification can rewrite `#ff0000` down to the
 * shorter keyword `red` — a hex-only parser misreads that entirely.
 */
let colorCtx: CanvasRenderingContext2D | null = null;
export function resolveColorRgb(color: string): [number, number, number] {
  if (typeof document === "undefined") return [255, 0, 0];
  if (!colorCtx) {
    const c = document.createElement("canvas");
    c.width = 1;
    c.height = 1;
    colorCtx = c.getContext("2d", { willReadFrequently: true });
  }
  if (!colorCtx) return [255, 0, 0];
  colorCtx.fillStyle = color;
  colorCtx.fillRect(0, 0, 1, 1);
  const [r, g, b] = colorCtx.getImageData(0, 0, 1, 1).data;
  return [r, g, b];
}

/** --phosphor as 0-1 floats, for WebGL uniforms. */
export function getPhosphorRgbNormalized(): [number, number, number] {
  const [r, g, b] = resolveColorRgb(getPhosphorColor());
  return [r / 255, g / 255, b / 255];
}

export function phosphorRgba(alpha: number): string {
  const [r, g, b] = resolveColorRgb(getPhosphorColor());
  return `rgba(${r},${g},${b},${alpha})`;
}

function loop(now: number) {
  const t = (now - t0) / 1000;
  for (const entry of entries) {
    if (entry.isActive()) entry.draw(t);
  }
  if (entries.length > 0) {
    requestAnimationFrame(loop);
  } else {
    running = false;
  }
}

function ensureLoop() {
  if (running || prefersReducedMotion()) return;
  running = true;
  t0 = performance.now();
  requestAnimationFrame(loop);
}

export function registerDraw(draw: (t: number) => void, isActive: () => boolean = () => true) {
  const id = nextId++;
  entries.push({ id, draw, isActive });
  ensureLoop();
  return () => {
    entries = entries.filter((entry) => entry.id !== id);
  };
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function fitCanvas(canvas: HTMLCanvasElement): CanvasMetrics | null {
  const rect = canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return null;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { w: rect.width, h: rect.height, ctx };
}

/**
 * Layered sines plus a periodic transient burst — reads as audio
 * rather than as a pure sine wave. Used by every scope on the site so
 * they all feel like one signal.
 */
export function wave(x: number, t: number, seed: number): number {
  const p = x * 0.05 + t;
  let v =
    Math.sin(p + seed) * 0.5 +
    Math.sin(p * 2.31 + seed * 1.7) * 0.28 +
    Math.sin(p * 5.7 + seed * 0.4) * 0.14;
  const burst = Math.pow(Math.max(0, Math.sin(x * 0.011 - t * 0.55)), 8);
  v *= 0.42 + burst * 1.7;
  return v;
}

/**
 * Audio and scroll/mouse energy combine additively (each one's deviation
 * from its own baseline of 1, summed), not multiplicatively — two
 * simultaneously-excited sources would otherwise compound into an
 * enormous, broken-looking multiplier. Additive still lets either one
 * dominate and reach a dramatic swing on its own, capped at a ceiling
 * that lets the trace run "hot" (occasionally clipping the canvas edge,
 * on theme for an analog signal) without flying off into nonsense.
 */
function combinedEnergy(t: number): number {
  return Math.min(4, 1 + (getAudioEnergy(t) - 1) + (getInteractionEnergy(t) - 1));
}

export type ScopeMode = "wave" | "bars";

export function drawScope(
  metrics: CanvasMetrics,
  t: number,
  opts: { mode: ScopeMode; amp: number; seed: number },
) {
  const { ctx, w, h } = metrics;
  const { mode, amp, seed } = opts;
  ctx.clearRect(0, 0, w, h);

  ctx.strokeStyle = phosphorRgba(0.1);
  ctx.lineWidth = 1;
  const gx = Math.max(46, w / 8);
  for (let x = gx; x < w; x += gx) {
    ctx.beginPath();
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, h);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(0, h / 2 + 0.5);
  ctx.lineTo(w, h / 2 + 0.5);
  ctx.stroke();

  if (mode === "bars") {
    const mid = h / 2;
    const n = Math.floor(w / 4);
    ctx.fillStyle = "rgba(184,188,194,0.45)";
    for (let i = 0; i < n; i++) {
      const x = i * 4;
      const a = Math.min(mid, Math.abs(wave(x * 1.4, t * 0.6, seed)) * mid * 0.9 * signalIntensity * combinedEnergy(t));
      ctx.fillRect(x, mid - a, 2, a * 2);
    }
    ctx.fillStyle = phosphorRgba(0.9);
    const play = (t * 24) % w;
    ctx.fillRect(0, mid - 1, play, 2);
    ctx.fillRect(play, 0, 1.5, h);
    return;
  }

  const mid = h / 2;
  // Allowed to run a little hot past the canvas half-height — a clipped
  // peak reads as an analog signal pushed into the red, not a bug — but
  // capped well short of the full combinedEnergy() ceiling so it doesn't
  // fly off into unreadable territory.
  const ampPx = mid * amp * signalIntensity * Math.min(2.4, combinedEnergy(t));
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.shadowColor = phosphorRgba(0.75);
  ctx.shadowBlur = 10;
  ctx.strokeStyle = getPhosphorColor();
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  for (let x = 0; x <= w; x += 1.5) {
    const y = mid - wave(x, t, seed) * ampPx;
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.shadowBlur = 0;
}
