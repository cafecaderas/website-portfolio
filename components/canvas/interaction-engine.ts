/**
 * Real scroll + mouse activity, tracked globally. Feeds two things:
 * TapeTransport's own drive (replacing audio there — "less about audio and
 * more about the scroll and mouse"), and a shared energy blended into every
 * oscilloscope via signal-engine.ts's drawScope().
 *
 * Same lazy-singleton shape as audio-engine.ts. Unlike audio, no user
 * gesture is required (no autoplay policy for scroll/pointer events), so
 * listening starts on first use rather than waiting for an explicit
 * "power on" — still guarded to client-side only.
 */

let started = false;
let lastPointerX = 0;
let lastPointerY = 0;
let mouseEnergy = 1;
let lastScrollY = 0;
let scrollVelocity = 0;
let lastDecayT = -1;

/** Captured once, on module load — resets only on an actual page reload. */
const siteEntryTime = typeof window !== "undefined" ? Date.now() : 0;

function ensureListening() {
  if (started || typeof window === "undefined") return;
  started = true;

  lastPointerX = window.innerWidth / 2;
  lastPointerY = window.innerHeight / 2;
  lastScrollY = window.scrollY;

  window.addEventListener(
    "pointermove",
    (e) => {
      const dx = e.clientX - lastPointerX;
      const dy = e.clientY - lastPointerY;
      lastPointerX = e.clientX;
      lastPointerY = e.clientY;
      const speed = Math.sqrt(dx * dx + dy * dy);
      mouseEnergy = Math.min(3, mouseEnergy + speed * 0.02);
    },
    { passive: true },
  );

  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;
      scrollVelocity += (y - lastScrollY) * 0.5;
      lastScrollY = y;
    },
    { passive: true },
  );
}

/** Idempotent within a single rAF tick — callers all pass the same `t`. */
function decay(t: number) {
  if (t === lastDecayT) return;
  lastDecayT = t;
  mouseEnergy += (1 - mouseEnergy) * 0.05;
  scrollVelocity *= 0.9;
}

/** ~1.0 at rest, spikes with cursor movement speed, decays back down. */
export function getMouseEnergy(t = performance.now() / 1000): number {
  ensureListening();
  decay(t);
  return mouseEnergy;
}

/** ~0 at rest, spikes (either sign) with scroll speed, decays back down. */
export function getScrollVelocity(t = performance.now() / 1000): number {
  ensureListening();
  decay(t);
  return scrollVelocity;
}

/** Combined, for the shared oscilloscope engine — one multiplier, blends both. */
export function getInteractionEnergy(t = performance.now() / 1000): number {
  ensureListening();
  decay(t);
  return Math.min(2.4, 1 + (mouseEnergy - 1) * 0.6 + Math.min(1, Math.abs(scrollVelocity) * 0.05));
}

/** How long this page has been open, in seconds. */
export function getSiteElapsedSeconds(): number {
  if (typeof window === "undefined" || !siteEntryTime) return 0;
  return (Date.now() - siteEntryTime) / 1000;
}
