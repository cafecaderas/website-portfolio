/** All copy for the Works page. */

export const worksPageContent = {
  eyebrow: "WORKS — INDEX",
  titleLine1: "I build things.",
  titleLine2: "Here is the proof.",
  lede: "Client and commissioned work: websites, digital experiences, creative direction, and visual work. Each entry opens a case study — the problem, the signal path, and what changed.",
} as const;

/** The four main categories — "the main buttons." All four are represented among current WORKS entries. */
export const workFilters = [
  { key: "all", label: "ALL" },
  { key: "web", label: "WEB" },
  { key: "apps", label: "APPS" },
  { key: "branding", label: "BRANDING" },
  { key: "marketing", label: "MARKETING" },
] as const;

export const featuredCaseStudyContent = {
  /** Which project (by slug, from lib/content/projects.ts) this panel features. */
  slug: "nocturne-studio",
  chipLabel: "CASE STUDY 01",
  /** Static display chips for this one handpicked feature — unrelated to a Project's own `tags`. */
  labels: ["WEBSITE", "ART DIRECTION", "NEXT.JS", "2026"],
  ctaLabel: "READ CASE STUDY →",
  readouts: ["BOOKINGS +240%", "0.6s FIRST PAINT"],
  scopeAmp: 0.4,
} as const;
