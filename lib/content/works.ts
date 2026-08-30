/** All copy for the Works page. */

export const worksPageContent = {
  eyebrow: "WORKS — INDEX",
  titleLine1: "I build things.",
  titleLine2: "Here is the proof.",
  lede: "Client and commissioned work: websites, digital experiences, creative direction, and visual work. Each entry opens a case study — the problem, the signal path, and what changed.",
} as const;

export const workFilters = [
  { key: "all", label: "ALL" },
  { key: "websites", label: "WEBSITES" },
  { key: "experiences", label: "DIGITAL EXPERIENCES" },
  { key: "direction", label: "CREATIVE DIRECTION" },
  { key: "visual", label: "VISUAL WORK" },
] as const;

export const featuredCaseStudyContent = {
  /** Which project (by slug, from lib/content/projects.ts) this panel features. */
  slug: "nocturne-studio",
  chipLabel: "CASE STUDY 01",
  tags: ["WEBSITE", "ART DIRECTION", "NEXT.JS", "2026"],
  ctaLabel: "READ CASE STUDY →",
  readouts: ["BOOKINGS +240%", "0.6s FIRST PAINT"],
  scopeAmp: 0.4,
} as const;
