/**
 * Site-wide identity, navigation, and chrome copy.
 * Four routes total — nothing else goes in the header nav.
 */
export const nav = [
  { label: "HOME", href: "/" },
  { label: "WORKS", href: "/works" },
  { label: "LAB", href: "/lab" },
  { label: "ABOUT + CONTACT", href: "/about" },
] as const;

export const siteConfig = {
  name: "CAFE CADERAS",
  title: "Cafe Caderas — Audio Engineer × Software Engineer",
  description:
    "Creative technologist, designer, engineer, and DJ. Websites and digital experiences for people who care how things feel.",
} as const;

export const tickerLines = [
  "AUDIO ENGINEER × SOFTWARE ENGINEER",
  "SOUND. SYSTEMS. STORY.",
  "HYPNOTIC · UNDERGROUND · INTELLIGENT",
  "ROUGH EDGES WITH PRECISION",
  "BUILT IN THE LAB · SHARED WITH THE WORLD",
] as const;

export const social = {
  instagram: { label: "INSTAGRAM", handle: "@CAFECADERAS", href: "https://instagram.com/cafecaderas" },
  // TODO: real SoundCloud URL — href is "#" until provided
  soundcloud: { label: "SOUNDCLOUD", handle: "/CAFECADERAS", href: "#" },
  // TODO: real GitHub URL — href is "#" until provided
  github: { label: "GITHUB", handle: "/CAFECADERAS", href: "#" },
  // TODO: real CV PDF URL — href is "#" until provided
  cv: { label: "CV", handle: "PDF ↓", href: "#" },
  website: { label: "WEBSITE", handle: "CAFECADERAS.COM", href: "https://www.cafecaderas.com" },
  email: "hello@cafecaderas.com",
} as const;

export const footerCopy = {
  handle: "@CAFECADERAS",
  tagline: "BUILT IN THE LAB. SHARED WITH THE WORLD.",
  copyright: "©2026",
} as const;
