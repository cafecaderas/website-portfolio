# Project Spec

> **What we're building, and the boundaries around it.** How it's built lives in
> [architecture.md](architecture.md); why it ended up that way lives in
> [decisions.md](decisions.md).

## What are we building?

**Project:** "website-portfolio site"

**One-liner:** A personal website + public creative/technical laboratory for showcasing work, experimenting with technology, and creating proof of concept across web, audio, video, WebGL, and creative systems.

**Problem:** A static portfolio doesn't demonstrate the process, experimentation, or range of skills being developed. The site should become a living space where skills are applied publicly and turned into tangible proof of capability.

**Success** = The site is live, useful as a portfolio, easy to evolve, and continuously demonstrates real technical + creative work as new skills are learned.

## Scope

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

## Behavior

USER → SYSTEM → RESULT

[Visitor explores portfolio / projects / experiments] → [Site presents the work through appropriate content and interactive experiences] → [Visitor understands the work, capabilities, and creative/technical direction]

## Data + Integrations

**INPUTS:** Projects, portfolio content, creative work, experiments, media, code, and future interactive experiences.

**OUTPUTS:** Portfolio pages, project showcases, experiments, proof of concepts, creative experiences, and eventually services / content.

**DATA:** Project information, portfolio content, media metadata, experiment information, and other site content as needed. Media assets split by weight: lightweight files stay committed in `/public`; large files (full-res photos, video, 3D exports, audio) are intended for an external asset host once one is chosen (not yet — see below). See [content-model.md](content-model.md) for the current target shape of a `Project`.

**EXTERNAL SERVICES:** Vercel, GitHub, and future APIs / services as required by individual experiments. Two are anticipated but not yet integrated, per the "ask before significant infrastructure" rule in [ai-workflow.md](ai-workflow.md): a **hosted headless CMS** (Sanity/Payload family) as the eventual editing surface once there's enough real content to justify one, and an **external asset host** for large media once one is picked. Until then, content stays hand-authored TypeScript in `lib/content/` — the model is shaped so that swap only ever changes the data-access functions in `lib/content/`, never a component.

The shape of a `Project` and the reasoning behind it: [content-model.md](content-model.md).

## Roadmap

- **PHASE 1 — done:** Build the V1 foundation — establish the core portfolio experience, site structure, styling, content architecture, Git/GitHub workflow, and deployment.
- **PHASE 2 — done:** Build the experimental layer — establish the lab, projects, proof of concepts, and structure for adding new technologies without rebuilding the site.
- **PHASE 3 — in progress:** Expand design using iterations, AI, APIs, advanced interactions, trying new technology and future subdomains/services as justified.
- **PHASE 4:** Expand on premium feel using WebGL, audio, video, to create a real artistic masterpiece. 
- **PHASE 5:** Keeping the website flexible for new changes in tech, design, and content is the ultimate balance — balancing version control, portfolio, and performance.
