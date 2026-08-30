"use client";

import { useEffect, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import {
  COLOR_TOKENS,
  RANGE_TOKENS,
  DISPLAY_FONTS,
  BODY_FONTS,
  MACH_FONTS,
  PRESETS,
  defaultTweakState,
  SIGNAL_INTENSITY_DEFAULT,
  SIGNAL_INTENSITY_RANGE,
  type TweakState,
  type ColorToken,
  type FontOption,
} from "./schema";
import { rotateHue } from "./color-utils";
import { setSignalIntensity } from "@/components/canvas/signal-engine";

/**
 * Dev-only live design panel — the "coded site -> experiment with the
 * visual language without editing code" tool. Every control here maps
 * back onto the existing CSS custom properties in globals.css, so
 * tweaking re-parameterizes the design system instead of creating
 * one-off styles.
 *
 * Deliberately styled with hardcoded neutral colors, not the site's
 * own --tape/--paper/etc. tokens — so the panel stays legible and
 * usable no matter how far the live tweaks push the site's palette.
 */

const STORAGE_KEY = "cc-tweak-bar-v1";

const UI = {
  bg: "#101115",
  panel: "#1b1c21",
  border: "#2c2d33",
  text: "#f2f2f4",
  muted: "#9a9ba3",
  accent: "#6f8cff",
  mono: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
  sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
} as const;

const loadedFonts = new Set<string>();

function ensureFontLoaded(option: FontOption) {
  if (!option.googleFamily || loadedFonts.has(option.googleFamily)) return;
  loadedFonts.add(option.googleFamily);
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${option.googleFamily}&display=swap`;
  document.head.appendChild(link);
}

function applyState(state: TweakState) {
  const root = document.documentElement.style;

  for (const token of COLOR_TOKENS) {
    root.setProperty(token.cssVar, state.colors[token.id] ?? token.default);
  }
  for (const token of RANGE_TOKENS) {
    const value = state.ranges[token.id] ?? token.default;
    root.setProperty(token.cssVar, token.unit === "px" ? `${value}px` : `${value}`);
  }
  setSignalIntensity(state.signalIntensity ?? SIGNAL_INTENSITY_DEFAULT);

  const display = DISPLAY_FONTS.find((f) => f.id === state.displayFont) ?? DISPLAY_FONTS[0];
  const body = BODY_FONTS.find((f) => f.id === state.bodyFont) ?? BODY_FONTS[0];
  const mach = MACH_FONTS.find((f) => f.id === state.machFont) ?? MACH_FONTS[0];
  ensureFontLoaded(display);
  ensureFontLoaded(body);
  ensureFontLoaded(mach);
  root.setProperty("--display", display.cssValue);
  root.setProperty("--body", body.cssValue);
  root.setProperty("--mach", mach.cssValue);
}

function mergeState(base: TweakState, partial: Partial<TweakState>): TweakState {
  return {
    ...base,
    ...partial,
    colors: { ...base.colors, ...(partial.colors ?? {}) },
    ranges: { ...base.ranges, ...(partial.ranges ?? {}) },
  };
}

function randomFrom<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

const SHUFFLE_HUE_IDS = ["tape", "tape-2", "paper", "steel", "rust", "rust-lit", "rule"];

function shuffleState(current: TweakState): TweakState {
  const delta = Math.random() * 360;
  const colors = { ...current.colors };
  for (const id of SHUFFLE_HUE_IDS) {
    if (colors[id]) colors[id] = rotateHue(colors[id], delta);
  }
  // phosphor is excluded — it's the "live signal" color, not a design accent

  const ranges: Record<string, number> = {};
  for (const token of RANGE_TOKENS) {
    const steps = Math.round((token.max - token.min) / token.step);
    const raw = token.min + Math.round(Math.random() * steps) * token.step;
    ranges[token.id] = Number(Math.min(token.max, Math.max(token.min, raw)).toFixed(2));
  }

  const span = SIGNAL_INTENSITY_RANGE.max - SIGNAL_INTENSITY_RANGE.min;
  const signalIntensity = Number((SIGNAL_INTENSITY_RANGE.min + Math.random() * span).toFixed(2));

  return {
    colors,
    ranges,
    signalIntensity,
    displayFont: randomFrom(DISPLAY_FONTS).id,
    bodyFont: randomFrom(BODY_FONTS).id,
    machFont: randomFrom(MACH_FONTS).id,
  };
}

function loadInitialState(): TweakState {
  if (typeof window === "undefined") return defaultTweakState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? mergeState(defaultTweakState(), JSON.parse(raw)) : defaultTweakState();
  } catch {
    return defaultTweakState();
  }
}

export function TweakBar() {
  // Detect the client without a setState-in-effect: server snapshot is
  // false, client snapshot is true, and the subscription never fires
  // (there's nothing to subscribe to) — React reconciles the switch
  // right after hydration with no mismatch warning.
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<TweakState>(loadInitialState);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied">("idle");

  useEffect(() => {
    if (!isClient) return;
    applyState(state);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore — nothing meaningful to recover from here
    }
  }, [state, isClient]);

  if (!isClient) return null;

  const update = (partial: Partial<TweakState>) => setState((prev) => mergeState(prev, partial));
  const setColor = (id: string, value: string) => update({ colors: { [id]: value } });
  const setRange = (id: string, value: number) => update({ ranges: { [id]: value } });

  const handleExport = async () => {
    const lines: string[] = [];
    for (const token of COLOR_TOKENS) {
      const value = state.colors[token.id];
      if (value && value !== token.default) lines.push(`  ${token.cssVar}: ${value};`);
    }
    for (const token of RANGE_TOKENS) {
      const value = state.ranges[token.id];
      if (value !== undefined && value !== token.default) {
        lines.push(`  ${token.cssVar}: ${token.unit === "px" ? `${value}px` : value};`);
      }
    }

    const fontLines: string[] = [];
    const display = DISPLAY_FONTS.find((f) => f.id === state.displayFont);
    const body = BODY_FONTS.find((f) => f.id === state.bodyFont);
    const mach = MACH_FONTS.find((f) => f.id === state.machFont);
    if (display && display.id !== "archivo-black") fontLines.push(`Display: ${display.label}`);
    if (body && body.id !== "inter") fontLines.push(`Body: ${body.label}`);
    if (mach && mach.id !== "special-elite") fontLines.push(`Labels: ${mach.label}`);

    const parts = [
      "/* Tweak Bar export — paste into :root in app/globals.css to lock in */",
      lines.length ? `:root {\n${lines.join("\n")}\n}` : "/* No token overrides — palette/spacing/borders all at defaults. */",
      fontLines.length
        ? `\n/* Fonts changed (wire into next/font/google in app/layout.tsx):\n   ${fontLines.join("\n   ")}\n*/`
        : "",
      state.signalIntensity !== SIGNAL_INTENSITY_DEFAULT
        ? `\n/* Signal intensity: ${state.signalIntensity}× — set via setSignalIntensity() in code, not CSS */`
        : "",
    ].filter(Boolean);

    try {
      await navigator.clipboard.writeText(parts.join("\n"));
      setCopyStatus("copied");
      setTimeout(() => setCopyStatus("idle"), 1800);
    } catch {
      // clipboard API unavailable — nothing else to do in a dev tool
    }
  };

  const rangeToken = (id: string) => RANGE_TOKENS.find((t) => t.id === id)!;

  return (
    <div style={{ position: "fixed", right: 16, bottom: 16, zIndex: 9999, fontFamily: UI.sans }}>
      {open && (
        <div
          style={{
            width: 320,
            maxHeight: "min(78vh, 720px)",
            overflowY: "auto",
            background: UI.panel,
            border: `1px solid ${UI.border}`,
            borderRadius: 10,
            marginBottom: 10,
            boxShadow: "0 24px 60px rgba(0,0,0,.5)",
            color: UI.text,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px" }}>
            <span style={{ fontSize: 12, fontWeight: 600 }}>Tweak Bar</span>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => setState((prev) => shuffleState(prev))} style={smallButtonStyle()}>
                Shuffle
              </button>
              <button onClick={() => setState(defaultTweakState())} style={smallButtonStyle()}>
                Reset
              </button>
            </div>
          </div>

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", padding: "0 14px 12px" }}>
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => setState(mergeState(defaultTweakState(), preset.state))}
                title={preset.description}
                style={smallButtonStyle()}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <Section title="Colors">
            {COLOR_TOKENS.map((token) => (
              <ColorRow key={token.id} token={token} value={state.colors[token.id]} onChange={(v) => setColor(token.id, v)} />
            ))}
          </Section>

          <Section title="Typography">
            <FontRow label="Display" options={DISPLAY_FONTS} value={state.displayFont} onChange={(id) => update({ displayFont: id })} />
            <FontRow label="Body" options={BODY_FONTS} value={state.bodyFont} onChange={(id) => update({ bodyFont: id })} />
            <FontRow label="Labels" options={MACH_FONTS} value={state.machFont} onChange={(id) => update({ machFont: id })} />
            <RangeRow
              label="Display type scale"
              token={rangeToken("type-scale")}
              value={state.ranges["type-scale"]}
              onChange={(v) => setRange("type-scale", v)}
            />
            <RangeRow
              label="Label tracking"
              token={rangeToken("tracking-scale")}
              value={state.ranges["tracking-scale"]}
              onChange={(v) => setRange("tracking-scale", v)}
            />
          </Section>

          <Section title="Layout & Spacing">
            <RangeRow label="Container gutter" token={rangeToken("gutter")} value={state.ranges["gutter"]} onChange={(v) => setRange("gutter", v)} />
            <RangeRow label="Section rhythm" token={rangeToken("band-gap")} value={state.ranges["band-gap"]} onChange={(v) => setRange("band-gap", v)} />
            <RangeRow label="Content max-width" token={rangeToken("maxw")} value={state.ranges["maxw"]} onChange={(v) => setRange("maxw", v)} />
          </Section>

          <Section title="Borders & Radius">
            <RangeRow label="Panel radius" token={rangeToken("radius")} value={state.ranges["radius"]} onChange={(v) => setRange("radius", v)} />
            <RangeRow label="Panel border width" token={rangeToken("border-w")} value={state.ranges["border-w"]} onChange={(v) => setRange("border-w", v)} />
          </Section>

          <Section title="Motion">
            <RangeRow label="Motion speed" token={rangeToken("motion-speed")} value={state.ranges["motion-speed"]} onChange={(v) => setRange("motion-speed", v)} />
            <RangeRow
              label="Signal intensity"
              token={{ min: SIGNAL_INTENSITY_RANGE.min, max: SIGNAL_INTENSITY_RANGE.max, step: SIGNAL_INTENSITY_RANGE.step, unit: "×" }}
              value={state.signalIntensity}
              onChange={(v) => update({ signalIntensity: v })}
            />
          </Section>

          <div style={{ padding: "12px 14px", borderTop: `1px solid ${UI.border}` }}>
            <button onClick={handleExport} style={primaryButtonStyle()}>
              {copyStatus === "copied" ? "Copied to clipboard ✓" : "Export as CSS"}
            </button>
            <p style={{ fontSize: 11, color: UI.muted, marginTop: 8, lineHeight: 1.5 }}>
              Dev-only. Overrides live in this browser&apos;s localStorage — they never ship to
              production and nobody else sees them.
            </p>
          </div>
        </div>
      )}

      <button onClick={() => setOpen((v) => !v)} style={toggleButtonStyle()}>
        {open ? "✕ CLOSE" : "⚙ TWEAK"}
      </button>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ padding: "12px 14px", borderTop: `1px solid ${UI.border}` }}>
      <div style={{ fontSize: 10, letterSpacing: "0.14em", color: UI.muted, marginBottom: 10, textTransform: "uppercase" }}>
        {title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{children}</div>
    </div>
  );
}

function ColorRow({ token, value, onChange }: { token: ColorToken; value: string; onChange: (v: string) => void }) {
  return (
    <label
      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, fontSize: 12 }}
      title={token.hint}
    >
      <span>{token.label}</span>
      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ width: 26, height: 22, padding: 0, border: `1px solid ${UI.border}`, borderRadius: 4, background: "none", cursor: "pointer" }}
        />
        <span style={{ fontFamily: UI.mono, fontSize: 10.5, color: UI.muted, width: 62 }}>{value}</span>
      </span>
    </label>
  );
}

interface RangeTokenLike {
  min: number;
  max: number;
  step: number;
  unit: string;
}

function RangeRow({
  label,
  token,
  value,
  onChange,
}: {
  label: string;
  token: RangeTokenLike;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12 }}>
      <span style={{ display: "flex", justifyContent: "space-between" }}>
        <span>{label}</span>
        <span style={{ fontFamily: UI.mono, fontSize: 10.5, color: UI.muted }}>
          {value}
          {token.unit}
        </span>
      </span>
      <input
        type="range"
        min={token.min}
        max={token.max}
        step={token.step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: UI.accent }}
      />
    </label>
  );
}

function FontRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: FontOption[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, fontSize: 12 }}>
      <span>{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          background: UI.bg,
          color: UI.text,
          border: `1px solid ${UI.border}`,
          borderRadius: 6,
          fontSize: 11.5,
          padding: "4px 6px",
          maxWidth: 170,
        }}
      >
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function smallButtonStyle(): CSSProperties {
  return {
    background: "transparent",
    border: `1px solid ${UI.border}`,
    color: UI.text,
    borderRadius: 6,
    padding: "5px 9px",
    fontSize: 10.5,
    cursor: "pointer",
  };
}

function primaryButtonStyle(): CSSProperties {
  return {
    width: "100%",
    background: UI.accent,
    border: `1px solid ${UI.accent}`,
    color: "#0b0d12",
    borderRadius: 6,
    padding: "9px 10px",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
  };
}

function toggleButtonStyle(): CSSProperties {
  return {
    background: UI.panel,
    border: `1px solid ${UI.border}`,
    color: UI.text,
    borderRadius: 999,
    padding: "10px 16px",
    fontSize: 12,
    fontFamily: UI.mono,
    letterSpacing: "0.08em",
    cursor: "pointer",
    boxShadow: "0 12px 30px rgba(0,0,0,.45)",
  };
}
