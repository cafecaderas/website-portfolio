"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, ChromaticAberration, EffectComposer, Vignette } from "@react-three/postprocessing";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { BloomEffect, ChromaticAberrationEffect } from "postprocessing";
import { prefersReducedMotion } from "@/components/canvas/signal-engine";
import { driveReactorUniforms, reactorUniforms } from "./reactor-uniforms";
import {
  BACKDROP_FRAG,
  BACKDROP_VERT,
  CORE_SOLID_FRAG,
  CORE_VERT,
  CORE_WIRE_FRAG,
  PARTICLE_FRAG,
  PARTICLE_VERT,
} from "./shaders";

const PARTICLE_COUNT = 4200;
const BACKDROP_Z = -7;
const TARGET_FPS = 30;
const FRAME_INTERVAL_MS = 1000 / TARGET_FPS;

/**
 * Drives the render loop by hand at a capped rate. `frameloop="always"`
 * would still render (and re-run the full bloom/aberration/vignette chain)
 * at the display's native rate; `advance()` under `frameloop="never"` is
 * the only way to actually skip GPU work on the throttled frames rather
 * than just skipping the CPU-side uniform math.
 */
function FrameCap() {
  const advance = useThree((s) => s.advance);

  useEffect(() => {
    let raf = 0;
    let last = 0;
    const tick = (t: number) => {
      if (t - last >= FRAME_INTERVAL_MS) {
        last = t;
        advance(t);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [advance]);

  return null;
}

/**
 * Seeded PRNG (mulberry32). The particle field must be identical on every
 * build of the geometry rather than reshuffling whenever React happens to
 * re-run the memo — and a fixed seed means a layout worth keeping can be
 * reproduced exactly.
 */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * The one place per frame that reads the site's engines. Also owns the two
 * CPU-side responses — the core's rotation and the post-processing strength.
 */
function SignalDriver({
  coreRef,
  bloomRef,
  aberrationRef,
}: {
  coreRef: React.RefObject<THREE.Group | null>;
  bloomRef: React.RefObject<BloomEffect | null>;
  aberrationRef: React.RefObject<ChromaticAberrationEffect | null>;
}) {
  useFrame(() => {
    // Time comes from the shared frame, not this canvas's own clock, so every
    // scene on the page stays in lockstep (see signal-frame.ts).
    const { t, pointerX, pointerY, drive } = driveReactorUniforms();

    // Mouse X → rotation, the direct mapping. Eased rather than snapped so
    // the object feels weighted instead of glued to the cursor.
    const core = coreRef.current;
    if (core) {
      const targetY = (pointerX - 0.5) * 1.9;
      const targetX = (pointerY - 0.5) * 1.0;
      core.rotation.y += (targetY - core.rotation.y) * 0.045;
      core.rotation.x += (targetX - core.rotation.x) * 0.045;
      core.rotation.z = Math.sin(t * 0.12) * 0.12;
    }

    // Glow and RGB split are the payoff end of the chain: both scale with
    // the same energy that is already distorting the geometry.
    if (bloomRef.current) {
      bloomRef.current.intensity = 0.32 + drive * 0.55;
    }
    if (aberrationRef.current) {
      // Clamped hard: offset is in normalized screen units, so even 0.005
      // fully separates the channels into red/green/blue copies. Ceiling of
      // 0.0016 keeps it a fringe on the edges (~2px) rather than a split.
      const split = Math.min(0.0016, 0.0002 + drive * 0.0003);
      aberrationRef.current.offset.set(split, split * 0.6);
    }
  });

  return null;
}

function ReactorCore({ groupRef }: { groupRef: React.RefObject<THREE.Group | null> }) {
  // detail 3 ≈ 1,280 triangles. Denser than this and the edges pack tightly
  // enough to read as a solid glowing ball once bloom is applied, rather
  // than as a wireframe.
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1.55, 3), []);

  const wireMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: reactorUniforms,
        vertexShader: CORE_VERT,
        fragmentShader: CORE_WIRE_FRAG,
        wireframe: true,
        transparent: true,
      }),
    [],
  );

  const solidMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: reactorUniforms,
        vertexShader: CORE_VERT,
        fragmentShader: CORE_SOLID_FRAG,
      }),
    [],
  );

  return (
    <group ref={groupRef}>
      <mesh geometry={geometry} material={solidMaterial} scale={0.965} />
      <mesh geometry={geometry} material={wireMaterial} />
    </group>
  );
}

function ParticleHalo() {
  const geometry = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const seeds = new Float32Array(PARTICLE_COUNT);
    const scales = new Float32Array(PARTICLE_COUNT);
    const rand = mulberry32(0x5ca1ab1e);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Uniform-ish distribution on a spherical shell, biased outward so the
      // halo reads as a cloud around the core rather than a hard sphere.
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      const radius = 2.1 + Math.pow(rand(), 0.65) * 2.6;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.cos(phi) * 0.72;
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

      seeds[i] = rand();
      // World units, not pixels — the vertex shader multiplies this by
      // 300/depth, so values of ~0.02 land at a few pixels on screen.
      scales[i] = 0.018 + rand() * 0.05;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    geo.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    return geo;
  }, []);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: reactorUniforms,
        vertexShader: PARTICLE_VERT,
        fragmentShader: PARTICLE_FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );

  return <points geometry={geometry} material={material} />;
}

function Backdrop() {
  const { viewport, camera } = useThree();

  // Sized to exactly fill the frustum at its own depth, so it stays a true
  // full-bleed background at any aspect ratio.
  const { width, height } = viewport.getCurrentViewport(camera, new THREE.Vector3(0, 0, BACKDROP_Z));

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: reactorUniforms,
        vertexShader: BACKDROP_VERT,
        fragmentShader: BACKDROP_FRAG,
        depthWrite: false,
      }),
    [],
  );

  return (
    <mesh position={[0, 0, BACKDROP_Z]} material={material}>
      <planeGeometry args={[width, height]} />
    </mesh>
  );
}

/**
 * The Hero centerpiece: a noise-displaced wireframe core inside an orbiting
 * particle halo, over the ambient signal field — all of it driven by the
 * real audio engine, real cursor/scroll/click activity, and the site's live
 * --phosphor color (so the Hero's RGB picker retints the whole scene).
 */
export function Reactor({ active = true }: { active?: boolean }) {
  const coreRef = useRef<THREE.Group | null>(null);
  const bloomRef = useRef<BloomEffect | null>(null);
  const aberrationRef = useRef<ChromaticAberrationEffect | null>(null);
  const [reduced] = useState(prefersReducedMotion);
  const aberrationOffset = useMemo(() => new THREE.Vector2(0.0006, 0.0004), []);

  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={reduced ? "demand" : "never"}
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ antialias: false, alpha: false, powerPreference: "default" }}
    >
      <color attach="background" args={["#050505"]} />
      {!reduced && active && <FrameCap />}
      <Backdrop />
      <ReactorCore groupRef={coreRef} />
      <ParticleHalo />
      <SignalDriver coreRef={coreRef} bloomRef={bloomRef} aberrationRef={aberrationRef} />
      {/* multisampling=0: bloom already softens edges enough that the
          composer's own 8x MSAA render target (the default) buys little
          visible sharpness for a real GPU cost every frame. */}
      <EffectComposer multisampling={0}>
        <Bloom
          ref={bloomRef}
          intensity={0.32}
          luminanceThreshold={0.42}
          luminanceSmoothing={0.3}
          mipmapBlur
        />
        <ChromaticAberration ref={aberrationRef} offset={aberrationOffset} />
        <Vignette offset={0.26} darkness={0.82} />
      </EffectComposer>
    </Canvas>
  );
}
