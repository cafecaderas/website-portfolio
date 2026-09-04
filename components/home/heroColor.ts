import type { PointerEvent } from "react";

/**
 * The Hero as a live X/Y color picker for the site's signal colors —
 * which, per the Tweak Bar's linked-color model, already drive the shader
 * glow, hover accent, LED dots, and every oscilloscope.
 *
 * Two lights, not one blend. The previous version interpolated a single
 * color between a red and a cyan-blue anchor *in RGB space* and wrote that
 * one value to --phosphor. Those two anchors are near-complementary, so
 * every midpoint collapsed toward grey — at x=0.5 the mix lands around
 * rgb(128, 85, 128), which is only ~20% saturation. Half the picker's
 * travel was mud.
 *
 * Now X rotates a *hue*, and a second hue rides a fixed 155° behind it, both
 * pinned at high saturation: --phosphor is the key light, --phosphor-b the
 * fill. They can never average into each other because they are never
 * averaged — the mixing happens optically, in the reactor's shaders, where
 * two differently-colored light directions overlap on the geometry (see
 * CORE_WIRE_FRAG). That is the only place a blended tone appears, and it
 * appears as a *third* color next to the two originals rather than in place
 * of them.
 *
 * Y still sweeps lightness across both. There's no pointerleave handler on
 * purpose: pointermove keeps firing right up to the boundary as the cursor
 * exits, so the color simply stops updating wherever it was — "locks" at
 * the exit point for free.
 *
 * Writes directly to the CSS custom properties (not React state) — same
 * "no re-render, no framework tax" reasoning as spotlight.ts. Never
 * persisted (no localStorage): a real page reload always comes back to
 * the shipped defaults. The Tweak Bar can still override --phosphor at any
 * time — whichever one touches it last wins, which is fine, they're
 * deliberately two different tiers (visitor toy vs. dev tool).
 */

/** Hue at the left edge — 0° is red, matching the shipped --phosphor default. */
const HUE_START = 0;
/** Hue at the right edge — ~200° is the azure the old right anchor was reaching for. */
const HUE_END = 200;
/**
 * How far behind the key light the fill light sits, in degrees. Far enough
 * apart to read as two genuinely different colors at a glance, close enough
 * that their optical mix stays a plausible third color rather than grey.
 */
const FILL_OFFSET = 155;

export function onHeroColorMove(e: PointerEvent<HTMLElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
  const y = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));

  const keyHue = HUE_START + (HUE_END - HUE_START) * x;
  const fillHue = (keyHue + FILL_OFFSET) % 360;

  // Light near the top, richer/darker toward the bottom. The fill sits a
  // little darker than the key so the key still reads as the dominant one.
  const lightness = 68 - y * 35;

  const root = document.documentElement.style;
  root.setProperty("--phosphor", `hsl(${keyHue.toFixed(1)} 92% ${lightness.toFixed(1)}%)`);
  root.setProperty("--phosphor-b", `hsl(${fillHue.toFixed(1)} 88% ${(lightness - 6).toFixed(1)}%)`);
}
