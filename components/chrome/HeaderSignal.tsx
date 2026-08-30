"use client";

import { useEffect, useRef } from "react";
import { fitCanvas, phosphorRgba, prefersReducedMotion, registerDraw, type CanvasMetrics } from "@/components/canvas/signal-engine";

/**
 * The header hairline: a single phosphor pulse travelling left→right on
 * a loop. This is the site's heartbeat and has a switch for always-on signal color.
 */
export function HeaderSignal() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    let metrics: CanvasMetrics | null = fitCanvas(canvas);

    const draw = (t: number) => {
      if (!metrics) metrics = fitCanvas(canvas);
      if (!metrics) return;
      const { ctx, w, h } = metrics;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = phosphorRgba(0.14);
      ctx.fillRect(0, 0, w, h);
      const x = (t * 150) % (w + 180) - 90;
      const gradient = ctx.createLinearGradient(x - 90, 0, x + 90, 0);
      gradient.addColorStop(0, phosphorRgba(0));
      gradient.addColorStop(0.5, phosphorRgba(0.95));
      gradient.addColorStop(1, phosphorRgba(0));
      ctx.fillStyle = gradient;
      ctx.fillRect(x - 90, 0, 180, h);
    };

    const onResize = () => {
      metrics = fitCanvas(canvas);
    };
    window.addEventListener("resize", onResize);

    if (prefersReducedMotion()) {
      draw(0.6);
      return () => window.removeEventListener("resize", onResize);
    }

    const unregister = registerDraw(draw, () => canvas.isConnected);
    return () => {
      unregister();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="hdr-sig">
      <canvas ref={ref} aria-hidden="true" />
    </div>
  );
}
