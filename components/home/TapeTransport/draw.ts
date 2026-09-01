import { getPhosphorColor, phosphorRgba, wave, type CanvasMetrics } from "@/components/canvas/signal-engine";
import { getWaveform } from "@/components/canvas/audio-engine";
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
  waveformTrace,
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
 * The cast deck: split visual design showing A-SIDE (left, mechanical) and
 * B-SIDE (right, organic). Both halves are always visible with their own knobs,
 * fields, and tines. Everything driven by the same spool/drag/energy values,
 * but expressed with distinct visual personalities.
 */
export function drawDeck(metrics: CanvasMetrics, state: DrawState) {
  const { ctx, w, h } = metrics;
  const { t, spool, driveEnergy, leftAngle, rightAngle } = state;
  const geo = computeGeometry(w, h);
  const { lx, rx, plate } = geo;

  ctx.clearRect(0, 0, w, h);

  // --- outer panel (full width) -----------------------------------------------
  ctx.fillStyle = METAL.face;
  ctx.fillRect(0, 0, w, h);
  millGrain(ctx, 0, 0, w, h, 3, 0.016);

  // --- split the deck down the middle -----------------------------------------
  // A-SIDE (left half): inner plate, mechanical knob, grid field visible
  // B-SIDE (right half): inner plate, organic knob, flow field visible
  const midX = w / 2;

  // A-SIDE inner plate (left half)
  ctx.clearRect(plate.x, plate.y, midX - plate.x, plate.h);
  bezelPanel(ctx, plate.x, plate.y, midX - plate.x, plate.h, "rgba(20,20,20,0.82)");
  millGrain(ctx, plate.x + 1, plate.y + 1, midX - plate.x - 2, plate.h - 2, 3, 0.02);

  // B-SIDE inner plate (right half)
  ctx.clearRect(midX, plate.y, plate.x + plate.w - midX, plate.h);
  bezelPanel(ctx, midX, plate.y, plate.x + plate.w - midX, plate.h, "rgba(20,20,20,0.82)");
  millGrain(ctx, midX + 1, plate.y + 1, plate.x + plate.w - midX - 2, plate.h - 2, 3, 0.02);

  // --- center divider seam (vertical) ----------------------------------------
  ctx.strokeStyle = METAL.seam;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(midX + 0.5, plate.y + 4);
  ctx.lineTo(midX + 0.5, plate.y + plate.h - 4);
  ctx.stroke();

  // --- PWR lamp (top center) -------------------------------------------------
  const pwrY = plate.y + Math.max(14, plate.h * 0.1);
  const pulse = 0.72 + 0.28 * Math.sin(t * 1.6);
  statusLed(ctx, midX - 26, pwrY, 3.2, getPhosphorColor(), phosphorRgba(0.9), pulse);
  engrave(ctx, transportContent.power, midX - 14, pwrY, {
    size: 9.5,
    color: METAL.label,
    align: "left",
  });

  // --- tine banks (one per side) -----------------------------------------------
  const seamY = geo.bandY;
  const tineHalfW = Math.min(plate.w * 0.2, (rx - lx - geo.left.r * 3.4) / 2);
  const tineH = plate.h * 0.46;

  // Shared drive energy for both tines: responsive to spool + audio/interaction.
  // Higher base (0.42) for visible animation + 1.2x multiplier for audio sensitivity.
  const drive = (0.42 + Math.min(1, Math.abs(spool) * 0.9) * 0.68) * driveEnergy * 1.2;

  // A-SIDE tines (left)
  const tineXLeft = midX / 2 - tineHalfW / 2;
  if (tineHalfW > 30) {
    tineBank(ctx, tineXLeft, seamY - tineH / 2, tineHalfW, tineH, 6, (i, n) => {
      const f = i / (n - 1);
      const travelling = Math.abs(wave(f * 300 - spool * 220, t, 3.1));
      const arch = 0.58 + 0.42 * Math.sin(Math.PI * f);
      return (0.34 + travelling * 0.66 * drive) * arch;
    });
  }

  // B-SIDE tines (right)
  const tineXRight = midX + (w - midX) / 2 - tineHalfW / 2;
  if (tineHalfW > 30) {
    tineBank(ctx, tineXRight, seamY - tineH / 2, tineHalfW, tineH, 6, (i, n) => {
      const f = i / (n - 1);
      const travelling = Math.abs(wave(f * 300 - spool * 220, t, 3.1));
      const arch = 0.58 + 0.42 * Math.sin(Math.PI * f);
      return (0.34 + travelling * 0.66 * drive) * arch;
    });
  }

  // --- audio waveform traces (one per side, reading the live waveform) -------
  const waveform = getWaveform();
  const waveGlow = phosphorRgba(0.85);
  const waveY = seamY + tineH / 2 + 10;
  const waveH = Math.max(14, plate.h * 0.1);
  const waveAmp = Math.min(1, 0.5 + (driveEnergy - 1) * 0.6);
  if (tineHalfW > 30 && waveY + waveH < plate.y + plate.h - 6) {
    waveformTrace(ctx, tineXLeft, waveY, tineHalfW, waveH, waveform, t * 2.2, waveAmp, waveGlow);
    waveformTrace(ctx, tineXRight, waveY, tineHalfW, waveH, waveform, t * 2.2 + Math.PI, waveAmp, waveGlow);
  }

  // --- knobs (both always visible, matching neo-trance material) -------------
  const labelY = geo.left.cy + geo.left.r + 15;
  const glowColor = getPhosphorColor();
  const glow = phosphorRgba(0.9);

  // A-SIDE: dark matte base, discrete glowing tick marks, sharp pointer.
  machinedKnob(ctx, lx, geo.left.cy, geo.left.r, leftAngle, glowColor, glow);
  engrave(ctx, transportContent.knobLeft, lx, labelY, { size: 9.5 });

  // B-SIDE: same base, continuous breathing glow ring, rounded pointer.
  organicKnob(ctx, rx, geo.left.cy, geo.left.r, rightAngle, glowColor, glow, t);
  engrave(ctx, transportContent.knobRight, rx, labelY, { size: 9.5 });
}
