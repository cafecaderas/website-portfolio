import type { PointerEvent } from "react";

/**
 * The Hero as a live X/Y color picker for the site's one signal color
 * (--phosphor) — which, per the Tweak Bar's linked-color model, already
 * drives the shader glow, hover accent, LED dots, and every oscilloscope.
 * X sweeps hue across the full wheel; Y sweeps lightness. There's no
 * pointerleave handler on purpose: pointermove keeps firing right up to
 * the boundary as the cursor exits, so the color simply stops updating
 * wherever it was — "locks" at the exit point for free.
 *
 * Writes directly to the CSS custom property (not React state) — same
 * "no re-render, no framework tax" reasoning as spotlight.ts. Never
 * persisted (no localStorage): a real page reload always comes back to
 * the shipped default. The Tweak Bar can still override this at any
 * time — whichever one touches --phosphor last wins, which is fine,
 * they're deliberately two different tiers (visitor toy vs. dev tool).
 */
export function onHeroColorMove(e: PointerEvent<HTMLElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
  const y = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));

  const hue = x * 360;
  const lightness = 68 - y * 35; // light near the top, richer/darker toward the bottom

  document.documentElement.style.setProperty("--phosphor", `hsl(${hue.toFixed(1)} 95% ${lightness.toFixed(1)}%)`);
}
