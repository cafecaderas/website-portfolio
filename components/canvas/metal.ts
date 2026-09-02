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
 * A single rack-mount bolt — the small screw at each panel corner that
 * reads as hardware rather than a flat rectangle.
 */
export function cornerBolt(ctx: CanvasRenderingContext2D, cx: number, cy: number, r = 4) {
  const g = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.1, cx, cy, r);
  g.addColorStop(0, "#5a5a5a");
  g.addColorStop(1, "#101010");
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = g;
  ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.85)";
  ctx.lineWidth = 0.6;
  ctx.stroke();
  ctx.strokeStyle = "rgba(0,0,0,0.7)";
  ctx.lineWidth = 0.9;
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.5, cy);
  ctx.lineTo(cx + r * 0.5, cy);
  ctx.stroke();
}

/**
 * A single chrome dome knob flanked by two glowing arc brackets — the one
 * knob style shared by both A-SIDE and B-SIDE. Realistic shiny metal with a
 * bright specular highlight, plus a phosphor-lit arc curving down either
 * side, echoing a hardware level indicator. `angle` drives a small dark
 * pointer notch at the rim.
 */
export function neoKnob(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  angle: number,
  glowColor: string,
  glow: string,
) {
  // Contact shadow.
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy + r * 0.08, r * 1.1, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.filter = "blur(8px)";
  ctx.fill();
  ctx.restore();

  // Glowing arc brackets flanking the knob on either side.
  const arcR = r * 1.32;
  ctx.save();
  ctx.strokeStyle = glow;
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = 10;
  ctx.lineWidth = 2.5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(cx, cy, arcR, Math.PI * 0.62, Math.PI * 1.38);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, arcR, -Math.PI * 0.38, Math.PI * 0.38);
  ctx.stroke();
  ctx.restore();

  // Chrome dome: bright specular highlight fading to a dark edge.
  const g = ctx.createRadialGradient(
    cx - r * 0.4,
    cy - r * 0.45,
    r * 0.05,
    cx,
    cy,
    r * 1.1,
  );
  g.addColorStop(0, "#f4f4f4");
  g.addColorStop(0.25, "#c9c9c9");
  g.addColorStop(0.55, "#797979");
  g.addColorStop(0.8, "#3c3c3c");
  g.addColorStop(1, "#141414");
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = g;
  ctx.fill();

  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(0,0,0,0.85)";
  ctx.beginPath();
  ctx.arc(cx, cy, r - 0.5, 0, Math.PI * 2);
  ctx.stroke();

  // Pointer: a small dark notch at the rim, rotating with `angle`.
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  ctx.fillStyle = "#161616";
  ctx.beginPath();
  ctx.arc(0, -r * 0.62, Math.max(1.4, r * 0.09), 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/**
 * Shared dark-matte knob base for the neo-trance pair below: a flat, muted
 * disc (no chrome specular) so both knobs read as the same material —
 * their personality comes entirely from the rim treatment and pointer.
 */
function knobBase(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy + r * 0.06, r * 1.05, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.filter = "blur(6px)";
  ctx.fill();
  ctx.restore();

  const g = ctx.createRadialGradient(cx, cy, r * 0.1, cx, cy, r * 1.05);
  g.addColorStop(0, "#232323");
  g.addColorStop(0.7, "#161616");
  g.addColorStop(1, "#0d0d0d");
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = g;
  ctx.fill();

  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(0,0,0,0.9)";
  ctx.beginPath();
  ctx.arc(cx, cy, r - 0.5, 0, Math.PI * 2);
  ctx.stroke();
}

/**
 * A-SIDE: rigid/mechanical. A dark matte disc ringed with discrete glowing
 * tick marks — a rotary encoder read — and a sharp glowing pointer line.
 * `angle` is radians, 0 = pointer straight up.
 */
export function machinedKnob(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  angle: number,
  glowColor: string,
  glow: string,
) {
  knobBase(ctx, cx, cy, r);

  // Discrete tick marks around the rim — the "rigid" read. Twelve fixed
  // positions, each a short glowing radial line, brighter near the pointer.
  const TICKS = 12;
  for (let i = 0; i < TICKS; i++) {
    const a = (i / TICKS) * Math.PI * 2;
    const near = Math.max(0, Math.cos(a - angle));
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(a);
    ctx.strokeStyle = glow;
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 2 + near * 4;
    ctx.lineWidth = 1.4;
    ctx.globalAlpha = 0.35 + near * 0.55;
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.82);
    ctx.lineTo(0, -r * 0.98);
    ctx.stroke();
    ctx.restore();
  }

  // Sharp glowing pointer.
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  ctx.strokeStyle = glowColor;
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = 8;
  ctx.lineWidth = Math.max(1.6, r * 0.075);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.18);
  ctx.lineTo(0, -r * 0.68);
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
 * A small glowing waveform trace — sine, sawtooth, or square — reading the
 * actual selected audio waveform rather than a generic scribble. `phase`
 * animates it left-to-right over time; `amp` (0..1) scales height with
 * audio/interaction energy.
 */
export function waveformTrace(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  shape: "sine" | "sawtooth" | "square",
  phase: number,
  amp: number,
  glowColor: string,
) {
  const steps = 48;
  const cy = y + h / 2;
  ctx.save();
  ctx.strokeStyle = glowColor;
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = 4;
  ctx.lineWidth = 1.3;
  ctx.globalAlpha = 0.75;
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const f = i / steps;
    const p = f * Math.PI * 4 + phase;
    let v: number;
    if (shape === "sine") {
      v = Math.sin(p);
    } else if (shape === "sawtooth") {
      v = ((p / Math.PI) % 2) - 1;
    } else {
      v = Math.sin(p) >= 0 ? 1 : -1;
    }
    const px = x + f * w;
    const py = cy - v * (h / 2) * amp;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();
  ctx.restore();
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
 * B-SIDE: fluid/organic. Same dark matte base as `machinedKnob`, ringed with
 * a continuous, breathing glow instead of discrete ticks — a smooth halo
 * whose brightness swells and fades around the rim — plus a rounded glowing
 * pointer dot instead of a sharp line. `t` drives the breathing animation.
 */
export function organicKnob(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  angle: number,
  glowColor: string,
  glow: string,
  t: number,
) {
  knobBase(ctx, cx, cy, r);

  // Continuous glow ring — a soft halo whose intensity breathes over time,
  // the "fluid" counterpart to A-SIDE's fixed tick marks.
  const breathe = 0.6 + 0.4 * Math.sin(t * 1.3);
  ctx.save();
  ctx.strokeStyle = glow;
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = 10 + breathe * 6;
  ctx.lineWidth = 1.6;
  ctx.globalAlpha = 0.5 + breathe * 0.4;
  ctx.beginPath();
  ctx.arc(cx, cy, r - 1.5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Organic pointer: rounded glowing dot instead of a sharp line.
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  const pointerR = Math.max(1.6, r * 0.09);
  ctx.fillStyle = glowColor;
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.arc(0, -r * 0.6, pointerR, 0, Math.PI * 2);
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
