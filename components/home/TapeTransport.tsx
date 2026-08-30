"use client";

import { useEffect, useRef } from "react";
import {
  fitCanvas,
  prefersReducedMotion,
  registerDraw,
  wave,
  type CanvasMetrics,
} from "@/components/canvas/signal-engine";

/**
 * The signature moment: two cassette reels + a tape band, spooled by
 * page scroll. The one scroll-driven animation on the site.
 */
export function TapeTransport() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const sideRef = useRef<HTMLSpanElement>(null);
  const spoolRef = useRef(0);
  const spoolTargetRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    let metrics: CanvasMetrics | null = fitCanvas(canvas);

    const updateSpool = () => {
      const rect = wrap.getBoundingClientRect();
      const total = window.innerHeight + rect.height;
      const p = 1 - rect.bottom / total;
      spoolTargetRef.current = Math.max(0, Math.min(1, p));
    };

    const drawDeck = (t: number) => {
      if (!metrics) return;
      const { ctx, w, h } = metrics;
      const spool = spoolRef.current;
      ctx.clearRect(0, 0, w, h);

      const cy = h * 0.5;
      const r = Math.min(h * 0.3, w * 0.13);
      const lx = w * 0.24;
      const rx = w * 0.76;
      const bandY = cy;
      const bandH = Math.max(26, r * 0.62);

      ctx.fillStyle = "#08120C";
      ctx.fillRect(lx, bandY - bandH / 2, rx - lx, bandH);
      ctx.strokeStyle = "rgba(57,255,106,0.3)";
      ctx.lineWidth = 1;
      ctx.strokeRect(lx + 0.5, bandY - bandH / 2 + 0.5, rx - lx - 1, bandH - 1);

      ctx.save();
      ctx.beginPath();
      ctx.rect(lx, bandY - bandH / 2, rx - lx, bandH);
      ctx.clip();
      ctx.shadowColor = "rgba(57,255,106,0.8)";
      ctx.shadowBlur = 9;
      ctx.strokeStyle = "#39FF6A";
      ctx.lineWidth = 1.5;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.beginPath();
      const drive = 0.35 + Math.min(1, Math.abs(spool) * 0.9) * 0.75;
      for (let x = lx; x <= rx; x += 1.5) {
        const y = bandY - wave(x - spool * 260, t, 3.1) * (bandH * 0.42) * drive;
        if (x === lx) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.restore();

      const ang = spool * 7.2 + t * 0.35;
      ([[lx, -1] as const, [rx, 1] as const]).forEach(([x, dir], i) => {
        const fill =
          i === 0
            ? 1 - Math.min(0.72, Math.max(0, spool))
            : 0.3 + Math.min(0.7, Math.max(0, spool));

        ctx.beginPath();
        ctx.arc(x, cy, r * (0.42 + fill * 0.55), 0, Math.PI * 2);
        ctx.fillStyle = "#1E1A17";
        ctx.fill();
        ctx.strokeStyle = "rgba(184,188,194,0.14)";
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x, cy, r * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = "#0C0A09";
        ctx.fill();
        ctx.strokeStyle = "rgba(184,188,194,0.3)";
        ctx.stroke();

        ctx.save();
        ctx.translate(x, cy);
        ctx.rotate(ang * dir);
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
        ctx.arc(x, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(184,188,194,0.22)";
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      ctx.fillStyle = "rgba(181,80,46,0.85)";
      ctx.fillRect(w / 2 - 16, bandY + bandH / 2 + 6, 32, 9);
    };

    const updateReadouts = () => {
      const spool = spoolRef.current;
      const secs = Math.round(spool * 372);
      if (countRef.current) {
        countRef.current.textContent =
          String(Math.floor(secs / 60)).padStart(3, "0") +
          ":" +
          String(secs % 60).padStart(2, "0");
      }
      if (sideRef.current) {
        sideRef.current.textContent = spool > 0.5 ? "B-SIDE" : "A-SIDE";
      }
    };

    const draw = (t: number) => {
      spoolRef.current += (spoolTargetRef.current - spoolRef.current) * 0.09;
      if (!metrics) metrics = fitCanvas(canvas);
      drawDeck(t);
      updateReadouts();
    };

    const onResize = () => {
      metrics = fitCanvas(canvas);
      updateSpool();
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", updateSpool, { passive: true });
    updateSpool();

    if (prefersReducedMotion()) {
      draw(1.2);
      return () => {
        window.removeEventListener("resize", onResize);
        window.removeEventListener("scroll", updateSpool);
      };
    }

    const unregister = registerDraw(draw, () => canvas.isConnected);
    return () => {
      unregister();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", updateSpool);
    };
  }, []);

  return (
    <div className="transport" ref={wrapRef}>
      <canvas ref={canvasRef} aria-label="Tape transport that spools as you scroll" />
      <span className="hint">SCROLL TO SPOOL</span>
      <span className="rd">
        <span ref={sideRef}>A-SIDE</span>
        <span ref={countRef} className="mono">
          000:00
        </span>
        <span>CH1 · 500mV</span>
      </span>
    </div>
  );
}
