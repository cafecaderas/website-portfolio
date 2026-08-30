"use client";

import { useEffect, useRef } from "react";
import {
  drawScope,
  fitCanvas,
  prefersReducedMotion,
  registerDraw,
  type CanvasMetrics,
  type ScopeMode,
} from "./signal-engine";

export interface ScopeProps {
  mode?: ScopeMode;
  amp?: number;
  className?: string;
}

/**
 * Generic oscilloscope/bars canvas. Every scope on the site — sidecard
 * minis, the works feature panel, the lab now-playing bar — renders
 * through this one component so they read as one signal.
 */
export function Scope({ mode = "wave", amp = 0.55, className }: ScopeProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const seed = Math.random() * 900;
    let metrics: CanvasMetrics | null = fitCanvas(canvas);

    const draw = (t: number) => {
      if (!metrics) metrics = fitCanvas(canvas);
      if (metrics) drawScope(metrics, t, { mode, amp, seed });
    };

    const onResize = () => {
      metrics = fitCanvas(canvas);
    };
    window.addEventListener("resize", onResize);

    if (prefersReducedMotion()) {
      draw(1.2);
      return () => window.removeEventListener("resize", onResize);
    }

    const unregister = registerDraw(
      draw,
      () => canvas.isConnected && !!canvas.offsetParent,
    );
    return () => {
      unregister();
      window.removeEventListener("resize", onResize);
    };
  }, [mode, amp]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
