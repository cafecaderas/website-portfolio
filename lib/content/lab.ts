/** All copy for the Lab page. */

export const labPageContent = {
  eyebrow: "LAB — EXPERIMENTS",
  titleLine1: "This is how",
  titleLine2: "I think.",
  lede: "Unfinished on purpose. Music, photography, audio tools, code sketches and prototypes — the things that feed the work but aren't for sale. Some of it works. Some of it is just loud.",
} as const;

export const nowPlayingContent = {
  label: "NOW PLAYING",
  readout: "After Hours — 03:12AM take · 145 BPM",
} as const;

/** Display label for each LAB project category (module header tag). */
export const labCategoryLabel: Record<string, string> = {
  code: "CODE",
  dj: "DJ",
  audio: "AUDIO",
  photo: "PHOTO",
  proto: "PROTO",
};
