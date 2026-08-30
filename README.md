# website-portfolio

> **Source of truth.** This document is the spec for this project. When requirements change, update this file *before* changing the build (see Change Rule at the bottom).

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
- Responsive, polished web experience
- Architecture that can grow with new projects and technologies
- Publicly accessible deployment
- Clear foundation for future subdomains / sections

**NICE TO HAVE:**
- Blog / writing
- Services site
- Interactive WebGL experiences
- Audio / music experiences
- Video / visual experiments
- AI-powered experiences
- Additional subdomains
- More advanced creative systems

**DO NOT BUILD:**
- Full SaaS product
- Complex backend infrastructure for V1
- Unnecessary AI features
- Features that don't support portfolio, experimentation, learning, or proof of concept

## 03 — Behavior

USER → SYSTEM → RESULT

[Visitor explores portfolio / projects / experiments] → [Site presents the work through appropriate content and interactive experiences] → [Visitor understands the work, capabilities, and creative/technical direction]

**IF / ELSE RULES:**
- IF [visitor selects a project] → [show the project's work, context, and proof of concept]
- ELSE IF [visitor explores the lab] → [show experimental / technical work]
- ELSE → [show the primary portfolio experience]

**EDGE CASES:**
- Projects using different technologies or media
- Work-in-progress experiments that are not yet polished
- Media variety across audio, video, visual, web, and interactive work
- Dead links or unavailable third-party services
- Future technologies that don't fit the current site architecture
- Growing numbers of projects / experiments creating navigation or organizational problems
- Experiments breaking without compromising the core portfolio experience

## 04 — Tech

**Platform:** Web

**Stack:**
- **Frontend:** Next.js + React + TypeScript
- **Backend:** TBD / if needed, Supabase
- **Database:** TBD / if needed, PostgreSQL
- **Auth:** TBD / not required for V1
- **APIs / Integrations:** TBD / added as projects require them
- **Hosting:** Vercel
- **Storage:** TBD / prefer free or low-cost options
- **AI:** None for core V1; future AI integrations TBD

**Constraints:** V1 should remain simple, scalable, inexpensive to operate, and flexible enough to support future audio, video, WebGL, creative coding, APIs, and interactive experiments.

**Architecture principle:** Keep the core minimal and stable. Introduce technologies at the experiment/project level only when they solve an actual requirement or enable a meaningful experiment.

**Technology rule:** No technology becomes part of the core stack simply because it is interesting. New technologies must earn their place. An experiment should not force the entire website to adopt its technology.

## 05 — Data + Integrations

**INPUTS:** Projects, portfolio content, creative work, experiments, media, code, and future interactive experiences.

**OUTPUTS:** Portfolio pages, project showcases, experiments, proof of concepts, creative experiences, and eventually services / content.

**DATA:** Project information, portfolio content, media metadata, experiment information, and other site content as needed.

**EXTERNAL SERVICES:** Vercel, GitHub, and future APIs / services as required by individual experiments.

**SECRETS / KEYS:** TBD based on integrations.

## 06 — Ship It

**Environments:** local / staging / production

**Deployment:** Vercel

**Required accounts:** GitHub / Vercel

## 07 — Rules of Engagement

**AI CAN:** Research, explain, architect, code, refactor, test, debug, create files, install packages, improve documentation, and experiment with technologies.

**AI MUST ASK BEFORE:** Any decision that touches design, security, or money. Examples include major design-direction changes, security-sensitive changes, deleting important work, spending money, adding significant infrastructure, or other decisions where the human needs to explicitly choose the direction.

**AI MUST NOT:**
- Make major architectural assumptions when requirements are unclear
- Over-engineer V1
- Add unnecessary dependencies, infrastructure, AI, or complexity without a reason
- Treat future possibilities as V1 requirements
- Optimize for technology instead of the actual project goal
- Force experimental technologies into the core stack without a real requirement

**Career alignment:** The long-term direction combines web development (React/Next.js), creative development (WebGL/Three.js/shaders), audio (Web Audio/Tone.js), visual (Canvas/animation/video), systems (APIs/databases/architecture), AI (APIs/agents/creative tooling), and professional engineering (TypeScript/Git/testing/deployment).

The goal is not simply "a guy who makes websites." The longer-term direction is closer to a **creative technologist / creative systems developer** — someone who builds interactive experiences across web, audio, visual, and emerging technology.

**The loop:** Website → Portfolio + Lab → Learning → Experiments → Proof → Opportunities.

**One warning:** Don't prematurely load V1 with all of this. Start simple: Next.js + React + TypeScript + CSS + Git + Vercel. Then let the site itself dictate what technology gets learned next. The stack is a foundation — not the destination.

## 08 — Build Plan

- **PHASE 1:** Build the V1 foundation — establish the core portfolio experience, site structure, styling, content architecture, Git/GitHub workflow, and deployment.
- **PHASE 2:** Build the experimental layer — establish the lab, projects, proof of concepts, and structure for adding new technologies without rebuilding the site.
- **PHASE 3:** Expand the creative systems — WebGL, audio, video, AI, APIs, advanced interactions, and future subdomains/services as justified.

---

## Open / Not Yet Decided

- Content / CMS strategy
- Database requirements
- Storage requirements
- Analytics
- Monitoring / logging
- Backup / recovery
- CI/CD
- Future subdomain architecture
- Exact WebGL / audio / video technologies

All of the above get added when actually needed, per the technology rule above.

## Decisions Log

Concrete choices made while scaffolding V1 (this section grows over time — see Change Rule):

- **Cloned from** `~/Documents/LocalProjects/artist-website` — reused its App Router / TypeScript / Tailwind v4 foundation and the existing `AnimateIn`, `Navbar`, and CSS-token theming patterns rather than starting from scratch.
- **V1 sections:** Home, Portfolio (index + `[slug]` project detail), Lab (index), About, Contact.
- **Content status:** Home/About/Contact/Lab currently use lorem-ipsum placeholder copy. Real copy and visual identity are deferred to a dedicated design Q&A. The original Cafe Caderas DJ landing page content (copy + links) was preserved, not deleted — it now lives as a real project entry at `/portfolio/cafe-caderas`.
- **Animation:** Framer Motion and animate.css are installed in addition to the existing zero-dependency `AnimateIn` scroll-reveal component. Framer Motion isn't wired into any component yet — installed and ready for the design phase.
- **Stack versions (pinned for stability):** Next.js 16.3.3, React/React DOM 19.2.8, Tailwind CSS 4.3.3. TypeScript is pinned to **6.0.3** rather than the newest 7.x line, because `typescript-eslint` (pulled in by `eslint-config-next`) only supports `typescript >=4.8.4 <6.1.0` as of this writing — TS 7 would break linting. ESLint is pinned to **9.39.5** rather than the newest 10.x line for the same reason: `eslint-plugin-react` (also pulled in by `eslint-config-next`) only supports `eslint <=9.7`.
- **GitHub:** repo created at `github.com/cafecaderas/website-portfolio` (public), initial V1 scaffold pushed to `main`.

### V2 — Cafe Caderas design system (branch `design1`)

Full visual/structural rebuild against a locked brand system and a working reference mockup, replacing the V1 lorem-ipsum scaffold entirely. This is a snapshot of what's built, not a claim that the visual direction is permanent — the brand system stays open to iteration; the lab is the point.

- **Routes:** four total — `/`, `/works` (client + commissioned work), `/lab` (experiments), `/about` (About **and** Contact merged onto one route, since the nav is fixed at exactly four items). `/portfolio` and `/contact` from V1 are gone.
- **Content model:** one typed array (`lib/content/projects.ts`) holds both Works and Lab entries; a project's `section` field decides placement, not its medium. Sample catalog content (Nocturne Studio, Patchbay, Library Organizer, etc.) is shipped as concrete placeholder data per the no-lorem rule — swap-ready for the real project list.
- **Canvas engine:** one shared `requestAnimationFrame` loop (`components/canvas/signal-engine.ts`) drives every oscilloscope, the header hairline pulse, and the scroll-spooled tape transport on Home — not one loop per canvas. Under `prefers-reduced-motion: reduce`, the loop never starts; each canvas draws a single static frame instead.
- **Framer Motion + animate.css** (installed in V1, unused until now) both got real jobs: Framer Motion drives the two shared-layout slides (active nav underline, active Works filter pill) that plain CSS handles clumsily; animate.css drives the ambient phosphor "live" pulse on LED status dots — cheap, continuous CSS keyframes instead of spinning up JS or canvas for something that simple. `MotionConfig reducedMotion="user"` wraps the app so those two animations also respect the OS setting.
- **Fonts:** Archivo Black / Inter / Special Elite via `next/font/google` (self-hosted) rather than the spec's `<link>` tags — same visual result, avoids FOUC, matches how fonts were already wired here.
- **Known TODOs in the content:** SoundCloud URL, GitHub URL, and CV PDF link are placeholders (`href="#"`, marked `TODO:` in `lib/content/site.ts`) — Instagram and the Cafe Caderas domain link are real.

## Change Rule

When requirements change, update this spec **before** changing the build.
