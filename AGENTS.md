<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- # Cafe Caderas — locked V3 design system

Quick reference for the coding agent. The design system is locked — re-parameterize it via the existing CSS custom properties in `app/globals.css`; don't invent new ones. Full history lives in `README.md`'s Decisions Log.

**Tokens (V3 "Live Signal", current):**
- Ground: `--tape #0d0d0d`, `--tape-2 #030303`, `--rule #000000`. Ink: `--paper #ffffff`, `--steel #d6d6d6`.
- `--phosphor` (default `#ff0000`) is the ONE signal color — oscilloscopes, LED dots, the shader hero glow, and `--rust-lit` (hover/accent), which is *derived* from it via `color-mix()`, not independent. `--rust` is a plain neutral gray, unrelated to phosphor.
- Five font roles: `--display` Bebas Neue, `--body` Inter, `--serif` Playfair Display, `--mach` JetBrains Mono, `--artistic` Pacifico. `--lcd` stays a system monospace stack for numeric readouts — untouched, a deliberate distinction from `--mach`.

**The signal is real, not decorative.** `components/canvas/signal-engine.ts` owns `wave()` and the one shared `requestAnimationFrame` loop every canvas registers with — not one loop per canvas. `components/canvas/audio-engine.ts` (synthesized audio, no file) and `components/canvas/interaction-engine.ts` (real scroll/mouse activity) both feed real energy into that loop. Under `prefers-reduced-motion: reduce`, the loop never starts — draw one static frame instead.

**Quality bar:** no lorem ipsum; no new dependency without a real requirement (see the README's Technology rule); match the existing hand-rolled-engine style in `components/canvas/` and `components/home/TapeTransport/` rather than reaching for a library.

**The one exception to hand-rolling is `components/three/`** — the Hero's Reactor uses Three.js + React Three Fiber + postprocessing, because a displaced 3D mesh with multi-pass bloom is not worth hand-writing. Keep it contained: every other canvas on the site stays on the 2D engine, and the reactor must stay behind `ReactorLoader`'s lazy import so its ~994 KB chunk never loads on routes that don't show it. `reactor-uniforms.ts` is a module singleton on purpose (same shape as the three engines) — it is rAF-owned mutable state, so don't try to move it into React state or refs.

**Hardware surfaces come from `components/canvas/metal.ts`** — `millGrain`, `bezelPanel`, `machinedKnob`, `tineBank`, `statusLed`, `seamLine`, `engrave`. Build new panels/meters from those parts rather than hand-rolling gradients per component; the DOM equivalent is the `.milled` + `.bezel` utility pair in `globals.css`. The look is all-metal and monochrome with **one** lit element, which must always be `--phosphor` — spending the accent anywhere else is what breaks it.

**To make a section reactive, add a preset — don't write a shader.** `components/three/presets.ts` holds every knob (mode, gain, density, mouse/scroll pull, audio band, hue offsets); mount it with `<SectionFieldLoader preset="name" />` inside any `position: relative` host. `lab` and `works` presets are already defined and waiting to be mounted on those pages. See all of them side by side at `/dev/gallery`.

**Anything that reads the engines per-frame must go through `components/three/signal-frame.ts`.** `interaction-engine`'s `decay()` is idempotent only for an identical `t`, so polling the engines from more than one render loop makes mouse/scroll energy decay several times too fast. One read per frame, shared by every scene — never call `getInteractionEnergy`/`getAudioBands` directly from a new canvas.

## Future tooling ideas (not built — noted for later)

- **Component gallery** — one page/route showing every UI module (nav, row, meter, scope, CV table) in isolation across default/hover/focus states. A reference to diff the real build against; catches inconsistencies page-level views hide.
- **Token sheet** — the current V3 palette + type scale as swatches/specimens with contrast ratios. Lower urgency than it would've been under the old V2 palette (white-on-near-black is already high-contrast), but still worth having.
- **Motion study** — `TapeTransport`'s tuning constants (the `0.09` scroll-lerp in `components/home/TapeTransport/index.tsx`, the drag inertia decay, etc.) exposed as draggable sliders, to tune by feel before hard-coding a value.
- **Copy deck** — every real string on the site set in the real fonts at real sizes, so copy gets written before it lands in `lib/content/`.

If any of these get built as a published Claude Artifact rather than an in-repo route: it's just a URL, and URLs here rot — an artifact can be unpublished, and a republish from a session that doesn't own it fails outright. Prefer an in-repo `/dev/...` route for anything meant to stick around; an Artifact is fine for a quick one-off. -->
