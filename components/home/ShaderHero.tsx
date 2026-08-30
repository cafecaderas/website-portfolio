"use client";

import { useEffect, useRef } from "react";
import { getAudioBands } from "@/components/canvas/audio-engine";
import { getPhosphorRgbNormalized, prefersReducedMotion, registerDraw } from "@/components/canvas/signal-engine";

/**
 * Fullscreen triangle via gl_VertexID — no vertex buffer needed
 * (attribute-less rendering, WebGL2-only trick).
 */
const VERTEX_SRC = `#version 300 es
void main() {
  vec2 pos = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(pos * 2.0 - 1.0, 0.0, 1.0);
}`;

/**
 * A flowing phosphor-tinted noise field with CRT scanlines and a vignette —
 * the oscilloscope motif as an ambient background instead of a line trace.
 * u_bands comes from the real audio engine (see audio-engine.ts); it's a
 * gentle synthetic idle pulse when the SIGNAL toggle is off.
 */
const FRAGMENT_SRC = `#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 u_phosphor;
uniform vec3 u_bands;
uniform vec2 u_mouse;

out vec4 fragColor;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
  float v = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 4; i++) {
    v += amp * noise(p);
    p *= 2.02;
    amp *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
  vec2 p = uv * aspect;

  // Cursor pull: bends the flow field toward the mouse, falling off with
  // distance — makes the ambient noise visibly track the cursor.
  vec2 mouseP = u_mouse * aspect;
  vec2 toMouse = mouseP - p;
  float mouseDist = length(toMouse);
  vec2 pull = toMouse * exp(-mouseDist * 2.2) * 0.5;

  float flow = fbm(p * 2.2 + pull + vec2(u_time * 0.04, -u_time * 0.06) + u_bands.x * 0.6);
  float flow2 = fbm(p * 4.0 + pull * 0.6 - vec2(u_time * 0.03, u_time * 0.02) + u_bands.y * 0.4);
  float signal = flow * 0.6 + flow2 * 0.4;

  float scan = mix(1.0, sin(uv.y * u_resolution.y * 1.5) * 0.5 + 0.5, 0.06);

  vec2 centered = uv - 0.5;
  float vignette = 1.0 - smoothstep(0.35, 0.95, length(centered));

  float mouseGlow = exp(-mouseDist * 3.0) * 0.3;
  float glow = signal * (0.16 + u_bands.z * 0.12) * vignette + mouseGlow * vignette;
  vec3 color = u_phosphor * glow * scan;

  fragColor = vec4(color, 1.0);
}`;

function compileShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/** Ambient WebGL2 background for the hero. Renders nothing if WebGL2 is unavailable — the hero just keeps its plain --tape ground. */
export function ShaderHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2");
    if (!gl) return;

    const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SRC);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SRC);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uPhosphor = gl.getUniformLocation(program, "u_phosphor");
    const uBands = gl.getUniformLocation(program, "u_bands");
    const uMouse = gl.getUniformLocation(program, "u_mouse");

    // Smoothed toward the pointer each frame rather than snapping, so the
    // field's response feels fluid. The canvas fills its parent (.hero)
    // exactly, but pointermove is listened on the parent — the canvas
    // sits at z-index:-1, behind the hero's text/buttons, so it would
    // otherwise miss most pointer movement within the section.
    let mouseTargetX = 0.5;
    let mouseTargetY = 0.5;
    let mouseX = 0.5;
    let mouseY = 0.5;
    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseTargetX = (e.clientX - rect.left) / rect.width;
      mouseTargetY = 1 - (e.clientY - rect.top) / rect.height;
    };
    canvas.parentElement?.addEventListener("pointermove", onPointerMove);

    let w = 0;
    let h = 0;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = Math.max(1, Math.round(rect.width * dpr));
      h = Math.max(1, Math.round(rect.height * dpr));
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = (t: number) => {
      gl.uniform2f(uResolution, w, h);
      gl.uniform1f(uTime, t);
      const phosphor = getPhosphorRgbNormalized();
      gl.uniform3f(uPhosphor, phosphor[0], phosphor[1], phosphor[2]);
      const bands = getAudioBands(t);
      gl.uniform3f(uBands, bands[0], bands[1], bands[2]);
      mouseX += (mouseTargetX - mouseX) * 0.08;
      mouseY += (mouseTargetY - mouseY) * 0.08;
      gl.uniform2f(uMouse, mouseX, mouseY);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    if (prefersReducedMotion()) {
      draw(0.6);
      return () => {
        window.removeEventListener("resize", resize);
        canvas.parentElement?.removeEventListener("pointermove", onPointerMove);
      };
    }

    const unregister = registerDraw(draw, () => canvas.isConnected);
    return () => {
      unregister();
      window.removeEventListener("resize", resize);
      canvas.parentElement?.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="shader-hero" aria-hidden="true" />;
}
