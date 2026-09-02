import type { Project } from "./types";

/**
 * One array for both WORKS and LAB — `core.section` decides placement, not
 * medium. Ported from the locked mockup's sample catalog: concrete,
 * non-lorem placeholder content, swap-ready for the real project list.
 */
export const projects: Project[] = [
  // ---------- WORKS ----------
  {
    core: {
      slug: "nocturne-studio",
      title: "Nocturne Studio",
      date: "2026",
      section: "works",
      category: "web",
      tags: ["code", "design"],
      description: "Website + art direction for a mastering studio",
      meta: "NEXT.JS",
      status: "LIVE",
      live: true,
      cover: {
        src: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=70",
        alt: "Nocturne Studio — project photo",
      },
    },
    body: [
      {
        type: "text",
        text: "A mastering studio with no site and a booking form living in someone's DMs. Built the identity out from their console, then a site that lets you hear the room before you book it — before/after players on every service page.",
      },
    ],
  },
  {
    core: {
      slug: "patchbay",
      title: "Patchbay",
      date: "2026",
      section: "works",
      category: "apps",
      tags: ["code", "ux-ui", "audio"],
      description: "Signal-routing tool you can drag, hear, and export",
      meta: "TYPESCRIPT",
      status: "LIVE",
      live: true,
      cover: {
        src: "https://images.unsplash.com/photo-1487014679447-9f8336841d58?auto=format&fit=crop&w=1200&q=70",
        alt: "Patchbay — project photo",
      },
    },
    body: [],
  },
  {
    core: {
      slug: "side-b-records",
      title: "Side B Records",
      date: "2025",
      section: "works",
      category: "branding",
      tags: ["design"],
      description: "Identity, sleeve system, and release microsites",
      meta: "BRAND",
      status: "ARCHIVE",
      live: false,
      cover: {
        src: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=70",
        alt: "Side B Records — project photo",
      },
    },
    body: [],
  },
  {
    core: {
      slug: "ferria-coffee",
      title: "Ferria Coffee",
      date: "2025",
      section: "works",
      category: "web",
      tags: ["code"],
      description: "Storefront rebuild — 2.1s to 0.6s first paint",
      meta: "SHOPIFY",
      status: "LIVE",
      live: true,
      cover: {
        src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=70",
        alt: "Ferria Coffee — project photo",
      },
    },
    body: [],
  },
  {
    core: {
      slug: "rooms-we-left",
      title: "Rooms We Left",
      date: "2025",
      section: "works",
      category: "branding",
      tags: ["photo"],
      description: "Photo series and print run, 18 interiors",
      meta: "35MM",
      status: "ARCHIVE",
      live: false,
      cover: {
        src: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&w=1200&q=70",
        alt: "Rooms We Left — project photo",
      },
    },
    body: [],
  },
  {
    core: {
      slug: "halo-festival",
      title: "Halo Festival",
      date: "2024",
      section: "works",
      category: "marketing",
      tags: ["animation", "video", "code"],
      description: "Stage visuals and a live web companion",
      meta: "WEBGL",
      status: "ARCHIVE",
      live: false,
      cover: {
        src: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=70",
        alt: "Halo Festival — project photo",
      },
    },
    body: [],
  },

  // ---------- LAB ----------
  {
    core: {
      slug: "library-organizer",
      title: "Library Organizer",
      date: "2026",
      section: "lab",
      tags: ["code", "ai"],
      description: "Reads 40k audio files, infers genre from the spectrum, rewrites the tree.",
      meta: "v0.7.2",
      status: "RUNNING",
      live: true,
    },
    body: [],
  },
  {
    core: {
      slug: "after-hours",
      title: "After Hours",
      date: "2026",
      section: "lab",
      tags: ["audio", "editing"],
      description: "Sixty minutes, one take, recorded at 03:12AM. No edits, no rescue.",
      meta: "60:21",
      status: "MIXED",
      live: false,
    },
    body: [],
  },
  {
    core: {
      slug: "cassette-os",
      title: "Cassette OS",
      date: "2025",
      section: "lab",
      tags: ["code", "audio"],
      description: "Tape emulation as a VST3. Wow, flutter and bias modeled per deck.",
      meta: "v1.1.4",
      status: "SHIPPED",
      live: false,
    },
    body: [],
  },
  {
    core: {
      slug: "room-tone",
      title: "Room Tone",
      date: "2025",
      section: "lab",
      tags: ["photo", "audio"],
      description: "Eighteen rooms shot on 35mm and recorded binaurally in the same hour.",
      meta: "18 SITES",
      status: "OPEN",
      live: true,
      cover: {
        src: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?auto=format&fit=crop&w=700&q=70",
        alt: "Interior photo placeholder for Room Tone",
      },
    },
    body: [],
  },
  {
    core: {
      slug: "scope-type",
      title: "Scope Type",
      date: "2026",
      section: "lab",
      tags: ["design", "code", "audio"],
      description: "A typeface that redraws itself from an audio signal. Barely legible. Worth it.",
      meta: "v0.2.0",
      status: "WEIRD",
      live: false,
    },
    body: [],
  },
  {
    core: {
      slug: "this-site",
      title: "This Site",
      date: "2026",
      section: "lab",
      tags: ["code", "design", "ux-ui"],
      description: "Hand-built, no template. The identity is the interface.",
      meta: "v0.1.0",
      status: "BUILDING",
      live: true,
    },
    body: [],
  },
];

/** `index` is derived, not stored — see the design5 Decisions Log entry for why. */
export interface IndexedProject extends Project {
  index: string;
}

function withComputedIndex(items: Project[], prefix: string): IndexedProject[] {
  return items.map((project, i) => ({ ...project, index: `${prefix}${String(i + 1).padStart(2, "0")}` }));
}

export function getProjects(): Project[] {
  return projects;
}

export function getWorkProjects(): IndexedProject[] {
  return withComputedIndex(
    projects.filter((project) => project.core.section === "works"),
    "W",
  );
}

export function getLabProjects(): IndexedProject[] {
  return withComputedIndex(
    projects.filter((project) => project.core.section === "lab"),
    "LAB ",
  );
}

export function getProjectBySlug(slug: string): IndexedProject | undefined {
  return [...getWorkProjects(), ...getLabProjects()].find((project) => project.core.slug === slug);
}
