import { getPhosphorColor, phosphorRgba, wave, type CanvasMetrics } from "@/components/canvas/signal-engine";

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
}

export function computeGeometry(w: number, h: number): DeckGeometry {
  const cy = h * 0.5;
  const r = Math.min(h * 0.3, w * 0.13);
  const lx = w * 0.24;
  const rx = w * 0.76;
  return {
    left: { cx: lx, cy, r },
    right: { cx: rx, cy, r },
    bandY: cy,
    bandH: Math.max(26, r * 0.62),
    lx,
    rx,
  };
}

/** Which reel (if any) a canvas-space point (CSS pixels) falls inside. */
export function hitTestReel(w: number, h: number, x: number, y: number): "left" | "right" | null {
  const geo = computeGeometry(w, h);
  for (const side of ["left", "right"] as const) {
    const reel = geo[side];
    const dx = x - reel.cx;
    const dy = y - reel.cy;
    if (dx * dx + dy * dy <= reel.r * reel.r) return side;
  }
  return null;
}

export interface DrawState {
  t: number;
  /** 0..1, how far scrolled through the section — drives which side is dominant. */
  spool: number;
  /** Combined signal-intensity × mouse/scroll energy multiplier for the waveform. */
  driveEnergy: number;
  /** Final rotation angle (radians) for each reel — auto-spin + any manual drag offset, already summed by the caller. */
  leftAngle: number;
  rightAngle: number;
}

export function drawDeck(metrics: CanvasMetrics, state: DrawState) {
  const { ctx, w, h } = metrics;
  const { t, spool, driveEnergy, leftAngle, rightAngle } = state;
  const geo = computeGeometry(w, h);
  const { bandY, bandH, lx, rx } = geo;
  ctx.clearRect(0, 0, w, h);

  ctx.fillStyle = "#08120C";
  ctx.fillRect(lx, bandY - bandH / 2, rx - lx, bandH);
  ctx.strokeStyle = phosphorRgba(0.3);
  ctx.lineWidth = 1;
  ctx.strokeRect(lx + 0.5, bandY - bandH / 2 + 0.5, rx - lx - 1, bandH - 1);

  ctx.save();
  ctx.beginPath();
  ctx.rect(lx, bandY - bandH / 2, rx - lx, bandH);
  ctx.clip();
  ctx.shadowColor = phosphorRgba(0.8);
  ctx.shadowBlur = 9;
  ctx.strokeStyle = getPhosphorColor();
  ctx.lineWidth = 1.5;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.beginPath();
  const drive = (0.35 + Math.min(1, Math.abs(spool) * 0.9) * 0.75) * driveEnergy;
  for (let x = lx; x <= rx; x += 1.5) {
    const y = bandY - wave(x - spool * 260, t, 3.1) * (bandH * 0.42) * drive;
    if (x === lx) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.restore();

  (
    [
      [geo.left, leftAngle, 0] as const,
      [geo.right, rightAngle, 1] as const,
    ] as const
  ).forEach(([reel, angle, i]) => {
    const { cx, cy, r } = reel;
    const fill = i === 0 ? 1 - Math.min(0.72, Math.max(0, spool)) : 0.3 + Math.min(0.7, Math.max(0, spool));

    ctx.beginPath();
    ctx.arc(cx, cy, r * (0.42 + fill * 0.55), 0, Math.PI * 2);
    ctx.fillStyle = "#1E1A17";
    ctx.fill();
    ctx.strokeStyle = "rgba(184,188,194,0.14)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = "#0C0A09";
    ctx.fill();
    ctx.strokeStyle = "rgba(184,188,194,0.3)";
    ctx.stroke();

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.strokeStyle = "rgba(184,188,194,0.55)";
    ctx.lineWidth = 2.2;
    for (let k = 0; k < 3; k++) {
      ctx.rotate((Math.PI * 2) / 3);
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.1);
      ctx.lineTo(0, -r * 0.29);
      ctx.stroke();
    }
    ctx.restore();

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(184,188,194,0.22)";
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  ctx.fillStyle = "rgba(181,80,46,0.85)";
  ctx.fillRect(w / 2 - 16, bandY + bandH / 2 + 6, 32, 9);
}
