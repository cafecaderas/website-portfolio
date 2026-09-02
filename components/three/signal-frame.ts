import { getAudioBands, getAudioEnergy } from "@/components/canvas/audio-engine";
import {
  getClickImpulse,
  getInteractionEnergy,
  getPointerNormalized,
  getScrollVelocity,
} from "@/components/canvas/interaction-engine";
import { getPhosphorRgbNormalized } from "@/components/canvas/signal-engine";

/**
 * One read of every engine, per animation frame, shared by every consumer.
 *
 * This is not just a caching nicety — it is required for correctness.
 * `interaction-engine`'s `decay()` is idempotent only for an *identical*
 * `t`, so if several WebGL scenes each polled with their own clock, decay
 * would run once per scene per frame and the mouse/scroll energy would fall
 * off as many times faster as there are canvases on the page. Everything
 * funnels through here so the engines advance exactly once a frame no
 * matter how many fields are mounted.
 */
export type SignalFrame = {
  t: number;
  bands: [number, number, number];
  energy: number;
  interaction: number;
  burst: number;
  scroll: number;
  pointerX: number;
  pointerY: number;
  phosphor: [number, number, number];
  /** Combined audio + interaction + click — the value glow chains read. */
  drive: number;
};

let cachedAt = -1;
let cached: SignalFrame | null = null;

/** Shorter than a 120fps frame, so at most one engine advance per frame. */
const FRAME_EPSILON = 0.006;

export function readSignalFrame(): SignalFrame {
  const t = typeof performance === "undefined" ? 0 : performance.now() / 1000;
  if (cached && t - cachedAt < FRAME_EPSILON) return cached;

  cachedAt = t;
  const bands = getAudioBands(t);
  const energy = getAudioEnergy(t);
  const interaction = getInteractionEnergy(t);
  const burst = getClickImpulse(t);
  const scroll = getScrollVelocity(t);
  const [pointerX, pointerY] = getPointerNormalized();
  const phosphor = getPhosphorRgbNormalized();

  cached = {
    t,
    bands,
    energy,
    interaction,
    burst,
    scroll,
    pointerX,
    pointerY,
    phosphor,
    drive: energy - 1 + (interaction - 1) * 0.55 + burst * 1.8,
  };
  return cached;
}
