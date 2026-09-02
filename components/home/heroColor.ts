import type { PointerEvent } from "react";

/**
 * The Hero as a live X/Y color picker for the site's one signal color
 * (--phosphor) — which, per the Tweak Bar's linked-color model, already
 * drives the shader glow, hover accent, LED dots, and every oscilloscope.
 *
 * Two fixed RGB anchors sit at the left and right edges; X mixes between
 * them in RGB space (not a hue-wheel sweep), so the picked color travels
 * through the muted in-between tones real pigments make — not the full
 * rainbow a hue rotation would give. Y still sweeps lightness on top of
 * whatever the X mix produced. There's no pointerleave handler on purpose:
 * pointermove keeps firing right up to the boundary as the cursor exits,
 * so the color simply stops updating wherever it was — "locks" at the exit
 * point for free.
 *
 * Writes directly to the CSS custom property (not React state) — same
 * "no re-render, no framework tax" reasoning as spotlight.ts. Never
 * persisted (no localStorage): a real page reload always comes back to
 * the shipped default. The Tweak Bar can still override this at any
 * time — whichever one touches --phosphor last wins, which is fine,
 * they're deliberately two different tiers (visitor toy vs. dev tool).
 */

/** Left anchor — matches the shipped --phosphor default (#ff0000). */
const ANCHOR_A = { r: 255, g: 0, b: 0 };
/** Right anchor — a cool cyan-blue, complementary enough that the midpoint mix reads as a real third color, not a washed-out grey. */
const ANCHOR_B = { r: 0, g: 170, b: 255 };

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;

  if (max === min) return [0, 0, l];

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  switch (max) {
    case rn:
      h = (gn - bn) / d + (gn < bn ? 6 : 0);
      break;
    case gn:
      h = (bn - rn) / d + 2;
      break;
    default:
      h = (rn - gn) / d + 4;
  }
  return [h * 60, s, l];
}

export function onHeroColorMove(e: PointerEvent<HTMLElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
  const y = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));

  const r = ANCHOR_A.r + (ANCHOR_B.r - ANCHOR_A.r) * x;
  const g = ANCHOR_A.g + (ANCHOR_B.g - ANCHOR_A.g) * x;
  const b = ANCHOR_A.b + (ANCHOR_B.b - ANCHOR_A.b) * x;

  const [hue, saturation] = rgbToHsl(r, g, b);
  const lightness = 68 - y * 35; // light near the top, richer/darker toward the bottom

  document.documentElement.style.setProperty(
    "--phosphor",
    `hsl(${hue.toFixed(1)} ${(saturation * 100).toFixed(1)}% ${lightness.toFixed(1)}%)`,
  );
}
