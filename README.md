# website-portfolio

> **Source of truth.** This document is the spec for this project. When requirements change, update this file *before* changing the build (see Change Rule at the bottom).

**version control:**  
confirm progress. See the Decisions Log for what V1/V2/V3,etc each mean concretely 


**Current version: V3 — "Live Signal"** (branches `design4`→`design5`, in progress). See the Decisions Log for what V1/V2/V3 each mean concretely — V1 = initial scaffold, V2 = the locked static brand system (`design1`–`design3`), V3 = the same brand system made *real*: synthesized audio, WebGL, one generative signal color, and a scroll/mouse-reactive engine, replacing what used to be decorative math. always update me after pushing to main ! important **

**Dev Team**
me = Product Manager 
claude via VS Code extension aka Senior Dev = ai agent #1
chat gpt = ai agent #2
claude desktop app = ai agent #3 


## 01 — What are we building?

**Project:** "website-portfolio site"

**One-liner:** A personal website + public creative/technical laboratory for showcasing work, experimenting with technology, and creating proof of concept across web, audio, video, WebGL, and creative systems.

**Problem:** A static portfolio doesn't demonstrate the process, experimentation, or range of skills being developed. The site should become a living space where skills are applied publicly and turned into tangible proof of capability.

**Success** = The site is live, useful as a portfolio, easy to evolve, and continuously demonstrates real technical + creative work as new skills are learned.

## 02 — Scope

**MUST HAVE:**
- Portfolio / project showcase
- Experimental "lab" space for proof of concepts
- Creative work spanning multiple arts / mediums
- Responsive, polished web experience using new tech
- Architecture that can grow with new projects and technologies
- Publicly accessible deployment
- Clear foundation for future subdomains / sections

**NICE TO HAVE:**
- Interactive WebGL experiences
- Audio / music experiences
- Video / visual experiments
- Services site
- AI-powered experiences
- Additional subdomains
- More advanced creative systems

**DO NOT BUILD:**
- Full SaaS product
- Complex backend infrastructure
- Unnecessary AI features
- Cheesy AI slop
- Corporate looking AI
- A boring website

## 03 — Behavior

USER → SYSTEM → RESULT

[Visitor explores portfolio / projects / experiments] → [Site presents the work through appropriate content and interactive experiences] → [Visitor understands the work, capabilities, and creative/technical direction]

## 04 — Tech

**Platform:** Web

**Stack:**
- **Frontend:** Next.js + React + TypeScript
- **Backend:** Supabase
- **Database:** PostgreSQL
<!-- - **Auth:** TBD
- **APIs / Integrations:** TBD -->
- **Hosting:** Vercel

**Constraints:** Each version ("V1", "V2", …) should remain simple, scalable, inexpensive to operate, and flexible enough to support future audio, video, WebGL, creative coding, APIs, and interactive experiments.

<!-- **Architecture principle:** Keep the core minimal and stable. Introduce technologies at the experiment/project level only when they solve an actual requirement or enable a meaningful experiment. -->

**Technology rule:** An experiment should not force the entire website to adopt its technology. New technologies must earn their place. 

## 05 — Data + Integrations

**INPUTS:** Projects, portfolio content, creative work, experiments, media, code, and future interactive experiences.

**OUTPUTS:** Portfolio pages, project showcases, experiments, proof of concepts, creative experiences, and eventually services / content.

**DATA:** Project information, portfolio content, media metadata, experiment information, and other site content as needed.

**EXTERNAL SERVICES:** Vercel, GitHub, and future APIs / services as required by individual experiments.

<!-- **SECRETS / KEYS:** TBD based on integrations. -->

## 06 — Ship It

**Environments:** local / staging / production

**Deployment:** Vercel

**Required accounts:** GitHub / Vercel

## 07 — Rules of Engagement

**AI CAN:** Experiment with technologies, recommend, research, explain, architect, code, refactor, test, debug, create files, install packages, improve documentation, and test audio visual tools.

**AI MUST ASK BEFORE:** Any decision that touches design, security, or money. Examples include major design-direction changes, security-sensitive changes, deleting important work, spending money, adding significant infrastructure, or other decisions where the human needs to explicitly choose the direction.

**Career alignment:** The long-term direction combines web development (React/Next.js), creative development (WebGL/Three.js/shaders), audio (Web Audio/Tone.js), visual (Canvas/animation/video), systems (APIs/databases/architecture), AI (APIs/agents/creative tooling), and professional engineering (TypeScript/Git/testing/deployment).

The goal is not simply "a guy who makes websites." The longer-term direction is closer to a **creative technologist / creative systems developer** — someone who builds interactive experiences across web, audio, visual, and emerging technology.

**The loop:** Website → Portfolio + Lab → Learning → Experiments → Proof → Opportunities.

**One warning:** Start simple: Next.js + React + TypeScript + CSS + Git + Vercel. Then let the site itself dictate what technology gets learned next. 

## 08 — Build Plan

- **PHASE 1 — done:** Build the V1 foundation — establish the core portfolio experience, site structure, styling, content architecture, Git/GitHub workflow, and deployment.
- **PHASE 2 — done:** Build the experimental layer — establish the lab, projects, proof of concepts, and structure for adding new technologies without rebuilding the site.
- **PHASE 3 — in progress:** Expand design using iterations, AI, APIs, advanced interactions, trying new technology and future subdomains/services as justified.
- **PHASE 4:** Expand on premium feel using WebGL, audio, video, to create a real artistic masterpiece. 
- **PHASE 5:** Keeping the website flexible for new changes in tech, design, and content is the ultimate balance — balancing version control, portfolio, and performance.

---

## Decisions Log

Concrete choices made while scaffolding V1 (this section grows over time — see Change Rule):

- **Cloned from** `~/Documents/LocalProjects/artist-website` — reused its App Router / TypeScript / Tailwind v4 foundation and the existing `AnimateIn`, `Navbar`, and CSS-token theming patterns rather than starting from scratch.
- **V# sections:** Home, Portfolio (index + `[slug]` project detail), Lab (index), About, Contact.
- **Content status:** Home/About/Contact/Lab currently use lorem-ipsum placeholder copy. Real copy and visual identity are deferred to a dedicated design Q&A. The original Cafe Caderas DJ landing page content (copy + links) was preserved, not deleted — it now lives as a real project entry at `/portfolio/cafe-caderas`.
- **Animation:** Framer Motion and animate.css are installed in addition to the existing zero-dependency `AnimateIn` scroll-reveal component. Framer Motion isn't wired into any component yet — installed and ready for the design phase.
- **Stack versions (pinned for stability):** Next.js 16.3.3, React/React DOM 19.2.8, Tailwind CSS 4.3.3. TypeScript is pinned to **6.0.3** rather than the newest 7.x line, because `typescript-eslint` (pulled in by `eslint-config-next`) only supports `typescript >=4.8.4 <6.1.0` as of this writing — TS 7 would break linting. ESLint is pinned to **9.39.5** rather than the newest 10.x line for the same reason: `eslint-plugin-react` (also pulled in by `eslint-config-next`) only supports `eslint <=9.7`.
- **GitHub:** repo created at `github.com/cafecaderas/website-portfolio` (public), initial V1 scaffold pushed to `main`.
- **`main` is now actually protected, not just documented as such.** Every push to `main` had been allowed straight through until this point — verified by directly testing it (a throwaway push was rejected by GitHub after the rule went on). Current rule: PRs required (`main` included, no admin bypass), the CI check below must pass and the branch must be up to date first, no force-pushes, no deletions. All work happens on separate branches (`design#` for design iterations, short-lived topic branches like `ci-setup` for anything else) and lands via PR.
- **CI** (`.github/workflows/ci.yml`) runs `tsc --noEmit`, `eslint`, and `next build` on every PR into `main` and every push to `main` — the status check the branch protection rule above requires.

### V2 — Cafe Caderas design system (branches `design1`–`design3`)

Brand system is a working reference mockup, replacing the V1 lorem-ipsum scaffold — a full visual/structural rebuild against a locked, static brand system. The visual direction is not permanent — the brand design system stays open to iteration; the lab is the point.

- **Routes:** four total — `/`, `/works` (client + commissioned work), `/lab` (experiments), `/about` (About **and** Contact merged onto one route, since the nav is fixed at exactly four items). `/portfolio` and `/contact` from V1 are gone.
- **Content model:** one typed array (`lib/content/projects.ts`) holds both Works and Lab entries; a project's `section` field decides placement, not its medium. Sample catalog content (Nocturne Studio, Patchbay, Library Organizer, etc.) is shipped as concrete placeholder data per the no-lorem rule — swap-ready for the real project list.
<!-- - **Canvas engine:** one shared `requestAnimationFrame` loop (`components/canvas/signal-engine.ts`) drives every oscilloscope, the header hairline pulse, and the scroll-spooled tape transport on Home — not one loop per canvas. Under `prefers-reduced-motion: reduce`, the loop never starts; each canvas draws a single static frame instead.
- **Framer Motion + animate.css** (installed in V1, unused until now) both got real jobs: Framer Motion drives the two shared-layout slides (active nav underline, active Works filter pill) that plain CSS handles clumsily; animate.css drives the ambient phosphor "live" pulse on LED status dots — cheap, continuous CSS keyframes instead of spinning up JS or canvas for something that simple. `MotionConfig reducedMotion="user"` wraps the app so those two animations also respect the OS setting. -->
- **Known TODOs in the content:** SoundCloud URL, GitHub URL, and CV PDF link are placeholders (`href="#"`, marked `TODO:` in `lib/content/site.ts`) — Instagram and the Cafe Caderas domain link are real.

### V3 — Live Signal (branches `design4`–`design5`, current)

Everything V2 called "alive" was actually decorative — a locked, static brand system with motion bolted on top for show. V3 makes it real: synthesized audio instead of a fake waveform, a hand-written WebGL shader instead of a stock photo, one generative signal color instead of a fixed palette, and a scroll/mouse-reactive engine instead of a canned animation loop. Same visual language as V2 — the phosphor/tape/oscilloscope identity — now actually wired to what the visitor does.

#### design4 — a real signal, a reactive interface

Everything on this site that looked "alive" through V2 was decorative — a math function (`wave()`) faking motion, a stock photo standing in for atmosphere. This phase makes the signal real and makes the interface respond to the visitor, not just play a loop at them.

- **Real Web Audio engine** (`components/canvas/audio-engine.ts`) — an ambient synth built entirely from oscillators, a filtered noise source, and an `AnalyserNode`; no audio file to source or license. Gesture-gated behind a **SIGNAL** toggle in the header (`components/chrome/SignalToggle.tsx`) — browsers block audio autoplay anyway, so that requirement became the tape-deck "power on" control. `getAudioEnergy()`/`getAudioBands()` return a synthetic idle pulse when the engine is off, so nothing it drives ever looks dead pre-opt-in.
- **That audio now drives the existing decorative motion** instead of replacing it: the oscilloscopes and tape transport multiply their existing `wave()` output by the real audio energy, so the "signal" is genuinely responding to sound once SIGNAL is on, and unchanged (multiplier ≈ 1) when it's off.
- **WebGL shader hero** (`components/home/ShaderHero.tsx`) — hand-written GLSL, no Three.js (matches the site's existing from-scratch-engine ethos, no new dependency). Joins the *same* shared `requestAnimationFrame` loop as every other canvas (`registerDraw()` is generic, not 2D-context-specific). Reacts to the real audio bands and, as of the interactivity pass below, to the cursor — a flow-noise field that bends toward the mouse.
- **Bug found + fixed:** Tailwind's build pipeline minifies `#ff0000` down to the shorter CSS keyword `red` in the compiled stylesheet. The hex-only color parser used for semi-transparent phosphor draws (`phosphorRgba()` in `signal-engine.ts`) silently mis-parsed that keyword — its "3-char shorthand" branch treated `"red"` as hex digits, producing a wrong tint anywhere phosphor was used at partial opacity (most visibly, the header signal pulse). Replaced with a browser-native color resolver (an offscreen 1×1 canvas) that correctly handles any valid CSS color string, not just hex.
- **Display font → Old English / blackletter** (`UnifrakturMaguntia`, self-hosted via `next/font/google`). This Next version's bundled font-metrics database doesn't cover this family, so Next couldn't build its usual layout-shift-safe fallback and logged a warning on every request (`Failed to find font override values... Skipping generating a fallback font`) — fixed by passing `adjustFontFallback: false`, which tells Next not to attempt it rather than silently failing. (The earlier "Big Shoulders" choice hit the same class of issue for a different reason — "Big Shoulders Display" specifically isn't in this Next version's font export list at all, only the base cut — and is still offered as a Tweak Bar option, just no longer the shipped default.) **Superseded below** — replaced with a 5-font system in the same session's next entry.
- **Page transitions** (`components/chrome/PageTransition.tsx`) — Framer Motion `AnimatePresence` keyed on the route, wrapping `{children}` in the root layout.
- **Live GitHub stat** — one unauthenticated, revalidated fetch to the public GitHub API (`lib/github.ts`) surfaces the repo's real last-push time on the Lab page's "This Site" card, in place of a static version string.
- **Scroll + mouse reactivity pass** — new `components/chrome/Reveal.tsx` (Framer `whileInView`) on every major section; a `useScroll`-driven progress bar under the header (`ScrollProgress.tsx`); the two Hero CTAs went magnetic (`MagneticButton.tsx`, `useMotionValue` + `useSpring`); every Lab module / work row / sidecard got a cursor-spotlight hover glow. Two different techniques, deliberately: **Framer Motion** for the *few*-element, declarative cases (reveals, scroll progress, the two magnetic buttons) since it already owns "motion" here and everything inherits the app-wide `MotionConfig reducedMotion="user"` for free; **vanilla `pointermove` + CSS custom properties** for the spotlight glow, applied to a dozen+ repeated cards — a `radial-gradient` reads two CSS vars the event handler writes directly via `e.currentTarget`, fully GPU-composited with zero React re-renders, versus a Framer motion value per card. (Rows without a case study — `.row--static` — deliberately keep no hover treatment at all, matching their existing "not clickable" styling.)
- **Tailwind, finally used for something:** until this pass, `@import "tailwindcss"` only fed the `@theme inline` token mapping — zero utility classes anywhere. The new, self-contained UI this pass adds (progress bar, spotlight glow layer) uses Tailwind utility classes instead of new hand-written rules in `globals.css`, and `@theme inline` grew two entries (`--color-rust-lit`, `--color-steel`) so those utilities can reach the rest of the locked palette. The existing design system (`.hero`, `.row`, `.mod`, etc.) stays exactly as it is in `globals.css` — converting it to Tailwind would fight the Tweak Bar, which targets those exact class names and CSS custom properties, and the README's own "don't force technology" rule.
- **Also fixed:** a real hydration bug surfaced by this pass — making `LabModuleGrid` a Client Component (needed for the spotlight's `onPointerMove`) exposed that its meter-bar heights (`Math.sin()`-based) aren't guaranteed bit-identical between the server (Node) and client (browser) JS engines, causing a server/client mismatch on every load. Fixed by rounding to 2 decimals before rendering. Also added `data-scroll-behavior="smooth"` to `<html>`, per a Next.js 16 warning about `scroll-behavior: smooth` interacting with route transitions.

#### design4 (cont.) — five fonts, a linked accent color, and a rebuilt TapeTransport

- **Font system rebuilt from zero, 3 roles → 5.** Old English is gone (see above); every font is now the "leader" of its category, chosen for broad recognition and — as important — verified present in this Next version's bundled font list before picking it, so there's no repeat of the metrics-warning problem: **Bebas Neue** (`--display`, headlines), **Inter** (`--body`, sans body copy), **Playfair Display** (`--serif`, new — pull-quotes: `.statement` on Home, `.contact .big` on About), **JetBrains Mono** (`--mach`, labels/nav/buttons), **Pacifico** (`--artistic`, new — the TapeTransport A-SIDE/B-SIDE labels, cassette-label style). All five load with `adjustFontFallback: false` uniformly rather than per-font, so compatibility doesn't depend on which families happen to have override metrics bundled. `--lcd` (numeric readouts) stays a system monospace stack, untouched — a deliberate pre-existing distinction from `--mach`. The Tweak Bar's Typography section grew two rows (Serif, Artistic) to match; old defaults (Old English, Manrope, Space Mono) are still selectable, just no longer shipped.
- **Signal, hero glow, and hover color are now one setting.** `--rust-lit` (hover/accent) used to be an independent green; it's now `color-mix(in srgb, var(--phosphor) 65%, var(--paper) 35%)` — moved into the *derived* token block in `globals.css` (alongside `--tape-3`/`--rule-soft`/`--steel-dim`) and dropped from the Tweak Bar's directly-settable `COLOR_TOKENS`, so nothing can pin it independently of the signal color again. Changing "Signal" in the Tweak Bar now visibly cascades to hover states *and* the shader hero glow in one move — verified live (Signal → blue turns `--rust-lit`, every hover state, and the shader's rendered pixel color together). The `maximalist-rack`/`cold-signal` presets were updated to set `phosphor` instead of the old `rust-lit`, so they stay coherent under the new model.
- **`components/canvas/interaction-engine.ts`** (new) — real scroll/pointer activity tracked globally (same lazy-singleton shape as `audio-engine.ts`, but no gesture gate needed — no autoplay policy for scroll/pointer events). `getInteractionEnergy()` blends into `drawScope()`'s amplitude alongside `getAudioEnergy()`, so every oscilloscope site-wide now also responds to scroll/mouse activity, not just audio (verified directly against the module's internal state — a burst of pointer movement spiked its energy value from 1 → 2.9 and decayed back on schedule).
- **`components/home/TapeTransport.tsx` → `components/home/TapeTransport/`** (`index.tsx` + `draw.ts`) — a real folder now, split into React/event wiring vs. the pure canvas-drawing routine. Rebuilt per a specific list of asks:
  - Drive switched from audio to **scroll + mouse** specifically for this component (`getMouseEnergy()` + a scroll-velocity kick) — audio stays wired into the shared oscilloscope engine above, just not here.
  - The counter is a **real elapsed-time-on-site clock** (`getSiteElapsedSeconds()`, a timestamp captured once on module load) instead of a number reverse-engineered from scroll position.
  - **Both A-SIDE and B-SIDE render simultaneously**, crossfading opacity continuously with scroll position instead of hard-swapping at the 50% mark.
  - The **reels are click-and-draggable** — `pointerdown`/`pointermove` hit-tested against each reel's circle (`hitTestReel()` in `draw.ts`), a manual rotation offset added on top of the existing auto-spin, with a short inertia decay after release so it coasts rather than stopping dead.

#### design5 — shaping the signal, and a live color picker on the Hero

- **The synth is now playable, not just on/off.** `audio-engine.ts` gained a waveform pick (sine/sawtooth/square, applied live via `setWaveform()` — no restart needed) and one TONE knob that sweeps filter cutoff + resonance + noise floor together (`setTone()`, one control doing "filter and feedback/noise" at once, on purpose — keeping it to one knob rather than three). Both only appear in the header once SIGNAL is on.
- **Scroll/mouse energy made deliberately more dramatic**, and rewired rather than just retuned: `signal-engine.ts`'s `drawScope()` used to combine audio × interaction energy *multiplicatively*, which compounds fast into broken-looking numbers when both are excited at once. It's now additive-by-deviation (`1 + (audio−1) + (interaction−1)`, capped) — bigger swings, no runaway. `interaction-engine.ts` also gained a second, slow-decaying "afterglow" layer on top of the existing fast response, so a burst of activity now visibly lingers for several seconds instead of snapping back in half a second — verified directly against the module's internal state (a mouse burst spiked combined energy to its ceiling instantly; the fast layer settled in about a second, the afterglow took roughly three).
- **The Hero is a live X/Y color picker** (`components/home/heroColor.ts`) for the one linked signal color from the design4 entry above: X sweeps hue across the full wheel, Y sweeps lightness, written straight to `--phosphor` on every `pointermove` — no React state, same "direct DOM write" reasoning as the spotlight glow. No `pointerleave` handler on purpose: `pointermove` keeps firing right up to the boundary, so the color simply stops updating wherever the cursor exits — it "locks" there for free. Never persisted (no localStorage), so a real page reload always comes back to the shipped default; the Tweak Bar can still override it at any time, whichever one touches `--phosphor` last wins. Three deliberate tiers now: shipped default → this visitor-facing toy → the dev-only Tweak Bar.

#### design5 (cont.) — the Reactor: Three.js, React Three Fiber, and a real shader pipeline

- **Four new dependencies, weighed against the Technology rule** (§04): `three`, `@react-three/fiber`, `@react-three/postprocessing`, `postprocessing`. The old `ShaderHero` was a hand-rolled WebGL2 fragment shader with no geometry, no depth, and no post-processing — extending it to a displaced 3D mesh with bloom would have meant hand-writing a scene graph, a render loop, and a multi-pass bloom composer. That is precisely the "buy, don't build" case, and it is the *only* place on the site using these; every other canvas is still the hand-rolled 2D engine. `ShaderHero` was deleted, not kept alongside — one WebGL context, not two.
- **The reactor is driven entirely by the engines that already existed**, not by a new parallel energy system: `components/three/reactor-uniforms.ts` reads `audio-engine` (bands), `interaction-engine` (mouse/scroll/click) and `signal-engine` (`--phosphor`) once per frame and writes one shared uniform bag that the core, halo, and backdrop all reference *by object identity*. It is deliberately a module singleton, in the same shape and for the same reason as the three engines it reads — mutable state owned by a rAF loop, not by React's render cycle. This also sidesteps React 19's purity rules cleanly rather than fighting them with refs.
- **The chain, end to end:** mouse X/Y → core rotation *and* (via the existing Hero picker) `--phosphor`, which retints the entire scene including the header hairline and tape waveform. Scroll → halo orbit speed and direction. Click → `getClickImpulse()`, a new slow-decaying (0.962/frame) impulse in `interaction-engine.ts` that simultaneously inflates the mesh, fires an expanding shockwave through the vertex displacement, pushes and enlarges the particles, and drives bloom + RGB split. Audio bands map to three noise octaves: bass moves the silhouette, treble stipples the surface.
- **Tuning notes worth keeping**, all found by screenshotting the real build rather than reasoning about the code: `gl_PointSize`'s `300.0/depth` attenuation expects *world-unit* sizes, so the initial `1.1–3.7` scales produced 268-pixel particles that whited out the hero; an icosahedron at `detail: 4` (~7,680 edges) packs tightly enough that bloom smears it into a solid ball, so it runs at `detail: 3`; and `ChromaticAberration`'s offset is in normalized screen units, where even `0.005` fully separates the channels into red/green/blue copies — it is clamped to `0.0016`. The core's base brightness is deliberately tuned to sit *below* the bloom threshold so only rim and ridge peaks bloom, which is what keeps the logotype readable over it.
- **Lazy by construction:** `ReactorLoader` gates the dynamic import behind an `IntersectionObserver`, so the ~994 KB three.js chunk is fetched only once the hero is actually on screen — verified: `/about` and `/works` never request it. Once loaded it stays mounted and scrolling away flips `frameloop` to `"never"` rather than tearing down the WebGL context. Under `prefers-reduced-motion: reduce` the loop never runs (`frameloop="demand"`, one static frame), matching every other canvas on the site.

#### design5 (cont.) — reactive section fields, and a preset system to assign them

- **`components/three/presets.ts` is the new tuning surface.** A "field" is a cheap full-bleed WebGL layer behind a section that reacts to audio, cursor and scroll. Every knob one has — mode, gain, density, mouse/scroll pull, which audio band drives it, hue offsets, click gain — lives in that one file. Giving a section (or a whole page) its own character is an entry in `FIELD_PRESETS` plus one `<SectionFieldLoader preset="…" />`; no shader edits, no new component. `lab` and `works` presets are **already defined and tuned but deliberately not mounted** — wiring those pages up later is a one-line change each.
- **Mounted this pass:** `tape` (flowing ribbons behind the transport), `ticker` (treble-led level bars behind the marquee), `sides` (A-SIDE/B-SIDE), `work` (Selected Work). Every existing behaviour was left alone — the ticker is still the same CSS marquee, and the tape deck keeps its spool, drag, inertia and readouts; the fields sit strictly behind them at `z-index: 0` with `pointer-events: none`.
- **The A/B split is one draw call.** Rather than two canvases, the `sides` preset carries `hueShift` / `hueShiftB` and the shader crossfades hue across the midline — so "one brand, two sides" is literally rendered: sound reads one hue, systems another, both still derived from the single `--phosphor` token, so the Hero's RGB picker retints both at once.
- **`components/three/signal-frame.ts` exists for correctness, not caching.** `interaction-engine`'s `decay()` is idempotent only for an *identical* `t`. Once more than one WebGL scene polls the engines, each with its own clock, decay runs once per scene per frame and mouse/scroll energy falls off N× too fast. Every consumer — the reactor included — now goes through one shared per-frame read, so the engines advance exactly once regardless of how many fields are mounted. This was a latent bug the moment a second canvas existed.
- **Cost:** five WebGL contexts on Home (reactor + four fields), verified alive with no console errors. Fields are orthographic single-quad fragment shaders with no post-processing, each lazily mounted on its own `IntersectionObserver` and paused (`frameloop="never"`) when scrolled away. They add **no download** on a page that already loads the reactor's chunk, and `/about` still fetches no three.js at all.
- **Bug worth remembering:** the grid used `smoothstep(0.5, 0.42, abs(cell))`, which is inverted — it fills cell *interiors* and leaves dark dots at the corners, so Selected Work rendered as a field of blocks rather than ruled lines. Grid lines want `smoothstep(lineWidth, 0.5, abs(cell))`. Caught by screenshotting the section, not by reading the shader.

#### design5 (cont.) — the cast deck: an all-metal hardware language

Direction came from a reference mockup ("CAST DECK — all-metal, monochrome, one accent light"), kept in `components/assets/`. Its central idea already *was* this site's rule — one lit element and nothing else competing — so adopting it was mostly a matter of spending the accent budget more carefully.

- **`components/canvas/metal.ts` is the reusable half.** Plain functions over a 2D context — `millGrain`, `bezelPanel`, `machinedKnob`, `tineBank`, `statusLed`, `seamLine`, `engrave` — so any canvas on the site can build hardware surfaces from the same parts (lab meters and scopes are the obvious next users). The greys live there as rendering constants rather than new CSS variables: the token system is locked, and these are canvas fills, exactly like the hard-coded values the old deck already used.
- **`.milled` + `.bezel` are the DOM half.** Two composable utility classes carrying the same grain and machined edge, so the ticker strip and the A/B rack read as the same piece of equipment as the deck without duplicating any CSS. That split — canvas primitives for canvas, two utilities for DOM — is what let one visual language cover three areas cheaply.
- **The deck rebuild reuses every existing behaviour.** The two reels became machined knobs, which is a straight win: the drag/inertia code already produced a rotation angle, and a knob's pointer is exactly what wants an angle. Spool, drag, coast, the elapsed-time counter and the A/B crossfade are all untouched — only the rendering changed. The old waveform-in-a-tape-band became a bank of steel tines driven by the same `wave()` and drive energy.
- **Accent discipline:** the deck's only lit element is the PWR lamp, plus the A/B labels; the counter, stamp, hint and knob engravings are all greys. Both still derive from `--phosphor`, so the Hero's picker retints the deck's one light along with everything else.
- **The deck stops widening at 1080px** (`MAX_DECK_W`), so it reads as a unit of equipment rather than a stretched bar, with solid casing either side. Its inner plate is deliberately drawn as a *translucent* fill over a cleared region so the `tape` field's flow ribbons read faintly through it, like a backlit window — the field's gain was dropped to 0.34 to suit being behind metal rather than in front of it.
- **Labels moved into `lib/content/home.ts`** (`transportContent`) rather than being hard-coded in the component and the draw module, matching how the rest of the site handles copy. The A/B labels stay in `--artistic`: a handwritten cassette label against a machined deck is the contrast a real tape has, and it keeps the five-font system's artistic role in genuine use.
- **Test-harness note:** `.transport` now contains two canvases (the field, then the deck), so `document.querySelector('.transport canvas')` selects the *field*. The deck is `canvas[aria-label]`. Also, CDP's `Input.dispatchMouseEvent` only synthesizes pointer events when `pointerType` is passed — without it, `pointerdown` handlers never fire and a drag test silently does nothing.

## Change Rule
When requirements change, update this spec **before** changing the build.
