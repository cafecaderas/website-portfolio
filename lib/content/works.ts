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
  { key: "events", label: "EVENTS" },
] as const;

export const featuredCaseStudyContent = {
  /** Which project (by slug, from lib/content/projects.ts) this panel features. */
  slug: "cafe-caderas",
  chipLabel: "PROJECT",
  /** Static display chips for this one handpicked feature — unrelated to a Project's own `tags`. */
  labels: ["AUDIO ENGINEERING", "ART DIRECTION", "DJ", "MIX & MASTER"],
  ctaLabel: "FIND OUT MORE →",
  readouts: ["DJ | PRODUCER", "MIX & MASTER"],
  scopeAmp: 0.3,
} as const;
