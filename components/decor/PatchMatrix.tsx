const ROWS = 4;
const COLS = 16;

/** Which sockets a cable is plugged into — [row, col] pairs, hand-placed so the cables drape across each other rather than running parallel. */
const CABLES = [
  { from: [0, 1], to: [3, 6], hue: "a" },
  { from: [1, 4], to: [2, 11], hue: "b" },
  { from: [0, 9], to: [3, 13], hue: "b" },
  { from: [2, 2], to: [1, 14], hue: "a" },
] as const;

/** Socket centre as a 0-100 viewBox coordinate — the same maths the CSS grid uses to place the jack itself, so cable ends land dead-on. */
function socket(row: number, col: number) {
  return {
    x: ((col + 0.5) / COLS) * 100,
    y: ((row + 0.5) / ROWS) * 100,
  };
}

/**
 * LAB §2 — a patchbay. Sockets are a plain CSS grid; the cables over them
 * are one SVG overlay sharing the grid's coordinate space, so every cable
 * end lands exactly on a socket centre no matter how the box resizes.
 *
 * The cables are quadratic curves whose control point hangs *below* the
 * midpoint by an amount proportional to the span — a long patch sags more
 * than a short one, which is the single detail that makes this read as
 * cable under its own weight rather than as vector lines between dots.
 * Plugged sockets light in whichever colour their cable carries, so the
 * matrix shows its own routing state.
 */
export function PatchMatrix() {
  return (
    <section className="decor" aria-labelledby="decor-patch">
      <div className="decor-head">
        <p className="eyebrow" id="decor-patch">
          PATCH MATRIX
        </p>
        <span className="decor-readout mono">4 × 16 · 4 PATCHED</span>
      </div>
      <div className="patch" aria-hidden="true">
        <div className="patch-grid">
          {Array.from({ length: ROWS * COLS }, (_, i) => {
            const row = Math.floor(i / COLS);
            const col = i % COLS;
            const cable = CABLES.find(
              (c) =>
                (c.from[0] === row && c.from[1] === col) || (c.to[0] === row && c.to[1] === col),
            );
            return (
              <span
                key={i}
                className={`patch-jack${cable ? ` is-patched patch-jack--${cable.hue}` : ""}`}
              />
            );
          })}
        </div>
        <svg
          className="patch-cables"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          focusable="false"
        >
          {CABLES.map((cable, i) => {
            const a = socket(cable.from[0], cable.from[1]);
            const b = socket(cable.to[0], cable.to[1]);
            // Sag scales with horizontal span, clamped so a short patch
            // still droops a little and a long one never loops off the box.
            const sag = Math.min(38, 10 + Math.abs(b.x - a.x) * 0.55);
            const cx = (a.x + b.x) / 2;
            const cy = Math.max(a.y, b.y) + sag;
            return (
              <path
                key={i}
                className={`patch-cable patch-cable--${cable.hue}`}
                d={`M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`}
                style={{ animationDelay: `${i * -1.6}s` }}
              />
            );
          })}
        </svg>
      </div>
    </section>
  );
}
