import { getPhosphorColor, phosphorRgba, type CanvasMetrics } from "@/components/canvas/signal-engine";
import { cornerBolt, engrave, METAL, neoKnob } from "@/components/canvas/metal";
import { transportContent } from "@/lib/content/home";

export interface KnobGeometry {
  cx: number;
  cy: number;
  r: number;
}

export interface DeckGeometry {
  knob: KnobGeometry;
  /** Inner plate the grid/flow fields and knob sit on. */
  plate: { x: number; y: number; w: number; h: number };
}

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

  const cx = plate.x + plate.w / 2;
  const cy = plate.y + plate.h * 0.44;
  const r = Math.min(plate.h * 0.26, plate.w * 0.065);

  return {
    knob: { cx, cy, r },
    plate,
  };
}

/** Whether a canvas-space point (CSS pixels) falls on the single knob. */
export function hitTestKnob(w: number, h: number, x: number, y: number): boolean {
  const geo = computeGeometry(w, h);
  const dx = x - geo.knob.cx;
  const dy = y - geo.knob.cy;
  const hit = geo.knob.r * 1.15;
  return dx * dx + dy * dy <= hit * hit;
}

export interface DrawState {
  t: number;
  /** 0..1, how far scrolled through the section — crossfades the A/B label. */
  spool: number;
  /** Knob rotation angle (radians) — manual drag offset only, no auto-spin. */
  angle: number;
}

/**
 * The rebuilt deck: a bare panel with one chrome knob in the centre,
 * flanked by the grid field (left) and the flow field (right, mounted by
 * the parent component as WebGL layers behind this canvas). Corner bolts
 * read as hardware. No tines, no waveform traces, no audio drive — matching
 * the reference exactly before any further behaviour is layered back in.
 */
export function drawDeck(metrics: CanvasMetrics, state: DrawState) {
  const { ctx, w, h } = metrics;
  const { spool, angle } = state;
  const geo = computeGeometry(w, h);
  const { plate, knob } = geo;

  ctx.clearRect(0, 0, w, h);

  // Outer panel.
  ctx.fillStyle = METAL.face;
  ctx.fillRect(0, 0, w, h);

  // Inner plate: cleared so the grid/flow fields behind show through, with
  // a plain hairline border — no milled texture, no fill, per the reference.
  ctx.clearRect(plate.x, plate.y, plate.w, plate.h);
  ctx.strokeStyle = "rgba(255,255,255,0.09)";
  ctx.lineWidth = 1;
  ctx.strokeRect(plate.x + 0.5, plate.y + 0.5, plate.w - 1, plate.h - 1);

  // Corner bolts.
  const inset = 14;
  cornerBolt(ctx, plate.x + inset, plate.y + inset);
  cornerBolt(ctx, plate.x + plate.w - inset, plate.y + inset);
  cornerBolt(ctx, plate.x + inset, plate.y + plate.h - inset);
  cornerBolt(ctx, plate.x + plate.w - inset, plate.y + plate.h - inset);

  // The one knob, centred between the two fields.
  const glowColor = getPhosphorColor();
  const glow = phosphorRgba(0.9);
  neoKnob(ctx, knob.cx, knob.cy, knob.r, angle, glowColor, glow);

  // Label under the knob: crossfades between A-SIDE and B-SIDE with spool.
  const labelY = knob.cy + knob.r + 18;
  ctx.save();
  ctx.globalAlpha = 1 - spool;
  engrave(ctx, transportContent.sideA, knob.cx, labelY, { size: 10, color: METAL.label });
  ctx.restore();
  ctx.save();
  ctx.globalAlpha = spool;
  engrave(ctx, transportContent.sideB, knob.cx, labelY, { size: 10, color: METAL.label });
  ctx.restore();
}
