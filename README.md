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

**DATA:** Project information, portfolio content, media metadata, experiment information, and other site content as needed. Media assets split by weight: lightweight files stay committed in `/public`; large files (full-res photos, video, 3D exports, audio) are intended for an external asset host once one is chosen (not yet — see below). See **Content Model** below for the current target shape of a `Project`.

**EXTERNAL SERVICES:** Vercel, GitHub, and future APIs / services as required by individual experiments. Two are anticipated but not yet integrated, per the Rules of Engagement's "ask before significant infrastructure": a **hosted headless CMS** (Sanity/Payload family) as the eventual editing surface once there's enough real content to justify one, and an **external asset host** for large media once one is picked. Until then, content stays hand-authored TypeScript in `lib/content/` — the model below is shaped so that swap only ever changes the data-access functions in `lib/content/`, never a component.

### Content Model

**Status: implemented** (`lib/content/types.ts`, `lib/content/projects.ts`). This superseded the earlier flat `WorkProject | LabProject` shape (fixed `media`/`links`/`caseStudy` fields directly on the project — see the design5 entries below for that shape's own history) — see the **content model redesign** Decisions Log entry below for exactly what changed on migration and why.

**The core idea:** every project splits into a small, stable `core` (identity + what's needed to render it in a list/card view) and an open-ended `body` (a flexible sequence of typed content blocks, only needed on the full detail page). New media type = a new block type in `body`, never a new nullable field bolted onto every project regardless of whether it applies.

```ts
type ProjectSection = "works" | "lab";
/** The client-facing service classification — "the main buttons." Singular, like a nav tab. */
type MainCategory = "web" | "apps" | "branding" | "marketing";
/** Granular craft/technique tags — plural on purpose. Same vocabulary for works and lab. */
type SubTag = "code" | "editing" | "audio" | "video" | "animation" | "design" | "3d" | "ux-ui" | "crm" | "cms" | "api" | "ai" | "photo";

interface CoverImage {
  src: string;
  alt: string;
}

interface ProjectCore {
  slug: string;
  title: string;
  /** "2026", "2026-01", or "2026-01-15" — as much precision as actually exists. */
  date: string;
  section: ProjectSection;
  /** Unset while a project is still lab-only; filled in once it's ready to show as works. */
  category?: MainCategory;
  /** How a lab project is described before it has a category at all. */
  tags?: SubTag[];
  /** One or two lines — card/list preview text. */
  description: string;
  /** The ONE canonical "go here to experience this" URL. Anything else is a body `link` block. */
  link?: string;
  /** Card/thumbnail image. Optional — a missing cover renders as no cover, never a fake one. */
  cover?: CoverImage;
  /** Short at-a-glance readout — a tech tag ("NEXT.JS"), a version, a duration. Not the year: `date` already carries that. */
  meta?: string;
  /** A free-text state word ("LIVE", "ARCHIVE", "WEIRD") — flavor, not a workflow enum. */
  status?: string;
  /** Drives the phosphor LED dot. Independent of `status` on purpose: a project can read ARCHIVE and still have a live demo up. */
  live?: boolean;
}

type ContentBlock =
  | { type: "text"; text: string }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "video"; src: string; poster?: string; caption?: string }
  | { type: "audio"; src: string; caption?: string }
  | { type: "embed"; provider: "soundcloud"; url: string; caption?: string }
  | { type: "link"; label: string; url: string };

interface Project {
  core: ProjectCore;
  body: ContentBlock[];
}
```

Note there's no `WorkProject`/`LabProject` split anymore — a single flat `Project` covers both sections. The old union existed only because `media` was required on works and optional on lab; once media moved into the uniform `body: ContentBlock[]`, there was no structural difference left between the two sections to justify a union at the type level.

**`section`, `category`, and `tags` are three separate dimensions, not one field.** `section` is site IA (which index page: `works` or `lab`) — it's also the only one of the three with a real lifecycle: a project is expected to start `lab` and, at some point, just have its `section` flipped to `works` once it's ready to show as finished work. Nothing else has to change for that to happen, which is the entire point of `category`/`tags` sharing one vocabulary across both sections — a project's tags describe what it *is*, regardless of where it currently lives. `category` (`web`/`apps`/`branding`/`marketing`) is the client-facing classification, usually only meaningful once a project has graduated — most lab entries leave it unset. `tags` is how almost everything is actually described day to day, lab or works: a paid audio mix for a client might be `section: "works"`, `category: "marketing"`, `tags: ["audio", "editing"]`; a personal web toy might be `section: "lab"`, no category yet, `tags: ["code", "ux-ui"]`.

**The core-vs-body test** (reusable for any future field, not just the ones listed above): a field belongs in `core` iff a list/card view needs it *without* loading the rest of the project — the works index, the lab grid, a sitemap, an OG tag. Everything only relevant on the full detail page belongs in `body`. `link` is the one non-obvious case: a row doesn't render the raw URL, but it does render *based on whether one exists* (a live-indicator dot), so its presence is list-relevant even though its value is detail-page-only — that's why it stays a single optional core field rather than moving to body.

**`meta`, `status`, and `live` earned their way into core during implementation** — they weren't in the original 7-field draft, and got added only after running the abstract design against the real, already-working list views: `WorkRows` and `LabModuleGrid` both render a short readout and (for lab) a status word on every row, and `WorkRows` renders a live-indicator dot — all three pass the core-vs-body test above. They're worth naming honestly as a deliberate expansion rather than pretending the 7-field draft survived contact with the real UI unchanged. `live` and `status` do currently agree on every real entry (a "LIVE"/"RUNNING" status always pairs with `live: true`) — that's authoring habit, not an enforced rule; the two stay separate fields because a project could reasonably read `status: "ARCHIVE"` while still keeping an old demo live.

**`index` ("W01", "LAB 04") is computed, not stored.** `getWorkProjects()`/`getLabProjects()` (`lib/content/projects.ts`) return `IndexedProject` — `Project` plus an `index` computed from array position at read time. Nothing in content data tracks it, so adding, removing, or reordering a project never requires renumbering anything by hand, and `npm run new:lab` no longer needs to compute one either.

**WHO and WHY get no dedicated fields on purpose.** WHY is what the first `text` block in `body` is for. WHO (personal / collaboration / client) is prose too, unless it's attribution you actually want to *query* — that's what `Testimonial` is for, kept as its own separate content type (global or attached to a project via `projectSlug`), because a testimonial is a different entity (a client relationship), not a project attribute.

**Six content-block types, not five.** `text` / `image` / `video` / `audio` / `embed` cover every example this model was stress-tested against (web, ecommerce, brand/design, a DJ mix, an interactive experiment, a photo set). `link` is the deliberate sixth: a Patreon/Dropbox/arbitrary share URL isn't something you embed inline (no iframe, no player) — it's an outbound button, a different rendering behavior from `embed`, and it replaces the old `ProjectLinks.more[]` core field with body content instead. `embed.provider` is typed as the literal `"soundcloud"` rather than an open string or a wider union — YouTube/Vimeo weren't asked for; widening it later is a one-line change. `gallery` (grid layout for many images) and `heading` (subsections in long case studies) are the obvious next two block types — intentionally not built until a real project's body actually needs one.

**Why this migrates cleanly:** `core` maps directly to frontmatter (MDX) or top-level document fields (any CMS). `body` as a literal JSON/TS array of typed blocks is not just "similar in spirit" to Sanity's Portable Text or Payload's Blocks field — they're the same shape, an array of typed, discriminated content blocks. A future CMS migration is "map this union to Portable Text block types," not "redesign the content model to fit the CMS's opinions."

**Known future pain, deliberately not solved yet:** multi-discipline tagging (`discipline` → `disciplines: Discipline[]`) if one project genuinely needs two; promoting a secondary link (e.g. `repo`) back into `core` if it ever needs to render at list level, not just on the detail page; a real asset pipeline (dimensions, CDN) once `/public` + bare URL strings stop being enough — same deferred external-asset-host decision as above; slug permanence once project pages are actually shared publicly (not yet). Sorting by `date` instead of relying on manual array order is still a live option, not done: today's array order is a deliberate curation, not a byproduct of authoring order (LAB's order in particular doesn't already match date order), so auto-sorting would visibly reshuffle the grid — do it if manual ordering ever actually gets tedious, not by default.

<!-- **SECRETS / KEYS:** TBD based on integrations. -->

### SEO

**Status: partially implemented.** See the **design6 — the SEO layer** Decisions Log entry below for what changed and why.

- **Done:** distinct `<title>`/`<meta description>` per top-level route (Home/WORKS/LAB/ABOUT) via a title template on the root layout (`app/layout.tsx`) plus a `metadata` export on each section page; `metadataBase` set from `siteConfig.url`; `/sitemap.xml` (`app/sitemap.ts`) listing every real static route and every non-`test-*` project URL; `/robots.txt` (`app/robots.ts`) allowing everything except `/dev/`, pointing at the sitemap.
- **Not yet — paused, on request:** per-project dynamic `<title>`/`<meta description>` (a `generateMetadata` in `app/works/[slug]/page.tsx` / `app/lab/[slug]/page.tsx` deriving from each project's own `core.title`/`core.description`). Until this lands, every individual project detail page still serves the same site-wide title/description as everything else.
- **Not yet — pending a decision:** JSON-LD structured data (`Article`/`CreativeWork` schema per project) for rich-result eligibility. No OG/social preview image yet either (`metadataBase` is set so one can be added as a relative path later without extra config).
- **Not yet — blocked on real deployment:** `siteConfig.url` (`https://www.cafecaderas.com`) is used as the canonical domain throughout, matching the existing `social.website.href` — this hasn't been verified against an actual live deployment of this codebase, so treat the sitemap/robots output as correct in shape, not yet confirmed in production.

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

#### design5 (cont.) — a real content schema: links, media, testimonials

Everything up to this point was still swap-ready *placeholder* content — real fields didn't exist for a live project URL, a photo, an audio embed, or a client quote. This pass closes that gap ahead of actually sharing real work, without picking a CMS yet.

- **`Project` split into a discriminated union** (`WorkProject | LabProject` on `section`) in `lib/content/types.ts`, rather than one shape with everything optional. `media` is a real *non-empty*-array requirement on `WorkProject` (`[MediaItem, ...MediaItem[]]` — a tuple type gets true non-empty-array enforcement from the compiler, at zero runtime cost) because that was the actual gap: works had no per-project imagery at all, only a stock photo per *category*. `LabProject` keeps `media`, `caseStudy`, and `links` all optional — lab entries should never need more than a title and a one-line summary to exist, matching how low-friction adding one already was.
- **`caseStudy` deliberately stays optional on works, not promoted to required.** `WorkRows.tsx` already uses its presence to decide "this row links to a detail page" vs. "this row is static" — only one of six current projects has one, on purpose. Requiring it here would have meant writing five case studies as a schema task, not fixing a real gap.
- **New `MediaItem` union** (`image | video | audio | embed`) and `ProjectLinks` (`live` / `preview` / `repo` — `preview` is where a Vercel preview-deployment URL goes; kept distinct from the pre-existing `live: boolean`, which only ever drove the phosphor LED status dot). A SoundCloud track or playlist is an `embed` item with `provider: "soundcloud"` — the same `<iframe>` pattern renders a public share URL or an unlisted/"secret" one identically, so there's no separate private-content field.
- **New `Testimonial` type**, its own `lib/content/testimonials.ts`, ships empty (`[]`) until real quotes exist. `projectSlug` is optional on purpose: unset shows in a sitewide strip, set makes it also retrievable per-project — one array, one optional foreign key, no join table.
- **Data-access functions, not a fetch client.** `getWorkProjects()` / `getLabProjects()` / `getTestimonials()` etc. follow the exact shape `getProjectBySlug` already used (a plain `.find()`/`.filter()` over the in-memory array) rather than introducing async signatures or a repository abstraction now. The entire point: the day a hosted CMS is actually wired up, only these function *bodies* change (array literal → an awaited fetch) — no component touches a CMS SDK directly. One known exception flagged for that day, not fixed now: `components/gallery/Gallery.tsx` is a Client Component that reads project data at module scope, which breaks once that read becomes `async` — the fix then is resolving it server-side and passing it down as props, same as `WorksPageClient` already does.
- **Three hardcoded per-category/per-slug image special-cases removed** — `WorkRows.tsx`'s `CATEGORY_THUMB` map, `FeaturedCaseStudy.tsx`'s inline Unsplash URL, and `LabModuleGrid.tsx`'s literal `if (project.slug === "room-tone")` — replaced by one generic `MediaRenderer` reading `project.media`. Adding a project's real photo is now a data edit, not a component edit.
- **`npm run new:lab`** (`scripts/new-lab.mjs`, plain Node, no new dependency) scaffolds a new Lab entry from a short prompt (title, summary, category, status, meta, live?, level) and derives the rest (slug, index, year) — the concrete answer to keeping Lab additions "fluid, not tiresome" as the schema grew a few more optional fields.
- **`ProjectLinks` grew a `more: ExternalLink[]` catch-all** (`{ label, url }`) alongside the named `live`/`preview`/`repo` slots — for anything that doesn't fit those three (Patreon, Dropbox, a YouTube video, a plain share link). Rendered as plain `.btn` buttons using the link's own label, uppercased to match the existing CTA convention — no per-platform icon set, which would fight the "one lit element" accent rule anyway.
- **Explicitly not built this pass:** the hosted CMS integration and the external asset host — both noted in §05 above as pending an explicit "significant infrastructure" decision once there's real content to justify them.

#### design5 (cont.) — content model redesign: CORE + BODY

The flat schema two entries above already showed the shape of the problem it was heading toward: `WorkProject` had grown `media`, `caseStudy`, and `links` as fixed top-level fields, and every genuinely new medium (a DJ mix's tracklist, an ecommerce project's platform, a photo set's print run) would have meant one more optional field on every project regardless of whether it applied — the classic nullable-field sprawl. The model got redesigned first as a standalone design pass, then implemented in this same entry: a small stable `core` (identity + whatever a list/card view needs) plus an open-ended `body` array of typed content blocks (`text`/`image`/`video`/`audio`/`embed`/`link`) for everything else. New medium = new block type in one project's `body`, never a new field on every project. Full shape and reasoning live in **§05 → Content Model** above — that section is the authority; this entry covers what the migration itself actually touched.

- **`WorkProject | LabProject` collapsed into one flat `Project`.** The union only ever existed because `media` was required on works and optional on lab; with `media` gone (absorbed into the uniform `body`), there was no remaining structural difference between the two sections, so the union was dead weight. `core.section` is now a plain field, not a discriminant.
- **`meta`/`status`/`live` were added to `core` beyond the original 7-field draft** — not a scope violation, a correction. The abstract design didn't account for the fact that `WorkRows` and `LabModuleGrid` already render a readout, a status word, and a live-indicator dot on every row; all three pass the core-vs-body test the design itself defines, so removing them would have been a real, unrequested feature regression, not a cleanup. `index` went the opposite direction — it turned out to be fully derivable from array position, so it was dropped from stored data entirely and is now computed in `getWorkProjects()`/`getLabProjects()` (see `IndexedProject` in `lib/content/projects.ts`).
- **`category` → `discipline`, remapped, not just renamed.** The old 9-value `ProjectCategory` (`websites`/`experiences`/`direction`/`visual`/`code`/`dj`/`photo`/`audio`/`proto`) collapsed into the new 6-value `Discipline` set: `experiences` and `websites` both became `web` (both are fundamentally web-technology projects — keeping them separate categories was distinguishing by client-relationship, not medium); `direction` became `design`; `visual` on the one project that was actually photography (`rooms-we-left`) became `photo` instead. `workFilters` (`lib/content/works.ts`) and the works-index filter chips shrank from four categories to three (`WEB`/`DESIGN`/`PHOTO`) as a direct consequence — a real, visible UI simplification, not just a data rename.
- **`lib/content/lab.ts`'s `labCategoryLabel` map was deleted, not migrated.** Every one of its five entries was already identical to `.toUpperCase()` of its own key (`code → "CODE"`, `dj → "DJ"`, etc.) — a lookup table doing nothing a template string didn't already do. `LabModuleGrid` now calls `core.discipline.toUpperCase()` directly.
- **The LAB meter fill (`level`, 0–1) was dropped from content data.** It was never real progress data — nothing was tracking "70% done" for a DJ mix — it was ambient decoration on one specific widget. `LabModuleGrid` now derives it from a deterministic hash of the project's own `slug`, so every new lab entry still gets a personality-driven meter with nothing to fill in and nothing to keep in sync.
- **`components/media/` was replaced by `components/content/`.** `MediaRenderer` (switched on `MediaItem.kind`) became `BlockRenderer` (switches on `ContentBlock.type`, now also handling `text` and `link`, not just media). `ProjectLinksRow` was retired entirely: the three-slot live/preview/repo/more row it rendered doesn't exist anymore — `core.link` is now a single inline "VISIT LIVE" button on the detail page, and anything else (Patreon, Dropbox, a repo link) is a `link`-type block placed wherever it belongs in `body`.
- **Fixed in passing:** `halo-festival` and `room-tone` had accidentally been given the exact same Unsplash photo ID in the previous entry's data-population pass (a copy artifact). `room-tone` now points at a distinct, verified-live image.
- **A real UX question, decided, then revisited:** with `caseStudy` gone, what decides whether a works row links to a detail page? First pass: `body.length > 0` — a project with actual body content gets a live row, one without renders static. **Superseded in the next entry** — every project became clickable, this conditional no longer exists.

#### design5 (cont.) — every project is an entry point, LAB gets the same treatment as WORKS

The `body.length > 0` rule above meant most projects — anything without written body content yet — rendered as inert, unclickable rows, and LAB had no detail page at all. That's backwards: the whole point of splitting `core`/`body` was that a project with an empty `body` is still a complete, real project, not a lesser one. If visitors can look into Nocturne Studio's data, they should be able to look into every project's data, finished or not.

- **`WorkRows` and `LabModuleGrid` now always link out**, unconditionally — every row/module is `<Link href="/works/{slug}">` or `<Link href="/lab/{slug}">`. The old `body.length > 0` branch and the now-dead `.row--static` CSS (cursor/hover overrides for a state that no longer exists) are both gone.
- **`app/lab/[slug]/page.tsx` is new** — LAB projects had no detail route before this. It and `app/works/[slug]/page.tsx` are now both thin wrappers (fetch the section's own collection, `.find()` the slug, `notFound()` otherwise) around one shared `components/projects/ProjectDetail.tsx`, parameterized only by `sectionLabel`/`basePath` ("WORKS"/`/works` vs "LAB"/`/lab`). This is the literal implementation of "the pages operate the same, one is just finished and one is in-progress" — the difference lives entirely in the data (`status`, whether `body` has anything in it yet), never in a second template.
- **`.work-media` → `.project-media`.** The CSS class sizing a detail page's cover/body images was still named for the section it was written under before LAB shared the same layout — renamed since it's honest now, not because the rule changed.
- **A matching loading state was needed, not assumed to be free.** `app/lab/loading.tsx` (the LAB index skeleton) would otherwise have been inherited by `/lab/[slug]` on client-side navigation — wrong shape entirely (an index grid skeleton showing while a single project loads). Added `components/projects/ProjectDetailLoading.tsx`, shared by new `loading.tsx` files in both `[slug]` route folders, so neither detail route silently inherits its parent index's skeleton.

#### design5 (cont.) — a detail page is never a dead end

Making every project clickable (previous entry) exposed the next problem immediately: landing on a project's detail page left you with exactly one way out — the browser's back button, or the four links in the header. No way to jump sideways to another project, no sense of where you were in the collection.

- **A back link, a sidebar panel, and a wrapping prev/next pager — all three, not a modal.** `ProjectDetail` now takes the section's full `collection` (not just the one `project`) and renders: a `← WORKS INDEX` / `← LAB INDEX` link back to the index; new `components/projects/ProjectSidebar.tsx`, a sticky panel listing every sibling project with the current one marked via `aria-current="page"` (styled through `--phosphor`, reusing the existing `.linkline` row style from `ContactBlock` rather than inventing a new one); and a prev/next bar at the bottom of the content that **wraps** — the last project's "next" is the first, so the collection has no actual end to hit.
- **Overlay/modal was considered and deliberately not built.** Turning a project click into a modal or drawer would have "solved" dead-ends too, but at the cost of the thing this whole schema pass was for: every project needs its own real, shareable URL. A modal can't be linked to directly the same way. Real pages plus in-page navigation (the three items above) solve "never stuck" without giving that up.
- **`app/works/[slug]/page.tsx` and `app/lab/[slug]/page.tsx` now fetch their whole section's collection** (`getWorkProjects()` / `getLabProjects()`) and `.find()` the slug locally, instead of calling the section-agnostic `getProjectBySlug()` plus a manual section check. Scoping to the right list up front does the guarding for free (a lab slug simply isn't in the works collection) and hands `ProjectDetail` the sibling list it needs for the sidebar/pager in the same call — `getProjectBySlug()` still exists for the one place that genuinely doesn't care which section (`FeaturedCaseStudy`'s pick-a-slug lookup).
- **LAB's index page got the same filter chips WORKS already had.** New `labFilters` (`lib/content/lab.ts`: `CODE`/`AUDIO`/`PHOTO`/`VISUAL`, the disciplines actually present) and new `components/lab/LabPageClient.tsx`, mirroring `WorksPageClient`'s exact pattern (`useState` filter, `LabModuleGrid` gained the same `isHidden` prop `WorkRows` already had). `app/lab/page.tsx` is back to a thin server component: fetch data, hand it to the client component.

#### design5 (cont.) — the WORKS index becomes a data table, not a portfolio row list

Explicit direction this pass: push WORKS and LAB further toward "computer, tech, terminal," and make the design choices actually surface the project data rather than decorate around it.

- **New `components/works/WorksTable.tsx`** replaces `WorkRows` on the `/works` route specifically (Home's "Selected Work" teaser and the dev gallery keep `WorkRows` — deliberately not touched; the ask was about the WORKS/LAB pages, not the homepage teaser). Each row is now a five-column record — `STACK │ PROJECT │ TYPE │ YEAR │ STATUS` — with a real column-header row above them, read closer to a directory listing than a slideshow. Cover photos were dropped from this view entirely (they still live on the detail page): a terminal doesn't show photos, and splitting "list = data, detail = media" gives each view an actual job.
- **The leading identifier per row is now `core.meta` (the stack), not the sequential index.** `W01`…`W06` don't appear in this view at all anymore — `[NEXT.JS]`, `[TYPESCRIPT]`, `[BRAND]`, `[SHOPIFY]`, `[35MM]`, `[WEBGL]` do, one per project, in the same order. `index` isn't gone from the app — the sidebar panel and the detail page's eyebrow (`WORKS — W01 · LIVE`) still use it for strict ordering — it's specifically the works-index row that no longer leads with it, because the stack is the more interesting fact about a *finished* project.
- **`components/works/WorksPageClient.tsx`: CASE STUDY 01 moved below the table**, not above it — the full index is the first thing a visitor sees now, the single hand-picked highlight comes after, as a "read more" rather than the page's cold open.
- **A monochrome "terminal window" framing, no new colors.** New `.tablebox`/`.tablebox-tag` (a bordered box with a `~/works` / `~/lab` label breaking the top border, like a fieldset legend) and a `.cursor` element with a genuinely new keyframe (`terminal-blink`, a hard on/off step animation, not the smooth pulse `animate.css` already provides) for a blinking `_`. Both are typographic/motion-only — no new color was introduced, keeping `--phosphor` the single accent, per the locked system's "one lit element" rule. LAB's grid sits inside the same `.tablebox` frame now (`~/lab_`), and its module footer meta is bracketed (`[v0.7.2]`) to match the WORKS table's tag styling — the two pages now visibly read as one system with two different collections, not two different designs.
- **Fixed in passing:** `.row:hover::before`'s glow was hardcoded to `rgba(57, 255, 106, 0.6)` — a literal green, left over from V2's old fixed palette, silently wrong ever since `--phosphor` became a tweakable, red-by-default token. Changed to `var(--phosphor)` so the hover glow actually follows the signal color like every other glow in the system already does.

#### design5 (cont.) — `category` + `tags` retire `discipline`, and give WORKS/LAB a real shared vocabulary

The stated goal this pass: projects should be able to start in LAB and progress to WORKS, which means the two sections need to share an actual classification system, not just a page template. `discipline` (a single `web`/`audio`/`visual`/`design`/`photo`/`code` value) never solved this — it was one field trying to answer two different questions ("what client service is this" vs. "what craft went into it"), and it didn't have a lifecycle story at all.

- **`discipline` is gone, replaced by two fields that answer two different questions.** `category?: MainCategory` (`web`/`apps`/`branding`/`marketing`) is the client-facing classification — singular, like a nav tab, confirmed deliberately over letting a project span more than one. `tags?: SubTag[]` (`code`/`editing`/`audio`/`video`/`animation`/`design`/`3d`/`ux-ui`/`crm`/`cms`/`api`/`ai`/`photo`) is the granular, multi-valued craft description. Both are optional on every project regardless of `section` — this is what makes "lab progresses to works" free: a project's tags don't change when it graduates, only `section` does (confirmed: no `promotedFrom` field, no extra tracking — flipping `section` is the whole mechanism, same as every other edit).
- **`photo` was missing from both lists and got added as a 13th tag** — Rooms We Left and Room Tone are straightforwardly photography and didn't fit `editing` or any of the four categories. Confirmed: photography work, when it has a category at all, files under `branding` (both photo works entries now read `category: "branding"`).
- **LAB entries carry `tags` only, no `category`** — matches "lab is where things live before they're client-ready." `library-organizer` → `["code", "audio", "ai"]`, `after-hours` → `["audio", "editing"]`, `cassette-os` → `["code", "audio"]`, `room-tone` → `["photo", "audio"]`, `scope-type` → `["design", "code", "audio"]`, `this-site` → `["code", "design", "ux-ui"]`.
- **All four categories are represented among the six WORKS entries** (a good sign the taxonomy actually fits the real catalog, not just the brief): `nocturne-studio`/`ferria-coffee` → `web`; `patchbay` → `apps`; `side-b-records`/`rooms-we-left` → `branding`; `halo-festival` → `marketing`. `workFilters` (`lib/content/works.ts`) now reads the four categories directly instead of a discipline subset.
- **`labFilters` now checks array membership, not equality** — LAB's filter chips (`CODE`/`AUDIO`/`AI`/`EDITING`/`PHOTO`/`DESIGN`/`UX | UI`, the tags actually present) use `tags?.includes(active)` since a project can match more than one, unlike the old single-value `discipline === active`. WORKS' filter stays equality-based (`category === active`), matching `category` staying singular.
- **Tags are surfaced everywhere the data is meant to be visible, not just in filters:** `WorksTable`'s row grew a `#code #design`-style tagline under the description; `LabModuleGrid`'s module-header badge now shows the first tag (`formatTag(tags[0])`) instead of a single discipline word, plus a full `#tag #tag` line lower in the card; `ProjectDetail`'s chip row now includes `category` and every tag alongside `meta`.
- **New `formatTag()` (`lib/content/types.ts`)** — a small display-label lookup (currently just `ux-ui → "UX | UI"`) for tags shown as a standalone chip/badge. Hashtag-style lists (`#ux-ui`) deliberately skip it and use the raw slug instead — real hashtags don't have spaces either, so the two contexts want different formatting on purpose, not inconsistently.
- **`npm run new:lab` now prompts for comma-separated tags** instead of a single discipline, validating each against the known list and requiring at least one valid tag — unknown entries are reported and dropped rather than silently accepted or rejected outright.
- **A naming collision fixed in passing:** `featuredCaseStudyContent.tags` (a handful of static display chips for the one hand-picked homepage feature, e.g. `"WEBSITE"`, `"NEXT.JS"`) was renamed to `labels` — it predates this pass and had nothing to do with a `Project`'s own `tags`, but the shared name would have read as related. Different concept, now a different name.

#### design6 — the SEO layer: distinct titles, sitemap.xml, robots.txt

Auditing the site found every single page — Home, WORKS, LAB, ABOUT, and every individual project detail page — served the exact same `<title>`/`<meta description>` pair, because `app/layout.tsx` set them once, site-wide, and nothing overrode them per route. There was also no `sitemap.xml`, no `robots.txt`, and no structured data anywhere.

- **`siteConfig.url`** (`lib/content/site.ts`) is new — a single canonical-domain constant (`https://www.cafecaderas.com`, matching the pre-existing `social.website.href`) reused by `metadataBase`, `sitemap.ts`, and `robots.ts` rather than the domain string being hardcoded three times.
- **A title template, not four hardcoded titles.** `app/layout.tsx`'s `metadata.title` is now `{ default: siteConfig.title, template: "%s — CAFE CADERAS" }` plus `metadataBase: new URL(siteConfig.url)`. Each section page (`app/works/page.tsx`, `app/lab/page.tsx`, `app/about/page.tsx`) exports its own `metadata` with just a short `title` (`"WORKS"`, `"LAB"`, `"ABOUT + CONTACT"`) and a `description` pulled from that page's own existing content object (`worksPageContent.lede`, `labPageContent.lede`, `aboutPageContent.lede`) — Next composes the final `<title>` via the template, so there's no duplicated brand suffix to keep in sync by hand. Home has no `metadata` export of its own and inherits the layout's `default` — that default already *is* the brand identity string, so overriding it would just repeat it.
- **Per-project dynamic metadata was scoped out and explicitly deferred, on request.** Every individual project detail page (`/works/[slug]`, `/lab/[slug]`) still serves the same title/description as its section index — `generateMetadata` deriving from each project's own `core.title`/`core.description` is a known next step, not forgotten.
- **`app/sitemap.ts` / `app/robots.ts`** use Next's App Router file convention (a default-exported function, auto-served at `/sitemap.xml` / `/robots.txt` — no manual XML/text file to keep in sync). The sitemap lists the four static routes plus every real WORKS/LAB project URL, generated from `getWorkProjects()`/`getLabProjects()` — **`test-*` slugs are filtered out** (the scratch entries added earlier this session to preview each `ContentBlock` type; not real content, not meant to be indexed). `robots.ts` allows everything except `/dev/` (the component-gallery route, already gated behind a real `notFound()` outside development) and points at the sitemap.
- **JSON-LD (`Article`/`CreativeWork` schema per project) was discussed and intentionally not built yet** — pending a decision on whether it's worth the added per-project maintenance surface before real content replaces the placeholder catalog. See **SEO** under §05 above for the current done/pending breakdown.

## Change Rule
When requirements change, update this spec **before** changing the build.
