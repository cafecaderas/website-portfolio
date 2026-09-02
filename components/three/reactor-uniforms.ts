import * as THREE from "three";
import { readSignalFrame, type SignalFrame } from "./signal-frame";

/**
 * The reactor's uniform bag, as a module singleton — the same shape as
 * audio-engine / interaction-engine / signal-engine, and for the same
 * reason: it is mutable state owned by a requestAnimationFrame loop, not by
 * React's render cycle. Every material in the scene references this one
 * object, so a single write per frame updates the core, the halo, and the
 * backdrop at once.
 *
 * Sharing one bag across every Reactor instance is deliberate and safe:
 * the values are derived entirely from global engines, so two mounted
 * reactors would compute byte-identical values anyway.
 */
export const reactorUniforms = {
  uTime: { value: 0 },
  uBands: { value: new THREE.Vector3(0.3, 0.25, 0.2) },
  uEnergy: { value: 1 },
  uInteraction: { value: 1 },
  uBurst: { value: 0 },
  uScroll: { value: 0 },
  uPointer: { value: new THREE.Vector2(0.5, 0.5) },
  uPhosphor: { value: new THREE.Color(1, 0, 0) },
};

/**
 * Writes the shared frame into the reactor's uniforms and hands back the
 * scalars the scene also needs CPU-side (rotation, bloom, RGB split).
 * The engines themselves are read by `readSignalFrame()`, once per frame
 * for the whole page — see signal-frame.ts for why that matters.
 */
export function driveReactorUniforms(): SignalFrame {
  const f = readSignalFrame();

  reactorUniforms.uTime.value = f.t;
  reactorUniforms.uBands.value.set(f.bands[0], f.bands[1], f.bands[2]);
  reactorUniforms.uEnergy.value = f.energy;
  reactorUniforms.uInteraction.value = f.interaction;
  reactorUniforms.uBurst.value = f.burst;
  reactorUniforms.uScroll.value = THREE.MathUtils.clamp(f.scroll * 0.02, -1, 1);
  reactorUniforms.uPointer.value.set(f.pointerX, f.pointerY);
  reactorUniforms.uPhosphor.value.setRGB(f.phosphor[0], f.phosphor[1], f.phosphor[2]);

  return f;
}
