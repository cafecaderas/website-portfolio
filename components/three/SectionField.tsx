"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { prefersReducedMotion } from "@/components/canvas/signal-engine";
import { FIELD_FRAG, FIELD_VERT } from "./field-shaders";
import { driveFieldUniforms, fieldUniforms, type FieldPresetName } from "./presets";
import { readSignalFrame } from "./signal-frame";

/**
 * Reads the host element's box without hitting layout every frame.
 * getBoundingClientRect() forces a synchronous layout, so it is re-measured
 * only after a scroll or resize says it might have moved.
 */
function useHostRect(hostRef: React.RefObject<HTMLElement | null>) {
  const rectRef = useRef<DOMRect | null>(null);
  const dirtyRef = useRef(true);

  useEffect(() => {
    const markDirty = () => {
      dirtyRef.current = true;
    };
    window.addEventListener("scroll", markDirty, { passive: true });
    window.addEventListener("resize", markDirty);
    return () => {
      window.removeEventListener("scroll", markDirty);
      window.removeEventListener("resize", markDirty);
    };
  }, []);

  return useCallback(() => {
    if (dirtyRef.current || !rectRef.current) {
      const host = hostRef.current;
      if (host) {
        rectRef.current = host.getBoundingClientRect();
        dirtyRef.current = false;
      }
    }
    return rectRef.current;
  }, [hostRef]);
}

function FieldPlane({
  preset,
  getRect,
}: {
  preset: FieldPresetName;
  getRect: () => DOMRect | null;
}) {
  const { viewport, size } = useThree();
  const uniforms = useMemo(() => fieldUniforms(preset), [preset]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms,
        vertexShader: FIELD_VERT,
        fragmentShader: FIELD_FRAG,
        depthWrite: false,
      }),
    [uniforms],
  );

  useFrame(() => {
    const rect = getRect();
    let localX = 0.5;
    let localY = 0.5;
    let spool = 0.5;
    if (rect && rect.width > 0 && rect.height > 0) {
      // The shared frame carries a viewport-normalized cursor; convert it
      // into this section's own 0..1 box so the field lights up under the
      // pointer rather than tracking raw screen coordinates.
      const { pointerX, pointerY } = readSignalFrame();
      localX = (pointerX * window.innerWidth - rect.left) / rect.width;
      localY = 1 - (pointerY * window.innerHeight - rect.top) / rect.height;

      // For the tape field, compute scroll position (spool) relative to this
      // section. This drives the field mode from grid (A-SIDE) to flow (B-SIDE).
      const total = window.innerHeight + rect.height;
      spool = Math.max(0, Math.min(1, 1 - rect.bottom / total));
    }
    driveFieldUniforms(preset, localX, localY, size.width / Math.max(1, size.height), spool);
  });

  return (
    <mesh material={material}>
      <planeGeometry args={[viewport.width, viewport.height]} />
    </mesh>
  );
}

/**
 * A cheap, preset-driven reactive backdrop for any section. Everything about
 * how it looks and behaves comes from `presets.ts`, so giving a new page its
 * own character is one line with a different preset name — no shader edits.
 *
 * Orthographic + a single full-bleed quad, no post-processing: light enough
 * that several can share a page with the Hero's reactor.
 */
export function SectionField({
  preset,
  hostRef,
  active = true,
}: {
  preset: FieldPresetName;
  hostRef: React.RefObject<HTMLElement | null>;
  active?: boolean;
}) {
  const [reduced] = useState(prefersReducedMotion);
  const getRect = useHostRect(hostRef);

  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={reduced ? "demand" : active ? "always" : "never"}
      orthographic
      camera={{ position: [0, 0, 1], zoom: 1 }}
      gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
    >
      <FieldPlane preset={preset} getRect={getRect} />
    </Canvas>
  );
}
