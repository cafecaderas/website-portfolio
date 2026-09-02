/**
 * One fragment shader, three looks, selected by `uMode` and shaped entirely
 * by the numbers in `presets.ts`. Geometry is a single full-bleed quad — no
 * meshes, no particles — which is what makes it cheap enough to run several
 * of these on one page alongside the Hero's reactor.
 */

export const FIELD_VERT = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const FIELD_FRAG = `
precision highp float;

uniform float uTime;
uniform float uBand;        // the one audio band this preset follows, ~0..1
uniform float uEnergy;
uniform float uInteraction; // 1..4.5
uniform float uBurst;       // 1 -> 0 after a click
uniform float uScroll;      // signed, ~-1..1
uniform vec2  uPointer;     // cursor in THIS section's 0..1 box
uniform vec3  uPhosphor;
uniform float uAspect;

uniform float uMode;        // 0 scan, 1 grid, 2 flow
uniform float uGain;
uniform float uDensity;
uniform float uMousePull;
uniform float uScrollPull;
uniform float uHueShift;    // degrees, left side
uniform float uHueShiftB;   // degrees, right side
uniform float uBurstGain;

varying vec2 vUv;

float hash(float n) { return fract(sin(n * 12.9898) * 43758.5453); }

vec3 rgb2hsv(vec3 c) {
  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
  float d = q.x - min(q.w, q.y);
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + 1e-10)), d / (q.x + 1e-10), q.x);
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

/** Rotates hue while keeping the token's own saturation/value. */
vec3 shiftHue(vec3 col, float degrees) {
  if (abs(degrees) < 0.01) return col;
  vec3 hsv = rgb2hsv(col);
  hsv.x = fract(hsv.x + degrees / 360.0);
  return hsv2rgb(hsv);
}

/** Level-meter bars sweeping sideways — reads as a running signal. */
float scanField(vec2 uv, float energy) {
  float x = uv.x * uDensity + uTime * 0.5 + uScroll * uScrollPull * 6.0;
  float i = floor(x);
  float f = fract(x);

  float h = 0.14 + hash(i) * 0.5;
  h *= 0.55 + uBand * 1.7 + uBurst * uBurstGain * 0.9 + (uInteraction - 1.0) * 0.12;
  // A slow travelling swell so the bar heights are never static.
  h *= 0.75 + 0.35 * sin(i * 0.6 - uTime * 1.4);

  // Soft tip rather than a hard cut, so the bars read as level rather than
  // as solid blocks sitting behind the marquee text.
  float bar = smoothstep(1.0 - h - 0.07, 1.0 - h + 0.03, uv.y);
  bar *= smoothstep(0.0, 0.22, f) * smoothstep(1.0, 0.78, f);
  // Brighter toward the tip of each bar.
  bar *= 0.35 + 0.65 * smoothstep(1.0 - h, 1.0 - h * 0.35, uv.y);
  return bar;
}

/** Perspective-ish grid with a ripple radiating from the cursor. Nodes light
 * up at every line intersection, so it reads as connected points, not just
 * ruled lines — the "circuit board" look. */
float gridField(vec2 uv, float energy) {
  vec2 p = uv - 0.5;
  p.x *= uAspect;

  vec2 pointer = uPointer - 0.5;
  pointer.x *= uAspect;

  float d = length(p - pointer);
  float ripple = sin(d * 16.0 - uTime * 2.4) * exp(-d * 3.2);
  p += ripple * (0.012 + uBand * 0.05 + uBurst * uBurstGain * 0.05) * uMousePull;

  p.y += uScroll * uScrollPull * 0.35;

  // Bright at the cell *boundaries* — thin ruled lines, not filled cells.
  vec2 cell = abs(fract(p * uDensity) - 0.5);
  float lineW = 0.47;
  float lx = smoothstep(lineW, 0.5, cell.x);
  float ly = smoothstep(lineW, 0.5, cell.y);
  float line = max(lx, ly);

  // Nodes: bright dots where lines cross, always visible — this is what
  // reads as "connected points" rather than a faint ruled sheet.
  float node = lx * ly;

  // Always-on baseline (raised from a near-invisible whisper), with the
  // cursor and audio/click still adding extra glow on top.
  float pointerGlow = exp(-d * (4.4 - uMousePull * 1.8));
  float lit = 0.55 + pointerGlow * 1.1 * uMousePull + uBand * 0.45 + uBurst * uBurstGain * 0.6;
  return line * lit + node * lit * 1.8;
}

/** Stacked flowing lines — the tape path, essentially. Bolder amplitude and
 * thickness so it reads as fluid motion, not a faint suggestion of one. */
float flowField(vec2 uv, float energy) {
  float total = 0.0;
  float lines = max(1.0, uDensity);

  for (int i = 0; i < 8; i++) {
    if (float(i) >= lines) break;
    float fi = float(i);
    float phase = fi * 1.7;

    float amp = 0.09 + uBand * 0.22 + uBurst * uBurstGain * 0.15;
    float y = 0.5
      + sin(uv.x * 5.0 + uTime * 0.7 + phase) * amp
      + sin(uv.x * 11.0 - uTime * 0.45 + phase * 1.7) * amp * 0.45
      + (fi - lines * 0.5) * (0.9 / lines);

    y += uScroll * uScrollPull * 0.25;

    float thickness = 0.007 + uBand * 0.006;
    float line = smoothstep(thickness, 0.0, abs(uv.y - y));

    // Cursor proximity brightens the nearest strands, but the baseline is
    // already strong — always-visible ribbons, not just-near-cursor ones.
    float dx = abs(uv.x - uPointer.x);
    line *= 0.85 + exp(-dx * 3.0) * 1.5 * uMousePull;
    total += line;
  }
  return total;
}

void main() {
  vec2 uv = vUv;
  float energy = uEnergy;

  float v = 0.0;
  if (uMode < 0.5) {
    v = scanField(uv, energy);
  } else if (uMode < 1.5) {
    v = gridField(uv, energy);
  } else {
    v = flowField(uv, energy);
  }

  // One field can read as two signals: hue crossfades across the midline,
  // which is what makes the A-SIDE / B-SIDE split a single draw call.
  float side = smoothstep(0.42, 0.58, uv.x);
  vec3 tint = shiftHue(uPhosphor, mix(uHueShift, uHueShiftB, side));

  // Vertical falloff keeps the brightest part away from body copy.
  float falloff = mix(1.0, smoothstep(0.0, 0.35, uv.y) * smoothstep(1.0, 0.65, uv.y), 0.35);

  float amount = v * uGain * falloff;
  amount *= 0.8 + (uInteraction - 1.0) * 0.16 + (energy - 1.0) * 0.35;

  gl_FragColor = vec4(tint * amount, 1.0);
}
`;
