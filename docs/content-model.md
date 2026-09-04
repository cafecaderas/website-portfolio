# Content Model

> **`lib/content/types.ts` is authoritative.** This document explains the *reasoning* behind the
> shape — what belongs where and why. If the two ever disagree, the code is right and this file
> needs updating. History of how the model got here lives in [decisions.md](decisions.md).

**Status: implemented** (`lib/content/types.ts`, `lib/content/projects.ts`). This superseded the earlier flat `WorkProject | LabProject` shape (fixed `media`/`links`/`caseStudy` fields directly on the project — see the design5 entries in [decisions.md](decisions.md) for that shape's own history) — see the **content model redesign** entry there for exactly what changed on migration and why.

**The core idea:** every project splits into a small, stable `core` (identity + what's needed to render it in a list/card view) and an open-ended `body` (a flexible sequence of typed content blocks, only needed on the full detail page). New media type = a new block type in `body`, never a new nullable field bolted onto every project regardless of whether it applies.

```ts
type ProjectSection = "works" | "lab";
/** The client-facing service classification — "the main buttons." Singular, like a nav tab. */
type MainCategory = "web" | "apps" | "branding" | "marketing" | "events";
/** Granular craft/technique tags — plural on purpose. Same vocabulary for works and lab. */
type SubTag =
  | "code" | "editing" | "audio" | "video" | "animation" | "design" | "3d"
  | "ux-ui" | "crm" | "cms" | "api" | "ai" | "photo"
  | "production" | "events" | "operations";

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
  /** Opt-in placeholder audio-player widget on the detail page — a visual slot, not real audio data. A playable track belongs in `body` as an `audio` block. */
  audioPlayer?: boolean;
}

type ContentBlock =
  /** Plain paragraph. `[label](url)` inside `text` renders as an inline link. */
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

**`section`, `category`, and `tags` are three separate dimensions, not one field.** `section` is site IA (which index page: `works` or `lab`) — it's also the only one of the three with a real lifecycle: a project is expected to start `lab` and, at some point, just have its `section` flipped to `works` once it's ready to show as finished work. Nothing else has to change for that to happen, which is the entire point of `category`/`tags` sharing one vocabulary across both sections — a project's tags describe what it *is*, regardless of where it currently lives. `category` (`web`/`apps`/`branding`/`marketing`/`events`) is the client-facing classification, usually only meaningful once a project has graduated — most lab entries leave it unset. `tags` is how almost everything is actually described day to day, lab or works: a paid audio mix for a client might be `section: "works"`, `category: "marketing"`, `tags: ["audio", "editing"]`; a personal web toy might be `section: "lab"`, no category yet, `tags: ["code", "ux-ui"]`.

**The core-vs-body test** (reusable for any future field, not just the ones listed above): a field belongs in `core` iff a list/card view needs it *without* loading the rest of the project — the works index, the lab grid, a sitemap, an OG tag. Everything only relevant on the full detail page belongs in `body`. `link` is the one non-obvious case: a row doesn't render the raw URL, but it does render *based on whether one exists* (a live-indicator dot), so its presence is list-relevant even though its value is detail-page-only — that's why it stays a single optional core field rather than moving to body.

**`meta`, `status`, and `live` earned their way into core during implementation** — they weren't in the original 7-field draft, and got added only after running the abstract design against the real, already-working list views: `WorkRows` and `LabModuleGrid` both render a short readout and (for lab) a status word on every row, and `WorkRows` renders a live-indicator dot — all three pass the core-vs-body test above. They're worth naming honestly as a deliberate expansion rather than pretending the 7-field draft survived contact with the real UI unchanged. `live` and `status` do currently agree on every real entry (a "LIVE"/"RUNNING" status always pairs with `live: true`) — that's authoring habit, not an enforced rule; the two stay separate fields because a project could reasonably read `status: "ARCHIVE"` while still keeping an old demo live.

**`index` ("W01", "LAB 04") is computed, not stored.** `getWorkProjects()`/`getLabProjects()` (`lib/content/projects.ts`) return `IndexedProject` — `Project` plus an `index` computed from array position at read time. Nothing in content data tracks it, so adding, removing, or reordering a project never requires renumbering anything by hand, and `npm run new:lab` no longer needs to compute one either.

**WHO and WHY get no dedicated fields on purpose.** WHY is what the first `text` block in `body` is for. WHO (personal / collaboration / client) is prose too, unless it's attribution you actually want to *query* — that's what `Testimonial` is for, kept as its own separate content type (global or attached to a project via `projectSlug`), because a testimonial is a different entity (a client relationship), not a project attribute.

**Six content-block types, not five.** `text` / `image` / `video` / `audio` / `embed` cover every example this model was stress-tested against (web, ecommerce, brand/design, a DJ mix, an interactive experiment, a photo set). `link` is the deliberate sixth: a Patreon/Dropbox/arbitrary share URL isn't something you embed inline (no iframe, no player) — it's an outbound button, a different rendering behavior from `embed`, and it replaces the old `ProjectLinks.more[]` core field with body content instead. `embed.provider` is typed as the literal `"soundcloud"` rather than an open string or a wider union — YouTube/Vimeo weren't asked for; widening it later is a one-line change. `gallery` (grid layout for many images) and `heading` (subsections in long case studies) are the obvious next two block types — intentionally not built until a real project's body actually needs one.

**Why this migrates cleanly:** `core` maps directly to frontmatter (MDX) or top-level document fields (any CMS). `body` as a literal JSON/TS array of typed blocks is not just "similar in spirit" to Sanity's Portable Text or Payload's Blocks field — they're the same shape, an array of typed, discriminated content blocks. A future CMS migration is "map this union to Portable Text block types," not "redesign the content model to fit the CMS's opinions."

**Known future pain, deliberately not solved yet:** multi-discipline tagging (`discipline` → `disciplines: Discipline[]`) if one project genuinely needs two; promoting a secondary link (e.g. `repo`) back into `core` if it ever needs to render at list level, not just on the detail page; a real asset pipeline (dimensions, CDN) once `/public` + bare URL strings stop being enough — same deferred external-asset-host decision noted in [project-spec.md](project-spec.md); slug permanence once project pages are actually shared publicly (not yet). Sorting by `date` instead of relying on manual array order is still a live option, not done: today's array order is a deliberate curation, not a byproduct of authoring order (LAB's order in particular doesn't already match date order), so auto-sorting would visibly reshuffle the grid — do it if manual ordering ever actually gets tedious, not by default.
