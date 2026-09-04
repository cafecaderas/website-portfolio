import type { CSSProperties } from "react";

const STAGES = ["BRIEF", "SHAPE", "BUILD", "MASTER", "SHIP"] as const;

/**
 * WORKS §2 — the studio signal chain as a process diagram. The connecting
 * rail is one element with an animated gradient position, not five separate
 * lit segments: a single moving pulse crossing the whole rail reads as
 * *flow*, whereas per-segment animation reads as five unrelated blinks.
 * Nodes alternate which of the two lights they sit under.
 */
export function SignalPath() {
  return (
    <section className="decor" aria-labelledby="decor-path">
      <div className="decor-head">
        <p className="eyebrow" id="decor-path">
          SIGNAL PATH
        </p>
        <span className="decor-readout mono">GAIN STAGED · NO CLIPPING</span>
      </div>
      <div className="sigpath" aria-hidden="true">
        <span className="sigpath-rail" />
        {STAGES.map((stage, i) => (
          <span key={stage} className="sigpath-node" style={{ "--i": i } as CSSProperties}>
            <span className="sigpath-dot" />
            <span className="sigpath-label mono">{stage}</span>
          </span>
        ))}
      </div>
    </section>
  );
}
