/**
 * Shared canvas signal engine — one requestAnimationFrame loop for the
 * whole page, not one per canvas. Every oscilloscope, the header
 * hairline, and the tape transport register a draw callback here.
 *
 * Under prefers-reduced-motion: reduce, the loop never starts; callers
 * draw a single static frame instead (see prefersReducedMotion()).
 */

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

export type ScopeMode = "wave" | "bars";

export function drawScope(
  metrics: CanvasMetrics,
  t: number,
  opts: { mode: ScopeMode; amp: number; seed: number },
) {
  const { ctx, w, h } = metrics;
  const { mode, amp, seed } = opts;
  ctx.clearRect(0, 0, w, h);

  ctx.strokeStyle = "rgba(57,255,106,0.10)";
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
      const a = Math.abs(wave(x * 1.4, t * 0.6, seed)) * mid * 0.9;
      ctx.fillRect(x, mid - a, 2, a * 2);
    }
    ctx.fillStyle = "rgba(57,255,106,0.9)";
    const play = (t * 24) % w;
    ctx.fillRect(0, mid - 1, play, 2);
    ctx.fillRect(play, 0, 1.5, h);
    return;
  }

  const mid = h / 2;
  const ampPx = mid * amp;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.shadowColor = "rgba(57,255,106,0.75)";
  ctx.shadowBlur = 10;
  ctx.strokeStyle = "#39FF6A";
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
