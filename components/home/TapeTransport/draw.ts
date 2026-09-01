import { getPhosphorColor, phosphorRgba, wave, type CanvasMetrics } from "@/components/canvas/signal-engine";
import {
  bezelPanel,
  engrave,
  machinedKnob,
  organicKnob,
  METAL,
  millGrain,
  seamLine,
  statusLed,
  tineBank,
} from "@/components/canvas/metal";
import { transportContent } from "@/lib/content/home";

export interface ReelGeometry {
  cx: number;
  cy: number;
  r: number;
}

export interface DeckGeometry {
  left: ReelGeometry;
  right: ReelGeometry;
  bandY: number;
  bandH: number;
  lx: number;
  rx: number;
  /** Inner milled plate the controls sit on. */
  plate: { x: number; y: number; w: number; h: number };
}

const TINE_COUNT = 13;
/** The deck is a unit of equipment, not a stretched bar — it stops widening. */
const MAX_DECK_W = 1080;

export function computeGeometry(w: number, h: number): DeckGeometry {
  const pad = Math.max(10, Math.min(22, w * 0.014));
  const plateW = Math.min(w - pad * 2, MAX_DECK_W);
  const plate = {
    x: (w - plateW) / 2,
    y: pad,
    w: plateW,
    h: h - pad * 2,
  };

  // Knobs sit slightly above centre so the engraved label below them has
  // room without crowding the bottom readout row.
  const cy = plate.y + plate.h * 0.46;
  const r = Math.min(plate.h * 0.25, plate.w * 0.055);
  const lx = plate.x + plate.w * 0.16;
  const rx = plate.x + plate.w * 0.84;

  return {
    left: { cx: lx, cy, r },
    right: { cx: rx, cy, r },
    bandY: cy,
    bandH: Math.max(26, r * 1.5),
    lx,
    rx,
    plate,
  };
}

/** Which knob (if any) a canvas-space point (CSS pixels) falls inside. */
export function hitTestReel(w: number, h: number, x: number, y: number): "left" | "right" | null {
  const geo = computeGeometry(w, h);
  for (const side of ["left", "right"] as const) {
    const reel = geo[side];
    const dx = x - reel.cx;
    const dy = y - reel.cy;
    // Slightly generous target — the knob is small on narrow viewports.
    const hit = reel.r * 1.15;
    if (dx * dx + dy * dy <= hit * hit) return side;
  }
  return null;
}

export interface DrawState {
  t: number;
  /** 0..1, how far scrolled through the section — drives which side is dominant. */
  spool: number;
  /** Combined signal-intensity × mouse/scroll energy multiplier. */
  driveEnergy: number;
  /** Final rotation angle (radians) for each knob — auto-spin + any manual drag offset. */
  leftAngle: number;
  rightAngle: number;
}

/**
 * The cast deck: a milled metal face, two machined knobs, a bank of steel
 * tines between them, and exactly one lit element (the PWR lamp, in
 * `--phosphor`). Everything that moves is still driven by the same values as
 * before — spool position, drag angle, and real mouse/scroll/audio energy.
 */
export function drawDeck(metrics: CanvasMetrics, state: DrawState) {
  const { ctx, w, h } = metrics;
  const { t, spool, driveEnergy, leftAngle, rightAngle } = state;
  const geo = computeGeometry(w, h);
  const { lx, rx, plate } = geo;

  ctx.clearRect(0, 0, w, h);

  // --- panel ---------------------------------------------------------------
  // The outer face is solid metal; the inner plate is cut back to a
  // translucent fill so the WebGL tape-flow field behind the deck reads
  // faintly *through* it, like a backlit window in the casing.
  ctx.fillStyle = METAL.face;
  ctx.fillRect(0, 0, w, h);
  millGrain(ctx, 0, 0, w, h, 3, 0.016);

  ctx.clearRect(plate.x, plate.y, plate.w, plate.h);
  bezelPanel(ctx, plate.x, plate.y, plate.w, plate.h, "rgba(20,20,20,0.82)");
  millGrain(ctx, plate.x + 1, plate.y + 1, plate.w - 2, plate.h - 2, 3, 0.02);

  // --- the one accent light ------------------------------------------------
  const pwrY = plate.y + Math.max(14, plate.h * 0.1);
  const pulse = 0.72 + 0.28 * Math.sin(t * 1.6);
  statusLed(ctx, w / 2 - 26, pwrY, 3.2, getPhosphorColor(), phosphorRgba(0.9), pulse);
  engrave(ctx, transportContent.power, w / 2 - 14, pwrY, {
    size: 9.5,
    color: METAL.label,
    align: "left",
  });

  // --- milled seam behind the tines ---------------------------------------
  const seamY = geo.bandY;
  seamLine(ctx, lx + geo.left.r * 1.5, seamY, rx - geo.right.r * 1.5);

  // --- tine bank -----------------------------------------------------------
  // A tight cluster in the middle of the plate, not a bar stretched between
  // the knobs — closer to a physical slider bank, as in the reference.
  const tineW = Math.min(plate.w * 0.42, rx - lx - geo.left.r * 3.4);
  const tineX = plate.x + plate.w / 2 - tineW / 2;
  const tineH = plate.h * 0.46;
  if (tineW > 40) {
    // A travelling wave, so it reads as signal moving through the deck,
    // scaled by the same drive energy the old waveform used. The arch
    // envelope keeps the outer tines shorter, as on a real slider bank.
    const drive = (0.34 + Math.min(1, Math.abs(spool) * 0.9) * 0.66) * driveEnergy;
    tineBank(ctx, tineX, seamY - tineH / 2, tineW, tineH, TINE_COUNT, (i, n) => {
      const f = i / (n - 1);
      const travelling = Math.abs(wave(f * 300 - spool * 220, t, 3.1));
      const arch = 0.58 + 0.42 * Math.sin(Math.PI * f);
      return (0.34 + travelling * 0.66 * drive) * arch;
    });
  }

  // --- knobs ---------------------------------------------------------------
  // Dual knob styles: A-SIDE sharp/mechanical, B-SIDE soft/organic.
  // The dominance crossfades with spool position (0=A, 1=B).
  const labelY = geo.left.cy + geo.left.r + 15;

  // A-SIDE: mechanical/industrial (left knob).
  // Fully visible when spool < 0.5, fades as B takes over.
  const aSideFade = Math.max(0, 1 - spool * 2);
  if (aSideFade > 0.01) {
    ctx.save();
    ctx.globalAlpha = aSideFade;
    machinedKnob(ctx, geo.left.cx, geo.left.cy, geo.left.r, leftAngle);
    ctx.restore();
  }

  // B-SIDE: organic/handmade (left knob underneath).
  // Hidden initially, shows as A fades.
  const bSideFade = Math.max(0, (spool - 0.5) * 2);
  if (bSideFade > 0.01) {
    ctx.save();
    ctx.globalAlpha = bSideFade;
    organicKnob(ctx, geo.left.cx, geo.left.cy, geo.left.r, leftAngle);
    ctx.restore();
  }

  // Labels (always visible, consistent).
  engrave(ctx, transportContent.knobLeft, geo.left.cx, labelY, { size: 9.5 });

  // Right knob: symmetric crossfade (inverse of left).
  // A-SIDE starts faded, B-SIDE fades in.
  if (aSideFade > 0.01) {
    ctx.save();
    ctx.globalAlpha = aSideFade;
    machinedKnob(ctx, geo.right.cx, geo.right.cy, geo.right.r, rightAngle);
    ctx.restore();
  }
  if (bSideFade > 0.01) {
    ctx.save();
    ctx.globalAlpha = bSideFade;
    organicKnob(ctx, geo.right.cx, geo.right.cy, geo.right.r, rightAngle);
    ctx.restore();
  }

  engrave(ctx, transportContent.knobRight, geo.right.cx, labelY, { size: 9.5 });
}
