/**
 * Tweak Bar schema — dev-tool configuration, not site content. Every
 * control here maps to a CSS custom property already used throughout
 * globals.css (or, for fonts/signal intensity, a small runtime hook),
 * so tweaking never creates one-off styles — it just re-parameterizes
 * the existing design system.
 */

export interface ColorToken {
  id: string;
  label: string;
  cssVar: string;
  default: string;
  hint?: string;
}

export const COLOR_TOKENS: ColorToken[] = [
  { id: "tape", label: "Background", cssVar: "--tape", default: "#0d0d0d" },
  { id: "tape-2", label: "Panel", cssVar: "--tape-2", default: "#030303" },
  { id: "paper", label: "Ink — primary", cssVar: "--paper", default: "#ffffff" },
  { id: "steel", label: "Ink — secondary", cssVar: "--steel", default: "#d6d6d6" },
  { id: "rust", label: "Accent", cssVar: "--rust", default: "#666666" },
  { id: "rule", label: "Border", cssVar: "--rule", default: "#000000" },
  {
    id: "phosphor",
    label: "Signal",
    cssVar: "--phosphor",
    default: "#ff0000",
    hint: "The live indicators — oscilloscope, LED dots, meter peaks, the shader hero glow — AND the hover/accent color, which is derived from this one. One control for all of it.",
  },
];

export interface RangeToken {
  id: string;
  label: string;
  cssVar: string;
  min: number;
  max: number;
  step: number;
  default: number;
  unit: string;
  hint?: string;
}

export const RANGE_TOKENS: RangeToken[] = [
  { id: "type-scale", label: "Display type scale", cssVar: "--type-scale", min: 0.7, max: 1.6, step: 0.05, default: 1.1, unit: "×" },
  { id: "tracking-scale", label: "Label tracking", cssVar: "--tracking-scale", min: 0, max: 2.2, step: 0.1, default: 1.6, unit: "×" },
  { id: "gutter", label: "Container gutter", cssVar: "--pad", min: 12, max: 72, step: 2, default: 12, unit: "px" },
  { id: "band-gap", label: "Section rhythm", cssVar: "--band-gap", min: 24, max: 140, step: 4, default: 116, unit: "px" },
  { id: "maxw", label: "Content max-width", cssVar: "--maxw", min: 860, max: 1600, step: 20, default: 1300, unit: "px" },
  { id: "radius", label: "Panel radius", cssVar: "--radius", min: 0, max: 28, step: 1, default: 0, unit: "px" },
  { id: "border-w", label: "Panel border width", cssVar: "--border-w", min: 0, max: 4, step: 0.5, default: 0.5, unit: "px" },
  { id: "motion-speed", label: "Motion speed", cssVar: "--motion-speed", min: 0.25, max: 2.5, step: 0.05, default: 1.5, unit: "×" },
];

/** Not a CSS var — read directly by the canvas engine at draw time. */
export const SIGNAL_INTENSITY_DEFAULT = 1.2;
export const SIGNAL_INTENSITY_RANGE = { min: 0.2, max: 2, step: 0.05 };

export interface FontOption {
  id: string;
  label: string;
  /** Full value to assign to the CSS var (family + fallback stack). */
  cssValue: string;
  /** Google Fonts css2 `family=` query value. Omit for already-loaded defaults. */
  googleFamily?: string;
}

export const DISPLAY_FONTS: FontOption[] = [
  { id: "bebas-neue", label: "Bebas Neue (default)", cssValue: '"Bebas Neue", "Arial Black", system-ui, sans-serif' },
  { id: "old-english", label: "Old English", cssValue: '"UnifrakturMaguntia", "Old English Text MT", "Times New Roman", serif', googleFamily: "UnifrakturMaguntia" },
  { id: "big-shoulders", label: "Big Shoulders Display", cssValue: '"Big Shoulders Display", "Arial Black", system-ui, sans-serif', googleFamily: "Big+Shoulders+Display:wght@400;700" },
  { id: "archivo-black", label: "Archivo Black", cssValue: '"Archivo Black", "Arial Black", system-ui, sans-serif', googleFamily: "Archivo+Black" },
  { id: "anton", label: "Anton", cssValue: '"Anton", "Arial Black", system-ui, sans-serif', googleFamily: "Anton" },
  { id: "oswald", label: "Oswald", cssValue: '"Oswald", "Arial Narrow", system-ui, sans-serif', googleFamily: "Oswald:wght@400;600" },
  { id: "space-grotesk-display", label: "Space Grotesk", cssValue: '"Space Grotesk", system-ui, sans-serif', googleFamily: "Space+Grotesk:wght@400;600" },
  { id: "unbounded", label: "Unbounded", cssValue: '"Unbounded", system-ui, sans-serif', googleFamily: "Unbounded:wght@400;700" },
];

export const BODY_FONTS: FontOption[] = [
  { id: "inter", label: "Inter (default)", cssValue: '"Inter", system-ui, -apple-system, sans-serif' },
  { id: "manrope", label: "Manrope", cssValue: '"Manrope", system-ui, sans-serif', googleFamily: "Manrope:wght@400;500;600" },
  { id: "work-sans", label: "Work Sans", cssValue: '"Work Sans", system-ui, sans-serif', googleFamily: "Work+Sans:wght@400;500;600" },
  { id: "ibm-plex-sans", label: "IBM Plex Sans", cssValue: '"IBM Plex Sans", system-ui, sans-serif', googleFamily: "IBM+Plex+Sans:wght@400;500;600" },
  { id: "sora", label: "Sora", cssValue: '"Sora", system-ui, sans-serif', googleFamily: "Sora:wght@400;500;600" },
];

export const SERIF_FONTS: FontOption[] = [
  { id: "playfair-display", label: "Playfair Display (default)", cssValue: '"Playfair Display", Georgia, serif' },
  { id: "merriweather", label: "Merriweather", cssValue: '"Merriweather", Georgia, serif', googleFamily: "Merriweather:wght@400;700" },
  { id: "lora", label: "Lora", cssValue: '"Lora", Georgia, serif', googleFamily: "Lora:wght@400;600" },
  { id: "newsreader", label: "Newsreader", cssValue: '"Newsreader", Georgia, serif', googleFamily: "Newsreader:wght@400;500;600" },
  { id: "literata", label: "Literata", cssValue: '"Literata", Georgia, serif', googleFamily: "Literata:wght@400;500;600" },
];

export const MACH_FONTS: FontOption[] = [
  { id: "jetbrains-mono", label: "JetBrains Mono (default)", cssValue: '"JetBrains Mono", "Courier New", monospace' },
  { id: "space-mono", label: "Space Mono", cssValue: '"Space Mono", "Courier New", monospace', googleFamily: "Space+Mono:wght@400;700" },
  { id: "special-elite", label: "Special Elite", cssValue: '"Special Elite", "Courier New", monospace', googleFamily: "Special+Elite" },
  { id: "courier-prime", label: "Courier Prime", cssValue: '"Courier Prime", "Courier New", monospace', googleFamily: "Courier+Prime:wght@400;700" },
  { id: "ibm-plex-mono", label: "IBM Plex Mono", cssValue: '"IBM Plex Mono", "Courier New", monospace', googleFamily: "IBM+Plex+Mono:wght@400;500;600" },
  { id: "major-mono", label: "Major Mono Display", cssValue: '"Major Mono Display", "Courier New", monospace', googleFamily: "Major+Mono+Display" },
];

export const ARTISTIC_FONTS: FontOption[] = [
  { id: "pacifico", label: "Pacifico (default)", cssValue: '"Pacifico", cursive' },
  { id: "lobster", label: "Lobster", cssValue: '"Lobster", cursive', googleFamily: "Lobster" },
  { id: "permanent-marker", label: "Permanent Marker", cssValue: '"Permanent Marker", cursive', googleFamily: "Permanent+Marker" },
  { id: "caveat", label: "Caveat", cssValue: '"Caveat", cursive', googleFamily: "Caveat:wght@400;600" },
  { id: "unifraktur", label: "Old English (Unifraktur)", cssValue: '"UnifrakturMaguntia", serif', googleFamily: "UnifrakturMaguntia" },
];

export interface TweakState {
  colors: Record<string, string>;
  ranges: Record<string, number>;
  signalIntensity: number;
  displayFont: string;
  bodyFont: string;
  serifFont: string;
  machFont: string;
  artisticFont: string;
}

export function defaultTweakState(): TweakState {
  return {
    colors: Object.fromEntries(COLOR_TOKENS.map((t) => [t.id, t.default])),
    ranges: Object.fromEntries(RANGE_TOKENS.map((t) => [t.id, t.default])),
    signalIntensity: SIGNAL_INTENSITY_DEFAULT,
    displayFont: DISPLAY_FONTS[0].id,
    bodyFont: BODY_FONTS[0].id,
    serifFont: SERIF_FONTS[0].id,
    machFont: MACH_FONTS[0].id,
    artisticFont: ARTISTIC_FONTS[0].id,
  };
}

export interface Preset {
  id: string;
  label: string;
  description: string;
  state: Partial<TweakState>;
}

export const PRESETS: Preset[] = [
  {
    id: "locked-brand",
    label: "Locked Brand",
    description: "Reset to the shipped V2 design system.",
    state: {},
  },
  {
    id: "maximalist-rack",
    label: "Maximalist Rack",
    description: "Bigger, louder, faster — leans into the hardware-rack side of the brand.",
    state: {
      colors: { rust: "#e8622f", phosphor: "#ff2a1f" },
      ranges: { "type-scale": 1.15, "tracking-scale": 1.3, "border-w": 2, radius: 0, "motion-speed": 1.3 },
      signalIntensity: 1.4,
    },
  },
  {
    id: "soft-tape",
    label: "Soft Tape",
    description: "Rounded, quieter, warmer — softens every hard edge in the system.",
    state: {
      colors: { paper: "#fbf6ec", "tape-2": "#1a1613", rust: "#9c5b3f" },
      ranges: { radius: 10, "type-scale": 0.95, "tracking-scale": 0.9, "motion-speed": 0.8 },
      signalIntensity: 0.8,
    },
  },
  {
    id: "cold-signal",
    label: "Cold Signal",
    description: "Rust swapped for a cool cyan accent, on a cooler near-black ground. Signal (and everything linked to it) goes cyan too.",
    state: {
      colors: { tape: "#0d1013", "tape-2": "#141a1e", paper: "#edf2f4", steel: "#a9b7be", rust: "#3e7cb1", phosphor: "#5ac8e8" },
      ranges: { radius: 4, "tracking-scale": 1.1 },
    },
  },
  {
    id: "editorial",
    label: "Editorial",
    description: "A typographic pivot only — serif pull-quotes, condensed display, more air between sections.",
    state: {
      displayFont: "oswald",
      serifFont: "newsreader",
      machFont: "courier-prime",
      ranges: { "type-scale": 1.1, "tracking-scale": 0.85, "band-gap": 100 },
    },
  },
];
