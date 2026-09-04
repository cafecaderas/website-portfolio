import type { CSSProperties } from "react";

const TILE_COUNT = 36;

/**
 * WORKS §3 — a chromatic contact sheet. Every tile is the *same* two-light
 * conic gradient rotated by its own index, so the wall is one continuous
 * sweep through both signal colors rather than 36 arbitrary swatches. Hover
 * lifts a tile out of the grid and drops its neighbours back, which is the
 * whole interaction: the wall responds, nothing navigates.
 */
export function ChromaWall() {
  return (
    <section className="decor" aria-labelledby="decor-chroma">
      <div className="decor-head">
        <p className="eyebrow" id="decor-chroma">
          CHROMA WALL
        </p>
        <span className="decor-readout mono">36 CELLS · TWO SOURCES</span>
      </div>
      <div className="chroma" aria-hidden="true">
        {Array.from({ length: TILE_COUNT }, (_, i) => (
          <span
            key={i}
            className="chroma-tile"
            style={{ "--i": i, "--n": TILE_COUNT } as CSSProperties}
          />
        ))}
      </div>
    </section>
  );
}
