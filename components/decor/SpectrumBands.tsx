import type { CSSProperties } from "react";

const BAND_COUNT = 56;

/**
 * WORKS §1 — a mastering-console spectrum analyser, driven entirely by CSS
 * keyframes rather than the audio engine. Deliberate: the engine's bands are
 * the *hero's* job, and a second live consumer on a page the hero isn't on
 * would spin up the whole rAF chain for decoration. Each bar's phase comes
 * from its index, so the wave reads as a travelling sweep instead of 56 bars
 * blinking in lockstep.
 */
export function SpectrumBands() {
  return (
    <section className="decor" aria-labelledby="decor-spectrum">
      <div className="decor-head">
        <p className="eyebrow" id="decor-spectrum">
          SERVICE SPECTRUM
        </p>
        <span className="decor-readout mono">20HZ — 20KHZ · ALL BANDS LIT</span>
      </div>
      <div className="spectrum" aria-hidden="true">
        {Array.from({ length: BAND_COUNT }, (_, i) => (
          <span
            key={i}
            className="spectrum-bar"
            style={{ "--i": i, "--n": BAND_COUNT } as CSSProperties}
          />
        ))}
      </div>
    </section>
  );
}
