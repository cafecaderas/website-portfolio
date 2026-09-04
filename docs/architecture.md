# Architecture

> **How the system works today.** This is the present-tense reference: what exists, how the pieces
> connect, and the rules that keep them coherent. *Why* any of it ended up this way — what was
> tried, rejected, or broken along the way — lives in [decisions.md](decisions.md). The content
> schema has its own doc: [content-model.md](content-model.md).

## The Technology rule

**Technology rule:** An experiment should not force the entire website to adopt its technology. New technologies must earn their place. 

**Constraints:** Each version ("V1", "V2", …) should remain simple, scalable, inexpensive to operate, and flexible enough to support future audio, video, WebGL, creative coding, APIs, and interactive experiments.

This is the rule that decided every dependency on the list below. The clearest application of it is
Three.js: the Hero's Reactor needs a displaced 3D mesh with multi-pass bloom, which is genuinely not
worth hand-writing — so it earned its place, and it stays contained to `components/three/` while
every other canvas on the site remains the hand-rolled 2D engine.

## Design system

Quick reference for the coding agent. The design system is locked — re-parameterize it via the existing CSS custom properties in `app/globals.css`; don't invent new ones. Full history lives in [decisions.md](decisions.md).

**Tokens (V3 "Live Signal", current):**
- Ground: `--tape #0d0d0d`, `--tape-2 #030303`, `--rule #000000`. Ink: `--paper #ffffff`, `--steel #d6d6d6`.
- `--phosphor` (default `#ff0000`) is the primary signal color — oscilloscopes, LED dots, the shader hero glow, and `--rust-lit` (hover/accent), which is *derived* from it via `color-mix()`, not independent. `--rust` is a plain neutral gray, unrelated to phosphor.
- `--phosphor-b` (default `#00aaff`) is the **second light**, added in design6. The Hero drives both together as a pair of saturated hues 155° apart rather than interpolating one blended value between two anchors (which collapsed to grey at its midpoint). They are never pre-averaged: the reactor's shaders mix them *optically*, via two colored light directions, so both colors are visible at once and the blend appears as a third color beside them. `--phosphor-mix` is the CSS midpoint, for gradient midstops only — never a flat fill.
- The "one lit element" rule still holds; the two lights are one accent *system*, not licence for a second unrelated accent.
- Five font roles: `--display` Bebas Neue, `--body` Inter, `--serif` Playfair Display, `--mach` JetBrains Mono, `--artistic` Pacifico. `--lcd` stays a system monospace stack for numeric readouts — untouched, a deliberate distinction from `--mach`.

## The signal engines

**The signal is real, not decorative.** `components/canvas/signal-engine.ts` owns `wave()` and the one shared `requestAnimationFrame` loop every canvas registers with — not one loop per canvas. `components/canvas/audio-engine.ts` (synthesized audio, no file) and `components/canvas/interaction-engine.ts` (real scroll/mouse activity) both feed real energy into that loop. Under `prefers-reduced-motion: reduce`, the loop never starts — draw one static frame instead.

**Quality bar:** no lorem ipsum; no new dependency without a real requirement (see the Technology rule above); match the existing hand-rolled-engine style in `components/canvas/` and `components/home/TapeTransport/` rather than reaching for a library.

**The one exception to hand-rolling is `components/three/`** — the Hero's Reactor uses Three.js + React Three Fiber + postprocessing, because a displaced 3D mesh with multi-pass bloom is not worth hand-writing. Keep it contained: every other canvas on the site stays on the 2D engine, and the reactor must stay behind `ReactorLoader`'s lazy import so its ~994 KB chunk never loads on routes that don't show it. `reactor-uniforms.ts` is a module singleton on purpose (same shape as the three engines) — it is rAF-owned mutable state, so don't try to move it into React state or refs.

## Rendering surfaces and presets

**Hardware surfaces come from `components/canvas/metal.ts`** — `millGrain`, `bezelPanel`, `machinedKnob`, `tineBank`, `statusLed`, `seamLine`, `engrave`. Build new panels/meters from those parts rather than hand-rolling gradients per component; the DOM equivalent is the `.milled` + `.bezel` utility pair in `globals.css`. The look is all-metal and monochrome with **one** lit element, which must always be `--phosphor` — spending the accent anywhere else is what breaks it.

**To make a section reactive, add a preset — don't write a shader.** `components/three/presets.ts` holds every knob (mode, gain, density, mouse/scroll pull, audio band, hue offsets); mount it with `<SectionFieldLoader preset="name" />` inside any `position: relative` host. `lab` and `works` presets are already defined and waiting to be mounted on those pages. See all of them side by side at `/dev/gallery`.

**Anything that reads the engines per-frame must go through `components/three/signal-frame.ts`.** `interaction-engine`'s `decay()` is idempotent only for an identical `t`, so polling the engines from more than one render loop makes mouse/scroll energy decay several times too fast. One read per frame, shared by every scene — never call `getInteractionEnergy`/`getAudioBands` directly from a new canvas.

## Future tooling ideas (not built — noted for later)

- **Component gallery** — one page/route showing every UI module (nav, row, meter, scope, CV table) in isolation across default/hover/focus states. A reference to diff the real build against; catches inconsistencies page-level views hide.
- **Token sheet** — the current V3 palette + type scale as swatches/specimens with contrast ratios. Lower urgency than it would've been under the old V2 palette (white-on-near-black is already high-contrast), but still worth having.
- **Motion study** — `TapeTransport`'s tuning constants (the `0.09` scroll-lerp in `components/home/TapeTransport/index.tsx`, the drag inertia decay, etc.) exposed as draggable sliders, to tune by feel before hard-coding a value.
- **Copy deck** — every real string on the site set in the real fonts at real sizes, so copy gets written before it lands in `lib/content/`.
- **Scoped-Suspense pattern for a live per-row value** — built once (a live GitHub last-push stat on one LAB row), then removed along with the row it powered (see the **design7** entry in [decisions.md](decisions.md)). The technique itself is worth reusing if this need comes back: don't `await` the slow call in the page component (that gates the *whole* page behind it). Instead, create the Promise and pass it *unresolved* through props down to wherever the value is actually displayed, then unwrap it there with React's `use()` inside a `<Suspense>` boundary scoped to just that one element. Only that element suspends; everything else on the page renders immediately.

If any of these get built as a published Claude Artifact rather than an in-repo route: it's just a URL, and URLs here rot — an artifact can be unpublished, and a republish from a session that doesn't own it fails outright. Prefer an in-repo `/dev/...` route for anything meant to stick around; an Artifact is fine for a quick one-off.

## SEO & metadata

**Status: partially implemented.** See the **design6 — the SEO layer** entry in [decisions.md](decisions.md) for what changed and why.

- **Done:** distinct `<title>`/`<meta description>` per top-level route (Home/WORKS/LAB/ABOUT) via a title template on the root layout (`app/layout.tsx`) plus a `metadata` export on each section page; `metadataBase` set from `siteConfig.url`; `/sitemap.xml` (`app/sitemap.ts`) listing every real static route and every non-`test-*` project URL; `/robots.txt` (`app/robots.ts`) allowing everything except `/dev/`, pointing at the sitemap.
- **Not yet — paused, on request:** per-project dynamic `<title>`/`<meta description>` (a `generateMetadata` in `app/works/[slug]/page.tsx` / `app/lab/[slug]/page.tsx` deriving from each project's own `core.title`/`core.description`). Until this lands, every individual project detail page still serves the same site-wide title/description as everything else.
- **Not yet — pending a decision:** JSON-LD structured data (`Article`/`CreativeWork` schema per project) for rich-result eligibility. No OG/social preview image yet either (`metadataBase` is set so one can be added as a relative path later without extra config).
- **Not yet — blocked on real deployment:** `siteConfig.url` (`https://www.cafecaderas.com`) is used as the canonical domain throughout, matching the existing `social.website.href` — this hasn't been verified against an actual live deployment of this codebase, so treat the sitemap/robots output as correct in shape, not yet confirmed in production.
