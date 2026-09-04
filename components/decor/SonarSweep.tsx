import type { CSSProperties } from "react";

const RING_COUNT = 5;
const BLIP_COUNT = 7;

/**
 * LAB §3 — a radar. Rings expand outward on a stagger while a conic-gradient
 * arm sweeps over them; blips sit at fixed polar coordinates and pulse on
 * their own offsets, so the sweep and the contacts are deliberately *not*
 * synchronised — a radar where every blip lit exactly as the arm passed
 * would read as a loading spinner, not a scan.
 */
export function SonarSweep() {
  return (
    <section className="decor" aria-labelledby="decor-sonar">
      <div className="decor-head">
        <p className="eyebrow" id="decor-sonar">
          SONAR SWEEP
        </p>
        <span className="decor-readout mono">PASSIVE · LISTENING</span>
      </div>
      <div className="sonar" aria-hidden="true">
        <span className="sonar-scope">
          {Array.from({ length: RING_COUNT }, (_, i) => (
            <span key={i} className="sonar-ring" style={{ "--i": i } as CSSProperties} />
          ))}
          <span className="sonar-arm" />
          <span className="sonar-cross sonar-cross--h" />
          <span className="sonar-cross sonar-cross--v" />
          {Array.from({ length: BLIP_COUNT }, (_, i) => (
            <span
              key={i}
              className="sonar-blip"
              style={{ "--i": i, "--n": BLIP_COUNT } as CSSProperties}
            />
          ))}
        </span>
        <ul className="sonar-legend mono">
          <li>
            <span className="sonar-key sonar-key--a" />
            KEY LIGHT
          </li>
          <li>
            <span className="sonar-key sonar-key--b" />
            FILL LIGHT
          </li>
          <li>
            <span className="sonar-key sonar-key--mix" />
            OVERLAP
          </li>
        </ul>
      </div>
    </section>
  );
}
