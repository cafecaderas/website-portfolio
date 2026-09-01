/**
 * CAST METAL — shared 2D-canvas primitives for the site's hardware surfaces.
 *
 * The look is "all-metal, monochrome, one accent light": near-black milled
 * panels, machined knobs with a plain pointer, steel-toned tines instead of
 * coloured LEDs, and exactly one lit element — which on this site is always
 * `--phosphor`, so the Hero's colour picker still owns the single accent.
 *
 * These are deliberately plain functions over a CanvasRenderingContext2D
 * rather than components, so any canvas on the site can use them: the tape
 * deck today, meters/scopes/lab modules later.
 *
 * The greys are hard-coded here rather than added to `globals.css`. The
 * design system is locked to its existing custom properties, and these are
 * canvas rendering details (like the values already in TapeTransport's
 * draw.ts), not new design tokens.
 */

export const METAL = {
  /** Deepest recess — the panel behind everything. */
  well: "#0b0b0b",
  /** The raised card face. */
  face: "#121212",
  /** Inner recessed plate. */
  plate: "#171717",
  /** Hairline bezel edge, catching light. */
  edgeLit: "rgba(255,255,255,0.10)",
  /** Hairline bezel edge, in shadow. */
  edgeDark: "rgba(0,0,0,0.85)",
  /** Milled seam / divider. */
  seam: "rgba(255,255,255,0.055)",
  /** Machined pointer + brightest engraving. */
  bright: "#e8e8e8",
  /** Standard engraved label. */
  label: "#6f6f6f",
  /** Dim engraved label. */
  labelDim: "#4a4a4a",
  /** Steel of the tine bank. */
  steel: "#9aa1a7",
} as const;

/** Applies canvas letter-spacing where supported; harmless no-op elsewhere. */
function withTracking(ctx: CanvasRenderingContext2D, tracking: string) {
  if ("letterSpacing" in ctx) {
    (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = tracking;
  }
}

/**
 * Fine vertical hairlines — the milled/brushed grain that reads as machined
 * metal. Cheap: one 1px line every `spacing` px, no gradients.
 */
export function millGrain(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  spacing = 3,
  alpha = 0.018,
) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let gx = x + 0.5; gx < x + w; gx += spacing) {
    ctx.moveTo(gx, y);
    ctx.lineTo(gx, y + h);
  }
  ctx.stroke();
  ctx.restore();
}

/**
 * A recessed panel: dark fill, a dark hairline on the top/left and a lit
 * hairline on the bottom/right, which is what sells "milled into metal"
 * rather than "rectangle with a border".
 */
export function bezelPanel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  fill: string = METAL.plate,
) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);

  ctx.lineWidth = 1;
  // Shadowed edges (light comes from upper-left, so those sides go dark).
  ctx.strokeStyle = METAL.edgeDark;
  ctx.beginPath();
  ctx.moveTo(x + 0.5, y + h - 0.5);
  ctx.lineTo(x + 0.5, y + 0.5);
  ctx.lineTo(x + w - 0.5, y + 0.5);
  ctx.stroke();
  // Lit edges.
  ctx.strokeStyle = METAL.edgeLit;
  ctx.beginPath();
  ctx.moveTo(x + w - 0.5, y + 0.5);
  ctx.lineTo(x + w - 0.5, y + h - 0.5);
  ctx.lineTo(x + 0.5, y + h - 0.5);
  ctx.stroke();
}

/** A single milled seam line — the reference's divider, not a glowing rule. */
export function seamLine(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y: number,
  x2: number,
  alpha = 1,
) {
  ctx.strokeStyle = alpha === 1 ? METAL.seam : `rgba(255,255,255,${0.055 * alpha})`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x1, Math.round(y) + 0.5);
  ctx.lineTo(x2, Math.round(y) + 0.5);
  ctx.stroke();
}

/**
 * A machined knob: a dark metal dome lit from the upper-left, a turned rim,
 * and a plain pointer line — no lit ring, no colour. `angle` is radians,
 * 0 = pointer straight up, so an existing rotation value can drive it
 * directly.
 */
export function machinedKnob(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  angle: number,
) {
  // Contact shadow under the knob.
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy + r * 0.06, r * 1.02, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.filter = "blur(6px)";
  ctx.fill();
  ctx.restore();

  // The dome. Offsetting the gradient origin up-left is what makes it read
  // as a sphere rather than a flat disc.
  const g = ctx.createRadialGradient(
    cx - r * 0.42,
    cy - r * 0.5,
    r * 0.06,
    cx,
    cy,
    r * 1.15,
  );
  g.addColorStop(0, "#5a5a5a");
  g.addColorStop(0.42, "#333333");
  g.addColorStop(1, "#141414");
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = g;
  ctx.fill();

  // Turned rim: dark outer line, faint lit arc on the lower-right.
  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(0,0,0,0.9)";
  ctx.beginPath();
  ctx.arc(cx, cy, r - 0.5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.beginPath();
  ctx.arc(cx, cy, r - 1.5, Math.PI * 0.15, Math.PI * 0.85);
  ctx.stroke();

  // Machined pointer.
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  ctx.strokeStyle = METAL.bright;
  ctx.lineWidth = Math.max(1.6, r * 0.075);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.24);
  ctx.lineTo(0, -r * 0.72);
  ctx.stroke();
  ctx.restore();
}

/**
 * A bank of steel-toned tines — a physical slider bank, not a screen. Each
 * tine is a rounded vertical bar whose brightness peaks at the centre and
 * falls off toward both ends. `sample(i, n)` returns 0..1 per tine.
 */
export function tineBank(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  count: number,
  sample: (index: number, count: number) => number,
) {
  const pitch = w / count;
  const barW = Math.max(2, pitch * 0.34);
  const cy = y + h / 2;

  for (let i = 0; i < count; i++) {
    const v = Math.max(0.08, Math.min(1, sample(i, count)));
    const barH = h * v;
    const bx = x + pitch * (i + 0.5) - barW / 2;
    const by = cy - barH / 2;

    // Vertical gradient: bright core, fading to nothing at both tips — the
    // detail that makes these read as lit metal tines rather than bars.
    const g = ctx.createLinearGradient(0, by, 0, by + barH);
    g.addColorStop(0, "rgba(154,161,167,0.05)");
    g.addColorStop(0.5, `rgba(214,220,226,${0.5 + v * 0.45})`);
    g.addColorStop(1, "rgba(154,161,167,0.05)");

    ctx.fillStyle = g;
    ctx.beginPath();
    if (typeof ctx.roundRect === "function") {
      ctx.roundRect(bx, by, barW, barH, barW / 2);
    } else {
      ctx.rect(bx, by, barW, barH);
    }
    ctx.fill();
  }
}

/**
 * The one accent light. Colour is passed in — on this site that is always
 * derived from `--phosphor`, keeping the "one signal colour" rule intact.
 */
export function statusLed(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  color: string,
  glow: string,
  intensity = 1,
) {
  ctx.save();
  ctx.shadowColor = glow;
  ctx.shadowBlur = 10 * intensity;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

/**
 * An organic knob: softer gradient, fluid rim light, and a rounded pointer dot
 * instead of a sharp line. Same contact shadow and positioning; different feel.
 * Used for B-SIDE to contrast with the mechanical A-SIDE knob.
 */
export function organicKnob(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  angle: number,
) {
  // Contact shadow under the knob (same as machined).
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy + r * 0.06, r * 1.02, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.filter = "blur(6px)";
  ctx.fill();
  ctx.restore();

  // The dome: warmer gradient, smoother transitions (organic).
  const g = ctx.createRadialGradient(
    cx - r * 0.35,
    cy - r * 0.4,
    r * 0.08,
    cx,
    cy,
    r * 1.15,
  );
  g.addColorStop(0, "#6a6a6a");
  g.addColorStop(0.35, "#3a3a3a");
  g.addColorStop(1, "#151515");
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = g;
  ctx.fill();

  // Fluid rim: softer edges, gentler arc.
  ctx.lineWidth = 0.8;
  ctx.strokeStyle = "rgba(0,0,0,0.7)";
  ctx.beginPath();
  ctx.arc(cx, cy, r - 0.5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.beginPath();
  ctx.arc(cx, cy, r - 1.5, Math.PI * 0.1, Math.PI * 0.9);
  ctx.stroke();

  // Organic pointer: rounded dot (circle) instead of sharp line.
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  const pointerR = Math.max(1.2, r * 0.055);
  ctx.fillStyle = METAL.bright;
  ctx.beginPath();
  ctx.arc(0, -r * 0.58, pointerR, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** Engraved monospace label, matching the site's mono type treatment. */
export function engrave(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  {
    size = 10,
    color = METAL.label,
    align = "center" as CanvasTextAlign,
    tracking = "0.18em",
  } = {},
) {
  ctx.save();
  ctx.font = `${size}px ui-monospace, "SF Mono", Menlo, Consolas, monospace`;
  withTracking(ctx, tracking);
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y);
  ctx.restore();
}
