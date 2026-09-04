/** All copy for the Lab page. */

export const labPageContent = {
  eyebrow: "LAB — EXPERIMENTS",
  titleLine1: "THIS IS HOW",
  titleLine2: "I THINK.",
  lede: "Unfinished on purpose. Music, photography, audio tools, code sketches and prototypes — the things that feed the work but aren't for sale. Some of it works. Some of it is just loud.",
} as const;

export const nowPlayingContent = {
  label: "NOW PLAYING",
  readout: "After Hours Mix — 03:12AM take · 128 BPM",
} as const;

/** Keys are `SubTag` values actually present among LAB entries — not the full universal set. A project can match more than one, unlike workFilters. */
export const labFilters = [
  { key: "all", label: "ALL" },
  { key: "code", label: "CODE" },
  { key: "audio", label: "AUDIO" },
  { key: "ai", label: "AI" },
  { key: "editing", label: "EDITING" },
  { key: "photo", label: "PHOTO" },
  { key: "design", label: "DESIGN" },
  { key: "ux-ui", label: "UX | UI" },
  { key: "video", label: "VIDEO" },
  { key: "animation", label: "ANIMATION" },
  { key: "crm", label: "CRM" },
  { key: "cms", label: "CMS" },
  { key: "api", label: "API" },
  { key: "3d", label: "3D" },
  { key: "events", label: "EVENTS" },
  { key: "operations", label: "OPERATIONS" },
] as const;
