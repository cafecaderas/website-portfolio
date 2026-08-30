/** All copy for the About + Contact page. */

export const aboutPageContent = {
  eyebrow: "ABOUT + CONTACT",
  titleLine1: "CAFE CADERAS IS A",
  titleLine2: "CREATIVE TECHNOLOGIST",
  lede: "Engineer, Designer, DJ and Musician. I make websites and digital experiences for people who care how things feel. Which usually means quality people + good signal paths.",
} as const;

export const nowPastNext = [
  {
    title: "NOW",
    items: [
      { marker: "01", text: "Building Patchbay — signal routing that plays back in the browser.", hi: true },
      { marker: "02", text: "Learning TypeScript properly. Types before tricks.", hi: false },
      { marker: "03", text: "Taking on two client projects for the back half of 2026.", hi: false },
    ],
  },
  {
    title: "PAST",
    items: [
      { marker: "—", text: "Made records. Tracked, mixed, mastered, played out most weekends.", hi: false },
      { marker: "—", text: "Moved into design; led product and brand work in-house.", hi: false },
      { marker: "—", text: "Started building the tools instead of waiting for them.", hi: false },
    ],
  },
  {
    title: "NEXT",
    items: [
      { marker: "→", text: "Fewer, larger projects where I own both the build and the direction.", hi: true },
      { marker: "→", text: "Shipping the lab tools as real products.", hi: false },
      { marker: "→", text: "A studio, eventually. Small one.", hi: false },
    ],
  },
] as const;

export const capabilitiesContent = {
  eyebrow: "CAPABILITIES — SIGNAL CHAIN",
  channels: [
    {
      label: "WEB DEVELOPMENT",
      body: "Sites and interfaces that ship — React, Next.js, TypeScript.",
      tags: ["REACT", "NEXT.JS", "TYPESCRIPT"],
    },
    {
      label: "CREATIVE DEVELOPMENT",
      body: "Real-time graphics and interactive scenes — WebGL, Three.js, shaders.",
      tags: ["WEBGL", "THREE.JS", "SHADERS"],
    },
    {
      label: "AUDIO",
      body: "Sound as an interface, not just a file — Web Audio API, Tone.js.",
      tags: ["WEB AUDIO API", "TONE.JS", "DSP"],
    },
    {
      label: "VISUAL",
      body: "Canvas, motion, and video work that carries the same signal.",
      tags: ["CANVAS", "ANIMATION", "VIDEO"],
    },
    {
      label: "SYSTEMS",
      body: "The plumbing behind the interface — APIs, databases, architecture.",
      tags: ["APIS", "DATABASES", "ARCHITECTURE"],
    },
    {
      label: "AI",
      body: "APIs, agents, and creative tooling — used where they earn their place.",
      tags: ["APIS", "AGENTS", "CREATIVE TOOLING"],
    },
    {
      label: "PROFESSIONAL ENGINEERING",
      body: "The craft under all of the above — Git, testing, deployment.",
      tags: ["TYPESCRIPT", "GIT", "TESTING", "DEPLOYMENT"],
    },
  ],
} as const;

export const cvHeading = {
  label: "CV — CONTEXT, NOT ARCHITECTURE",
  pdfLabel: "PDF ↓",
} as const;

export const cvEntries = [
  {
    years: "2024 — NOW",
    role: "Independent — creative technologist",
    description: "Websites, digital experiences, and art direction for music and hospitality clients.",
    place: "BOGOTÁ / REMOTE",
  },
  {
    years: "2021 — 2024",
    role: "Design lead",
    description: "Led product and brand design across a small in-house team; shipped the design system.",
    place: "IN-HOUSE",
  },
  {
    years: "2018 — 2021",
    role: "Audio engineer",
    description: "Tracking, mixing, and mastering. Live sound most weekends.",
    place: "STUDIO / LIVE",
  },
  {
    years: "2016 — 2018",
    role: "Started making records",
    description: "Which is still the reason for all of the above.",
    place: "—",
  },
] as const;

export const contactContent = {
  bigStatement: "Tell me what you're making and what it's supposed to feel like.",
  helperText:
    "Best first message: what it is, when you need it, and one thing you've seen that got it right. I answer everything within a couple of days.",
} as const;
