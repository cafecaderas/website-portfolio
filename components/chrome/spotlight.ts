import type { PointerEvent } from "react";

/**
 * Cursor-spotlight hover glow for repeated card-like elements (Lab modules,
 * work rows, sidecards). A plain event handler rather than a hook — these
 * elements render inside .map(), where hooks can't be called — that writes
 * --mx/--my directly on the DOM node via e.currentTarget. A radial-gradient
 * glow layer (see SpotlightGlow) reads those properties in CSS. No React
 * state, no re-render, no per-frame JS: the GPU-composited gradient does
 * all the work between pointermove events.
 */
export function onSpotlightMove(e: PointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
  el.style.setProperty("--my", `${((e.clientY - rect.top) / rect.height) * 100}%`);
}
