# website-portfolio

**Cafe Caderas** — a personal website and public creative/technical laboratory: portfolio, experiments, and proof of concept across web, audio, video, WebGL, and creative systems.

> **Source of truth: the documentation set, not this file.** Each document owns its domain — see [Documentation](#documentation) below. This README is the front door: what the project is, how to run it, and where to look next.

**Current version: V3 — "Live Signal."** The locked brand system made real: synthesized audio, WebGL, generative signal color, and a scroll/mouse-reactive engine in place of decorative math. See [docs/decisions.md](docs/decisions.md) for what V1/V2/V3 each mean concretely.

## Overview

A static portfolio doesn't demonstrate the process, experimentation, or range of skills being developed. This site is instead a living space where skills get applied publicly and turned into tangible proof of capability — client work in **WORKS**, unfinished experiments in **LAB**, and a shared content model that lets a project graduate from one to the other by flipping a single field.

Full scope, requirements, and roadmap: [docs/project-spec.md](docs/project-spec.md).

## Features

- Portfolio / project showcase with per-project detail pages
- Experimental "lab" space for proofs of concept, sharing one schema with works
- Creative work spanning multiple mediums (web, audio, video, photo, 3D)
- Real-time WebGL hero (Three.js) driven by live audio + interaction, not a canned loop
- Hand-rolled 2D canvas engine on one shared animation loop for every oscilloscope and meter
- A locked, tokenized design system with a dev-only live tweaking panel
- Responsive, reduced-motion-aware, and SEO-equipped (sitemap, robots, per-section metadata)

## Tech Stack

- **Frontend:** Next.js + React + TypeScript
- **Styling:** CSS custom properties + Tailwind v4 (`@theme inline` token mapping)
- **3D / WebGL:** Three.js + React Three Fiber + postprocessing (contained to the Hero)
- **Animation:** Framer Motion, animate.css, and hand-rolled canvas engines
- **Backend / Database:** Supabase + PostgreSQL *(provisioned, not yet integrated)*
- **Hosting:** Vercel

## Getting Started

```bash
git clone https://github.com/cafecaderas/website-portfolio.git
cd website-portfolio
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000). No environment variables are required — all content is hand-authored TypeScript in `lib/content/`.

## Available Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (warnings don't fail; errors do) |
| `npm run new:lab` | Scaffold a new LAB entry from a short prompt |

Type checking is `npx tsc --noEmit`. CI runs all three of type check, lint, and build.

## Project Structure

```text
app/          Next.js App Router — routes, layout, sitemap.ts, robots.ts
components/   UI, grouped by domain (canvas/ three/ works/ lab/ decor/ chrome/ …)
lib/          Content data + data-access functions (lib/content/), integrations
public/       Lightweight static assets
scripts/      Node tooling (new-lab.mjs)
docs/         Project documentation
```

**Routes:** `/` (home), `/works`, `/lab`, `/about` — plus `/works/[slug]` and `/lab/[slug]` detail pages, and a dev-only `/dev/gallery` that 404s in production.

## Development Workflow

`main` is protected — no direct pushes. All work happens on a branch (`design#` for design passes) and lands via PR, with CI (type check + lint + build) required green before merge.

Sessions wrap up with the `/end-of-session` routine: commit in logical groups → push → PR → CI → merge → cut the next branch. Details in [docs/development-workflow.md](docs/development-workflow.md).

## Documentation

| Document | Owns |
|---|---|
| [docs/project-spec.md](docs/project-spec.md) | What we're building — scope, behavior, requirements, roadmap |
| [docs/architecture.md](docs/architecture.md) | How the system works today — engines, WebGL, design tokens, SEO |
| [docs/content-model.md](docs/content-model.md) | The `Project` / `ContentBlock` schema and its rationale |
| [docs/decisions.md](docs/decisions.md) | Why it's built this way — the full historical log, V1 → design6 |
| [docs/development-workflow.md](docs/development-workflow.md) | Branches, PRs, CI, environments, the Change Rule |
| [docs/ai-workflow.md](docs/ai-workflow.md) | Human + AI roles and rules of engagement |

**The Change Rule:** when requirements change, update the owning document *before* changing the build.

## Project Philosophy

**The Technology rule.** An experiment should not force the entire website to adopt its technology. New technologies must earn their place — which is why Three.js is contained to the Hero while every other canvas stays hand-rolled.

**One lit element.** The visual system is monochrome metal with a single accent light (`--phosphor`, plus its `--phosphor-b` counterpart). Spending the accent anywhere else is what breaks it.

**The signal is real, not decorative.** Motion on this site is driven by actual audio and actual interaction, not by a loop playing at the visitor.

**Start simple.** Next.js + React + TypeScript + CSS + Git + Vercel — then let the site itself dictate what gets learned next.

**The loop:** Website → Portfolio + Lab → Learning → Experiments → Proof → Opportunities.
