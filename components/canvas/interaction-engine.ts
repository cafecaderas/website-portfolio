/**
 * Real scroll + mouse activity, tracked globally. Feeds two things:
 * TapeTransport's own drive (replacing audio there — "less about audio and
 * more about the scroll and mouse"), and a shared energy blended into every
 * oscilloscope via signal-engine.ts's drawScope().
 *
 * Two-tier response, deliberately: an *immediate* value that spikes hard
 * and settles back over roughly half a second, plus a slow-decaying
 * "afterglow" that remembers recent peaks and fades over several seconds —
 * so a burst of scrolling or mouse movement leaves a visible trailing glow
 * on the oscilloscopes rather than snapping back to baseline instantly.
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
let mousePeak = 1;
let scrollVelocity = 0;
let scrollPeak = 0;
let lastScrollY = 0;
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
      mouseEnergy = Math.min(5, mouseEnergy + speed * 0.035);
      mousePeak = Math.max(mousePeak, mouseEnergy);
    },
    { passive: true },
  );

  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;
      scrollVelocity += (y - lastScrollY) * 0.9;
      scrollPeak = Math.max(scrollPeak, Math.abs(scrollVelocity));
      lastScrollY = y;
    },
    { passive: true },
  );
}

/** Idempotent within a single rAF tick — callers all pass the same `t`. */
function decay(t: number) {
  if (t === lastDecayT) return;
  lastDecayT = t;
  // Fast lane — the immediate spike, settles in well under a second.
  mouseEnergy += (1 - mouseEnergy) * 0.035;
  scrollVelocity *= 0.93;
  // Slow lane — the afterglow, lingers for several seconds.
  mousePeak += (1 - mousePeak) * 0.008;
  scrollPeak += (0 - scrollPeak) * 0.012;
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

/**
 * Combined, for the shared oscilloscope engine — immediate spike layered
 * on top of the slow-decaying afterglow, so real bursts of activity read
 * as dramatic hits that then visibly fade rather than instant snaps.
 */
export function getInteractionEnergy(t = performance.now() / 1000): number {
  ensureListening();
  decay(t);
  const immediate = (mouseEnergy - 1) * 1.3 + Math.min(1.8, Math.abs(scrollVelocity) * 0.09);
  const afterglow = (mousePeak - 1) * 0.9 + Math.min(1.2, scrollPeak * 0.06);
  return Math.min(4.5, 1 + immediate + afterglow);
}

/** How long this page has been open, in seconds. */
export function getSiteElapsedSeconds(): number {
  if (typeof window === "undefined" || !siteEntryTime) return 0;
  return (Date.now() - siteEntryTime) / 1000;
}
