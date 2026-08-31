"use client";

import { useEffect, useRef } from "react";
import {
  fitCanvas,
  getSignalIntensity,
  prefersReducedMotion,
  registerDraw,
  type CanvasMetrics,
} from "@/components/canvas/signal-engine";
import { getInteractionEnergy, getSiteElapsedSeconds } from "@/components/canvas/interaction-engine";
import { SectionFieldLoader } from "@/components/three/SectionFieldLoader";
import { transportContent } from "@/lib/content/home";
import { computeGeometry, drawDeck, hitTestReel } from "./draw";

/** Shortest signed angular distance from b to a, handling the ±π wrap. */
function angleDelta(a: number, b: number): number {
  let d = a - b;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return d;
}

/**
 * The signature moment: two cassette reels + a tape band. Scroll still
 * drives which side is dominant (and the overall spool position), but the
 * waveform's energy now comes from real mouse/scroll activity instead of
 * audio, the counter is a real elapsed-time clock, both A-SIDE and B-SIDE
 * are always visible and crossfade against each other, and the reels can
 * be clicked and dragged to spin by hand.
 */
export function TapeTransport() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const aRef = useRef<HTMLSpanElement>(null);
  const bRef = useRef<HTMLSpanElement>(null);
  const spoolRef = useRef(0);
  const spoolTargetRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    let metrics: CanvasMetrics | null = fitCanvas(canvas);

    // Manual drag state — a click-drag on a reel adds directly to its
    // rotation; releasing lets it coast briefly (spinVelocity decays to 0).
    const manualOffset = { left: 0, right: 0 };
    const spinVelocity = { left: 0, right: 0 };
    let dragSide: "left" | "right" | null = null;
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
      const side = hitTestReel(metrics.w, metrics.h, x, y);
      if (!side) return;
      const geo = computeGeometry(metrics.w, metrics.h);
      const reel = geo[side];
      dragSide = side;
      dragLastAngle = Math.atan2(y - reel.cy, x - reel.cx);
      spinVelocity[side] = 0;
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = "grabbing";
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragSide || !metrics) return;
      const { x, y } = localPoint(e);
      const geo = computeGeometry(metrics.w, metrics.h);
      const reel = geo[dragSide];
      const angle = Math.atan2(y - reel.cy, x - reel.cx);
      const delta = angleDelta(angle, dragLastAngle);
      dragLastAngle = angle;
      manualOffset[dragSide] += delta;
      spinVelocity[dragSide] = delta;
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!dragSide) return;
      canvas.releasePointerCapture(e.pointerId);
      dragSide = null;
      canvas.style.cursor = "grab";
    };

    const drawDeckFrame = (t: number) => {
      if (!metrics) return;
      const spool = spoolRef.current;

      for (const side of ["left", "right"] as const) {
        if (dragSide !== side && Math.abs(spinVelocity[side]) > 0.0005) {
          manualOffset[side] += spinVelocity[side];
          spinVelocity[side] *= 0.94;
        } else if (dragSide !== side) {
          spinVelocity[side] = 0;
        }
      }

      const autoAngle = spool * 7.2 + t * 0.35;
      const driveEnergy = getSignalIntensity() * getInteractionEnergy(t);

      drawDeck(metrics, {
        t,
        spool,
        driveEnergy,
        leftAngle: -autoAngle + manualOffset.left,
        rightAngle: autoAngle + manualOffset.right,
      });
    };

    const updateReadouts = () => {
      const spool = spoolRef.current;
      const elapsed = Math.floor(getSiteElapsedSeconds());
      if (countRef.current) {
        countRef.current.textContent =
          String(Math.floor(elapsed / 60)).padStart(3, "0") + ":" + String(elapsed % 60).padStart(2, "0");
      }
      // Both sides stay visible; whichever is dominant brightens while the
      // other dims — a continuous crossfade, not a hard swap.
      if (aRef.current) aRef.current.style.opacity = String(0.25 + 0.75 * (1 - spool));
      if (bRef.current) bRef.current.style.opacity = String(0.25 + 0.75 * spool);
    };

    const draw = (t: number) => {
      spoolRef.current += (spoolTargetRef.current - spoolRef.current) * 0.09;
      if (!metrics) metrics = fitCanvas(canvas);
      drawDeckFrame(t);
      updateReadouts();
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
      {/* Flowing tape-path field behind the deck. The 2D canvas above keeps
          every existing behaviour — spool, drag, inertia, readouts. */}
      <SectionFieldLoader preset="tape" />
      <canvas
        ref={canvasRef}
        aria-label="Tape transport — spools as you scroll and reacts to the mouse; drag either reel to spin it by hand"
      />
      <span className="hint">{transportContent.hint}</span>
      <span className="rd">
        <span className="sides-live">
          <span ref={aRef} className="side-label">
            {transportContent.sideA}
          </span>
          <span className="side-sep">·</span>
          <span ref={bRef} className="side-label">
            {transportContent.sideB}
          </span>
        </span>
        <span ref={countRef} className="mono">
          000:00
        </span>
        <span className="stamp">{transportContent.stamp}</span>
      </span>
    </div>
  );
}
