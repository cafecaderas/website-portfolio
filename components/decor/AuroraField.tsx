import type { CSSProperties } from "react";

const BLOB_COUNT = 5;

/**
 * LAB §1 — the only genuinely soft surface on the site. Everything else here
 * is hard rules, hairlines and right angles; this is five heavily-blurred
 * radial blobs drifting inside a clipped box, so the two signal colors get
 * one place to actually bleed into each other at full saturation instead of
 * being rationed out as 1px accents. Each blob carries its own duration and
 * delay so the field never visibly loops.
 */
export function AuroraField() {
  return (
    <section className="decor" aria-labelledby="decor-aurora">
      <div className="decor-head">
        <p className="eyebrow" id="decor-aurora">
          SPECTRAL DRIFT
        </p>
        <span className="decor-readout mono">UNQUANTISED · NO GRID</span>
      </div>
      <div className="aurora" aria-hidden="true">
        {Array.from({ length: BLOB_COUNT }, (_, i) => (
          <span key={i} className="aurora-blob" style={{ "--i": i } as CSSProperties} />
        ))}
        <span className="aurora-grain" />
      </div>
    </section>
  );
}
