# website-portfolio

> **Source of truth.** This document is the spec for this project. When requirements change, update this file *before* changing the build (see Change Rule at the bottom).

**Research / references:** [x.com/matinotfound](https://x.com/matinotfound) · [vgpu.sh](http://vgpu.sh)

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
- **GitHub:** repo created at `github.com/cafecaderas/website-portfolio` (public), initial V1 scaffold pushed to `main`. `main` is protected — all further work happens on separate branches (e.g. `design4`).

### "design#" / V# — Cafe Caderas design system (branch `design#`)

Brand system is a working reference mockup, replacing the `design#` / V# version before it — evolving from a lorem-ipsum scaffold toward a polished CMS with custom code-level editing. The visual direction is not permanent — the brand design system stays open to iteration; the lab is the point.

- **Routes:** four total — `/`, `/works` (client + commissioned work), `/lab` (experiments), `/about` (About **and** Contact merged onto one route, since the nav is fixed at exactly four items). `/portfolio` and `/contact` from V1 are gone.
- **Content model:** one typed array (`lib/content/projects.ts`) holds both Works and Lab entries; a project's `section` field decides placement, not its medium. Sample catalog content (Nocturne Studio, Patchbay, Library Organizer, etc.) is shipped as concrete placeholder data per the no-lorem rule — swap-ready for the real project list.
<!-- - **Canvas engine:** one shared `requestAnimationFrame` loop (`components/canvas/signal-engine.ts`) drives every oscilloscope, the header hairline pulse, and the scroll-spooled tape transport on Home — not one loop per canvas. Under `prefers-reduced-motion: reduce`, the loop never starts; each canvas draws a single static frame instead.
- **Framer Motion + animate.css** (installed in V1, unused until now) both got real jobs: Framer Motion drives the two shared-layout slides (active nav underline, active Works filter pill) that plain CSS handles clumsily; animate.css drives the ambient phosphor "live" pulse on LED status dots — cheap, continuous CSS keyframes instead of spinning up JS or canvas for something that simple. `MotionConfig reducedMotion="user"` wraps the app so those two animations also respect the OS setting. -->
- **Known TODOs in the content:** SoundCloud URL, GitHub URL, and CV PDF link are placeholders (`href="#"`, marked `TODO:` in `lib/content/site.ts`) — Instagram and the Cafe Caderas domain link are real.

### Phase 3/4 — a real signal, a reactive interface (branch `design4`)

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

### Five fonts, a linked accent color, and a rebuilt TapeTransport

- **Font system rebuilt from zero, 3 roles → 5.** Old English is gone (see above); every font is now the "leader" of its category, chosen for broad recognition and — as important — verified present in this Next version's bundled font list before picking it, so there's no repeat of the metrics-warning problem: **Bebas Neue** (`--display`, headlines), **Inter** (`--body`, sans body copy), **Playfair Display** (`--serif`, new — pull-quotes: `.statement` on Home, `.contact .big` on About), **JetBrains Mono** (`--mach`, labels/nav/buttons), **Pacifico** (`--artistic`, new — the TapeTransport A-SIDE/B-SIDE labels, cassette-label style). All five load with `adjustFontFallback: false` uniformly rather than per-font, so compatibility doesn't depend on which families happen to have override metrics bundled. `--lcd` (numeric readouts) stays a system monospace stack, untouched — a deliberate pre-existing distinction from `--mach`. The Tweak Bar's Typography section grew two rows (Serif, Artistic) to match; old defaults (Old English, Manrope, Space Mono) are still selectable, just no longer shipped.
- **Signal, hero glow, and hover color are now one setting.** `--rust-lit` (hover/accent) used to be an independent green; it's now `color-mix(in srgb, var(--phosphor) 65%, var(--paper) 35%)` — moved into the *derived* token block in `globals.css` (alongside `--tape-3`/`--rule-soft`/`--steel-dim`) and dropped from the Tweak Bar's directly-settable `COLOR_TOKENS`, so nothing can pin it independently of the signal color again. Changing "Signal" in the Tweak Bar now visibly cascades to hover states *and* the shader hero glow in one move — verified live (Signal → blue turns `--rust-lit`, every hover state, and the shader's rendered pixel color together). The `maximalist-rack`/`cold-signal` presets were updated to set `phosphor` instead of the old `rust-lit`, so they stay coherent under the new model.
- **`components/canvas/interaction-engine.ts`** (new) — real scroll/pointer activity tracked globally (same lazy-singleton shape as `audio-engine.ts`, but no gesture gate needed — no autoplay policy for scroll/pointer events). `getInteractionEnergy()` blends into `drawScope()`'s amplitude alongside `getAudioEnergy()`, so every oscilloscope site-wide now also responds to scroll/mouse activity, not just audio (verified directly against the module's internal state — a burst of pointer movement spiked its energy value from 1 → 2.9 and decayed back on schedule).
- **`components/home/TapeTransport.tsx` → `components/home/TapeTransport/`** (`index.tsx` + `draw.ts`) — a real folder now, split into React/event wiring vs. the pure canvas-drawing routine. Rebuilt per a specific list of asks:
  - Drive switched from audio to **scroll + mouse** specifically for this component (`getMouseEnergy()` + a scroll-velocity kick) — audio stays wired into the shared oscilloscope engine above, just not here.
  - The counter is a **real elapsed-time-on-site clock** (`getSiteElapsedSeconds()`, a timestamp captured once on module load) instead of a number reverse-engineered from scroll position.
  - **Both A-SIDE and B-SIDE render simultaneously**, crossfading opacity continuously with scroll position instead of hard-swapping at the 50% mark.
  - The **reels are click-and-draggable** — `pointerdown`/`pointermove` hit-tested against each reel's circle (`hitTestReel()` in `draw.ts`), a manual rotation offset added on top of the existing auto-spin, with a short inertia decay after release so it coasts rather than stopping dead.

## Change Rule
When requirements change, update this spec **before** changing the build.
