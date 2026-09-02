/**
 * GLSL for the Reactor. Every shader here shares one uniform block (see
 * Reactor.tsx) fed by the site's existing engines — audio-engine's bands,
 * interaction-engine's mouse/scroll/click, and signal-engine's --phosphor.
 * Nothing in here invents its own energy source.
 */

/**
 * Ashima / Stefan Gustavson simplex noise (MIT). Vendored rather than added
 * as a dependency: it's one stable function that has not changed in a decade,
 * and it has to be inlined into the shader source string regardless.
 */
const SIMPLEX_3D = `
vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 mod289(vec4 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`;

/** The uniform block every shader below shares, by reference. */
const UNIFORMS = `
uniform float uTime;
uniform vec3  uBands;       // [bass, mid, treble], each ~0..1
uniform float uEnergy;      // audio energy, ~1 at idle
uniform float uInteraction; // mouse+scroll energy, 1..4.5
uniform float uBurst;       // click shockwave, 1 -> 0
uniform float uScroll;      // signed scroll velocity, roughly -1..1
uniform vec2  uPointer;     // cursor, 0..1
uniform vec3  uPhosphor;    // the site's one signal color
`;

/**
 * Displacement is shared by the wireframe shell and the solid core beneath
 * it so the two stay locked together. Three noise octaves, each wired to a
 * different band: bass moves the silhouette, treble stipples the surface.
 */
const DISPLACE = `
float displace(vec3 p, float t) {
  float bass   = snoise(p * 0.9  + vec3(0.0, 0.0, t * 0.25)) * (0.30 + uBands.x * 0.85);
  float mid    = snoise(p * 2.30 + vec3(t * 0.35, 0.0, 0.0)) * (0.12 + uBands.y * 0.42);
  float treble = snoise(p * 5.50 + vec3(0.0, t * 0.65, 0.0)) * (0.04 + uBands.z * 0.24);

  // Click shockwave: a ring travelling out along +Y from the click moment.
  float wavefront = 1.0 - abs(p.y - (uBurst * 2.6 - 1.3));
  float shock = smoothstep(0.55, 1.0, wavefront) * uBurst * 0.85;

  return bass + mid + treble + shock;
}
`;

export const CORE_VERT = `
${UNIFORMS}
${SIMPLEX_3D}
${DISPLACE}

varying float vDisp;
varying vec3  vNormalW;
varying vec3  vViewDir;

void main() {
  float t = uTime;
  float d = displace(normal, t);
  vDisp = d;

  // Interaction stretches the whole shell outward, so a burst of mouse or
  // scroll activity visibly inflates the object, not just its surface.
  float swell = 1.0 + (uInteraction - 1.0) * 0.085 + uBurst * 0.16;
  vec3 displaced = position + normal * d * 0.42 * swell;

  vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
  vNormalW = normalize(normalMatrix * normal);
  vViewDir = normalize(-mvPosition.xyz);
  gl_Position = projectionMatrix * mvPosition;
}
`;

export const CORE_WIRE_FRAG = `
${UNIFORMS}

varying float vDisp;
varying vec3  vNormalW;
varying vec3  vViewDir;

void main() {
  // Fresnel rim — edges facing away from camera glow hardest, which is what
  // makes a wireframe read as a volume rather than a flat net of lines.
  float fresnel = pow(1.0 - clamp(dot(vNormalW, vViewDir), 0.0, 1.0), 1.7);
  float ridge = smoothstep(-0.2, 0.9, vDisp);

  // Tuned so flat stretches of the mesh sit *below* the bloom threshold and
  // only genuine peaks — rim edges and displacement ridges — cross it. That
  // keeps the wireframe crisp instead of smearing into a haze.
  float brightness = 0.045 + fresnel * 0.30 + ridge * 0.12;
  brightness *= 0.80 + (uEnergy - 1.0) * 0.70 + (uInteraction - 1.0) * 0.22;
  brightness += uBurst * 0.40;

  // Peaks lean toward white; troughs stay saturated phosphor. Capped well
  // below full white so the logotype in front always stays readable.
  vec3 color = mix(uPhosphor, vec3(1.0), clamp(ridge * 0.22 + uBurst * 0.25, 0.0, 0.35));
  gl_FragColor = vec4(color * brightness, 1.0);
}
`;

/** The dark shell just inside the wireframe — occludes back-facing lines. */
export const CORE_SOLID_FRAG = `
${UNIFORMS}

varying float vDisp;
varying vec3  vNormalW;
varying vec3  vViewDir;

void main() {
  float fresnel = pow(1.0 - clamp(dot(vNormalW, vViewDir), 0.0, 1.0), 2.6);
  vec3 color = uPhosphor * (fresnel * 0.11 + smoothstep(0.1, 1.0, vDisp) * 0.025);
  gl_FragColor = vec4(color, 1.0);
}
`;

export const PARTICLE_VERT = `
${UNIFORMS}
${SIMPLEX_3D}

attribute float aSeed;
attribute float aScale;

varying float vSeed;
varying float vGlow;

// Rotation about Y, so the halo orbits rather than tumbling.
mat3 rotateY(float a) {
  float s = sin(a); float c = cos(a);
  return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c);
}

void main() {
  vSeed = aSeed;
  float t = uTime;

  // Orbit speed is the direct "increase particle velocity" link: mouse and
  // scroll energy spin the halo faster, scroll direction biases which way.
  float speed = 0.06 + (uInteraction - 1.0) * 0.16 + uBands.x * 0.10;
  vec3 p = rotateY(t * speed + aSeed * 6.283 + uScroll * 0.6) * position;

  // Slow noise drift so the shell breathes instead of sitting rigid.
  vec3 drift = vec3(
    snoise(p * 0.34 + vec3(t * 0.12, 0.0, 0.0)),
    snoise(p * 0.34 + vec3(0.0, t * 0.12, 40.0)),
    snoise(p * 0.34 + vec3(0.0, 0.0, t * 0.12 + 80.0))
  );
  p += drift * (0.28 + uBands.y * 0.55);

  // Click pushes the whole halo outward, then it settles back.
  p *= 1.0 + uBurst * 0.34 + (uEnergy - 1.0) * 0.12;

  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);

  // Additive blending over thousands of points accumulates fast, so each
  // one has to stay dim for the halo as a whole to read as a haze.
  vGlow = 0.09 + uBands.z * 0.30 + uBurst * 0.55 + (uInteraction - 1.0) * 0.09;

  float size = aScale * (1.0 + uBands.x * 1.5 + uBurst * 1.4);
  gl_PointSize = size * (300.0 / max(0.001, -mvPosition.z));
  gl_Position = projectionMatrix * mvPosition;
}
`;

export const PARTICLE_FRAG = `
${UNIFORMS}

varying float vSeed;
varying float vGlow;

void main() {
  // Round, soft-edged point. Square points would read as digital noise.
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  if (d > 0.5) discard;
  float alpha = smoothstep(0.5, 0.0, d);

  // A minority of sparks run white-hot, the rest stay phosphor — keeps the
  // halo from flattening into one solid color.
  vec3 color = mix(uPhosphor, vec3(1.0), step(0.88, vSeed) * 0.6);
  gl_FragColor = vec4(color * vGlow, alpha * 0.55);
}
`;

export const BACKDROP_VERT = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

/**
 * The ambient field behind the reactor — the flowing noise + scanline +
 * vignette treatment carried over from the previous hero background, now
 * rendered inside the same WebGL context instead of a second one.
 */
export const BACKDROP_FRAG = `
${UNIFORMS}
${SIMPLEX_3D}

varying vec2 vUv;

float fbm(vec3 p) {
  float v = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 4; i++) {
    v += amp * snoise(p);
    p *= 2.02;
    amp *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = vUv;
  float t = uTime;

  // Cursor bends the flow field toward itself, falling off with distance.
  vec2 toPointer = vec2(uPointer.x, 1.0 - uPointer.y) - uv;
  float pointerDist = length(toPointer);
  vec2 pull = toPointer * exp(-pointerDist * 2.2) * 0.35;

  float flow  = fbm(vec3(uv * 2.6 + pull, t * 0.05) + uBands.x * 0.6);
  float flow2 = fbm(vec3(uv * 5.0 + pull * 0.6, -t * 0.04) + uBands.y * 0.4);
  float signal = flow * 0.6 + flow2 * 0.4;

  float scan = mix(1.0, sin(uv.y * 900.0) * 0.5 + 0.5, 0.05);
  float vignette = 1.0 - smoothstep(0.32, 0.95, length(uv - 0.5));
  float pointerGlow = exp(-pointerDist * 3.2) * 0.085;

  float glow = signal * (0.022 + uBands.z * 0.028 + (uInteraction - 1.0) * 0.010) * vignette
             + pointerGlow * vignette;

  gl_FragColor = vec4(uPhosphor * glow * scan, 1.0);
}
`;
