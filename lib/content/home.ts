/**
 * All copy for the Home page. Components read from here rather than
 * embedding strings — this is the "editable site" layer: swap values
 * here, no component/JSX changes needed.
 */

export const heroContent = {
  metaLeft: {
    role: "CREATIVE TECHNOLOGIST",
    tags: "DESIGNER · ENGINEER · DJ",
    location: "ARIZONA / MEDELLIN / BOGOTÁ / REMOTE",
  },
  metaRight: {
    version: "SITE V3.2",
    aSide: "aSide: Sound",
    bSide: "bSide: Systems",
    timestamp: "REC. 03:12AM",
  },
  logotype: "CAFE CADERAS",
  tagline: {
    before: "BUILDING DIGITAL ",
    emphasis: "+",
    after: " VISUAL EXPERIENCES",
  },
  ctaPrimary: { label: "VIEW WORKS", href: "/works" },
  ctaSecondary: { label: "ENTER THE LAB", href: "/lab" },
} as const;

/**
 * The tape deck's labels — the A/B side label under the knob and the bottom
 * mode row. Changing a label here is the whole edit; `TapeTransport/draw.ts`
 * and `TapeTransport/index.tsx` read these straight through.
 */
export const transportContent = {
  sideA: "A-SIDE",
  sideB: "B-SIDE",
  modeA: "A-SIDE: GRID MODE",
  modeB: "B-SIDE: FLOW MODE",
} as const;

export const sidesContent = {
  eyebrow: "ONE BRAND · TWO SIDES",
  a: {
    tagLabel: "A-SIDE",
    tagSuffix: "— SOUND",
    title: "Where it started",
    body: "15 years of tracking, mixing and playing records taught me the thing that actually transfers: how something feels in the first four seconds, and what to cut so the rest lands.",
    tags: ["MIXING", "MASTERING", "LIVE SETS", "FIELD RECORDING"],
    scopeAmp: 0.62,
  },
  b: {
    tagLabel: "B-SIDE",
    tagSuffix: "— SYSTEMS",
    title: "Where it's going",
    body: "Now I build the tools and the interfaces — sites, prototypes, small strange software. Same ear, different signal path. The engineering is in service of the feeling, not the other way round.",
    tags: ["WEBSITES", "DIGITAL EXPERIENCES", "CREATIVE DIRECTION", "PROTOTYPES"],
    scopeAmp: 0.42,
  },
} as const;

export const selectedWorkContent = {
  eyebrow: "SELECTED WORK",
  title: "Things I built that shipped.",
  ctaLabel: "ALL WORKS →",
  featuredCount: 3,
} as const;

export const labCurrentlyContent = {
  eyebrow: "LAB — CURRENTLY",
  cells: [
    {
      k: "BUILDING",
      v: "A signal-routing tool that plays back in the browser",
      t: "RUNNING",
    },
    {
      k: "LEARNING",
      v: "TypeScript, properly this time — types before tricks",
      t: "IN PROGRESS",
    },
    {
      k: "EXPLORING",
      v: "Type that redraws itself from an audio signal",
      t: "WEIRD",
    },
  ],
  ctaLabel: "ENTER THE LAB",
} as const;

export const aboutTeaserContent = {
  eyebrow: "ABOUT",
  statement: {
    before: "I came up making records and stayed for the signal path. Now I build the things people ",
    emphasis: "actually use",
    after: " — with the same ear.",
  },
  availability:
    "Available for websites, digital experiences and creative direction. Currently taking on two projects for the back half of 2026.",
  ctaCv: "READ THE CV",
  ctaContact: "GET IN TOUCH",
} as const;
