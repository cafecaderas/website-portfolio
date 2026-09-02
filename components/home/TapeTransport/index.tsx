"use client";

import { useEffect, useRef } from "react";
import {
  fitCanvas,
  prefersReducedMotion,
  registerDraw,
  type CanvasMetrics,
} from "@/components/canvas/signal-engine";
import { SectionFieldLoader } from "@/components/three/SectionFieldLoader";
import { transportContent } from "@/lib/content/home";
import { computeGeometry, drawDeck, hitTestKnob } from "./draw";

/** Shortest signed angular distance from b to a, handling the ±π wrap. */
function angleDelta(a: number, b: number): number {
  let d = a - b;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return d;
}

/**
 * Rebuilt from the reference: a bare panel with the grid field on the left,
 * one draggable knob in the centre, and the flow field on the right. Scroll
 * position crossfades the A-SIDE/B-SIDE label under the knob. No audio, no
 * tines, no waveform readouts — matching the reference exactly before any
 * further behaviour gets layered back in.
 */
export function TapeTransport() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spoolRef = useRef(0);
  const spoolTargetRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    let metrics: CanvasMetrics | null = fitCanvas(canvas);

    // Manual drag state — a click-drag on the knob adds directly to its
    // rotation; releasing lets it coast briefly (spinVelocity decays to 0).
    let manualOffset = 0;
    let spinVelocity = 0;
    let dragging = false;
    let dragLastAngle = 0;

    const updateSpool = () => {
      const rect = wrap.getBoundingClientRect();
      const total = window.innerHeight + rect.height;
      const p = 1 - rect.bottom / total;
      spoolTargetRef.current = Math.max(0, Math.min(1, p));
    };

    const localPoint = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const onPointerDown = (e: PointerEvent) => {
      if (!metrics) return;
      const { x, y } = localPoint(e);
      if (!hitTestKnob(metrics.w, metrics.h, x, y)) return;
      const geo = computeGeometry(metrics.w, metrics.h);
      dragging = true;
      dragLastAngle = Math.atan2(y - geo.knob.cy, x - geo.knob.cx);
      spinVelocity = 0;
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = "grabbing";
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging || !metrics) return;
      const { x, y } = localPoint(e);
      const geo = computeGeometry(metrics.w, metrics.h);
      const angle = Math.atan2(y - geo.knob.cy, x - geo.knob.cx);
      const delta = angleDelta(angle, dragLastAngle);
      dragLastAngle = angle;
      manualOffset += delta;
      spinVelocity = delta;
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!dragging) return;
      canvas.releasePointerCapture(e.pointerId);
      dragging = false;
      canvas.style.cursor = "grab";
    };

    const draw = (t: number) => {
      spoolRef.current += (spoolTargetRef.current - spoolRef.current) * 0.09;
      if (!metrics) metrics = fitCanvas(canvas);
      if (!metrics) return;

      if (!dragging && Math.abs(spinVelocity) > 0.0005) {
        manualOffset += spinVelocity;
        spinVelocity *= 0.94;
      } else if (!dragging) {
        spinVelocity = 0;
      }

      drawDeck(metrics, { t, spool: spoolRef.current, angle: manualOffset });
    };

    const onResize = () => {
      metrics = fitCanvas(canvas);
      updateSpool();
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", updateSpool, { passive: true });
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);
    updateSpool();

    if (prefersReducedMotion()) {
      draw(1.2);
      return () => {
        window.removeEventListener("resize", onResize);
        window.removeEventListener("scroll", updateSpool);
        canvas.removeEventListener("pointerdown", onPointerDown);
        canvas.removeEventListener("pointermove", onPointerMove);
        canvas.removeEventListener("pointerup", onPointerUp);
        canvas.removeEventListener("pointercancel", onPointerUp);
      };
    }

    const unregister = registerDraw(draw, () => canvas.isConnected);
    return () => {
      unregister();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", updateSpool);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
    };
  }, []);

  return (
    <div className="transport" ref={wrapRef}>
      {/* A-SIDE (left): grid field — rigid, analytical structure. */}
      <SectionFieldLoader preset="tape-a" />
      {/* B-SIDE (right): flow field — organic, fluid expression. */}
      <SectionFieldLoader preset="tape-b" />
      {/* The 2D canvas deck sits on top with the corner bolts and the knob. */}
      <canvas
        ref={canvasRef}
        aria-label="Tape transport — a single knob between a rigid grid field and a flowing field; drag to spin it"
      />
      <span className="rd">
        <span>{transportContent.modeA}</span>
        <span className="side-sep">|</span>
        <span>{transportContent.modeB}</span>
      </span>
    </div>
  );
}
