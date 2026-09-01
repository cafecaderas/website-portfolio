import * as THREE from "three";
import { readSignalFrame } from "./signal-frame";

/**
 * ============================================================================
 * REACTIVE FIELD PRESETS — the tuning surface for the whole site
 * ============================================================================
 *
 * A "field" is a cheap, full-bleed WebGL layer that sits behind a section and
 * reacts to audio, cursor and scroll. Every knob a field has lives in this
 * one file, so giving a new section (or a whole new page) its own character
 * is a matter of adding an entry here and mounting
 * `<SectionFieldLoader preset="name" />` — no shader edits, no new component.
 *
 * `lab` and `works` are defined and ready but not mounted anywhere yet; they
 * exist so those pages can be wired up later by dropping in the loader.
 */

export type FieldMode = "scan" | "grid" | "flow";

export type FieldPreset = {
  /** Which of the three looks the shared shader draws. */
  mode: FieldMode;
  /** Overall brightness ceiling. Keep low — content sits on top of this. */
  gain: number;
  /** Feature count: bars across for `scan`, cells for `grid`, lines for `flow`. */
  density: number;
  /** How hard the cursor bends/lights the field, 0..1. */
  mousePull: number;
  /** How hard scroll velocity pushes it, 0..1. */
  scrollPull: number;
  /** Which audio band drives it: 0 bass, 1 mid, 2 treble. */
  band: 0 | 1 | 2;
  /** Degrees off `--phosphor` for the left/default side. 0 = the exact signal color. */
  hueShift: number;
  /** Degrees off `--phosphor` for the right side — lets one field read as two. */
  hueShiftB: number;
  /** Extra kick on click, 0..2. */
  burstGain: number;
};

export const FIELD_PRESETS = {
  /**
   * Under the tape: slow horizontal ribbons, bass-led. Read *through* the
   * deck's translucent inner plate, so the gain is low on purpose — the
   * metal is the surface, this is the light behind it.
   */
  tape: {
    mode: "flow",
    gain: 0.34,
    density: 5,
    mousePull: 0.5,
    scrollPull: 0.6,
    band: 0,
    hueShift: 0,
    hueShiftB: 0,
    burstGain: 1.0,
  },
  /** The ticker strip: treble-led bars, fast, reads as a level meter. */
  ticker: {
    mode: "scan",
    gain: 0.42,
    density: 46,
    mousePull: 0.35,
    scrollPull: 0.9,
    band: 2,
    hueShift: 0,
    hueShiftB: 0,
    burstGain: 1.2,
  },
  /**
   * A-SIDE / B-SIDE: one grid split down the middle into two hues, so the
   * "one brand, two sides" idea is literally rendered — sound on the left,
   * systems on the right, both derived from the single `--phosphor` token.
   */
  sides: {
    mode: "grid",
    gain: 0.34,
    density: 13,
    mousePull: 0.85,
    scrollPull: 0.3,
    band: 1,
    hueShift: -26,
    hueShiftB: 30,
    burstGain: 1.0,
  },
  /** Selected Work: a calmer, wider grid — structure, not noise. */
  work: {
    mode: "grid",
    gain: 0.26,
    density: 8,
    mousePull: 0.6,
    scrollPull: 0.45,
    band: 1,
    hueShift: 0,
    hueShiftB: 0,
    burstGain: 0.8,
  },

  // ---- Defined, not yet mounted. Drop the loader into these pages to use. ----
  /** Lab: densest and most reactive — it should feel like a workbench. */
  lab: {
    mode: "scan",
    gain: 0.4,
    density: 64,
    mousePull: 0.9,
    scrollPull: 0.5,
    band: 2,
    hueShift: 14,
    hueShiftB: -14,
    burstGain: 1.5,
  },
  /** Works: the most restrained — the projects are the subject, not the field. */
  works: {
    mode: "grid",
    gain: 0.2,
    density: 10,
    mousePull: 0.45,
    scrollPull: 0.35,
    band: 0,
    hueShift: 0,
    hueShiftB: 0,
    burstGain: 0.6,
  },
} satisfies Record<string, FieldPreset>;

export type FieldPresetName = keyof typeof FIELD_PRESETS;

const MODE_INDEX: Record<FieldMode, number> = { scan: 0, grid: 1, flow: 2 };

export type FieldUniforms = {
  uTime: { value: number };
  uBand: { value: number };
  uEnergy: { value: number };
  uInteraction: { value: number };
  uBurst: { value: number };
  uScroll: { value: number };
  uPointer: { value: THREE.Vector2 };
  uPhosphor: { value: THREE.Color };
  uAspect: { value: number };
  uMode: { value: number };
  uGain: { value: number };
  uDensity: { value: number };
  uMousePull: { value: number };
  uScrollPull: { value: number };
  uHueShift: { value: number };
  uHueShiftB: { value: number };
  uBurstGain: { value: number };
};

/**
 * One uniform bag per preset, held at module scope for the same reason
 * `reactor-uniforms.ts` is: this is mutable state owned by a render loop,
 * not by React. Keying by preset rather than by component instance is safe
 * because each preset is mounted at most once per page.
 */
const bags = new Map<FieldPresetName, FieldUniforms>();

export function fieldUniforms(name: FieldPresetName): FieldUniforms {
  const existing = bags.get(name);
  if (existing) return existing;

  const p = FIELD_PRESETS[name];
  const bag: FieldUniforms = {
    uTime: { value: 0 },
    uBand: { value: 0.3 },
    uEnergy: { value: 1 },
    uInteraction: { value: 1 },
    uBurst: { value: 0 },
    uScroll: { value: 0 },
    uPointer: { value: new THREE.Vector2(0.5, 0.5) },
    uPhosphor: { value: new THREE.Color(1, 0, 0) },
    uAspect: { value: 1 },
    uMode: { value: MODE_INDEX[p.mode] },
    uGain: { value: p.gain },
    uDensity: { value: p.density },
    uMousePull: { value: p.mousePull },
    uScrollPull: { value: p.scrollPull },
    uHueShift: { value: p.hueShift },
    uHueShiftB: { value: p.hueShiftB },
    uBurstGain: { value: p.burstGain },
  };
  bags.set(name, bag);
  return bag;
}

/**
 * Writes the current frame into one field's uniforms. `localPointer` is the
 * cursor expressed in *this section's* own 0..1 box, so a field lights up
 * under the cursor rather than responding to raw viewport coordinates.
 * `spool` (0..1) is optional — for the tape field, drives the mode from
 * grid (analytical, A-SIDE) to flow (creative, B-SIDE).
 */
export function driveFieldUniforms(
  name: FieldPresetName,
  localPointerX: number,
  localPointerY: number,
  aspect: number,
  spool = 0.5,
) {
  const u = fieldUniforms(name);
  const f = readSignalFrame();
  let preset = FIELD_PRESETS[name];

  // For the tape field, switch mode based on scroll position.
  // A-SIDE (spool < 0.5): grid mode (analytical, organized).
  // B-SIDE (spool > 0.5): flow mode (creative, fluid).
  let modeIndex = MODE_INDEX[preset.mode];
  if (name === "tape") {
    modeIndex = spool < 0.5 ? MODE_INDEX.grid : MODE_INDEX.flow;
  }

  u.uTime.value = f.t;
  u.uBand.value = f.bands[preset.band];
  u.uEnergy.value = f.energy;
  u.uInteraction.value = f.interaction;
  u.uBurst.value = f.burst;
  u.uScroll.value = THREE.MathUtils.clamp(f.scroll * 0.02, -1, 1);
  u.uPointer.value.set(localPointerX, localPointerY);
  u.uPhosphor.value.setRGB(f.phosphor[0], f.phosphor[1], f.phosphor[2]);
  u.uAspect.value = aspect;
  u.uMode.value = modeIndex;
}
