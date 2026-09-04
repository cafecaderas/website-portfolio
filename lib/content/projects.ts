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
      slug: "cafe-caderas",
      title: "CAFE CADERAS",
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
        alt: "Cafe Caderas — project photo",
      },
    },
    body: [
      {
        type: "text",
        text: "A mobile mastering studio.  audio engineering, Cafe Caderas is a boutique studio for mixing and mastering music. The website is a showcase of the studio's capabilities, with a focus on the audio experience.",
      },
    ],
  },
  {
    core: {
      slug: "colombian-festival",
      title: "Stage Manager",
      date: "2016-2026",
      section: "works",
      category: "events",
      tags: ["audio", "video", "design"],
      description: "Stage Manager for a Colombian festival, with a DJ set.",
      meta: "Entertainment",
      status: "COMPLETE",
      live: true,
      cover: {
        src: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=70",
        alt: "Stage Manager — project photo",
      },
    },
    body: [],
  },
{
    core: {
      slug: "luna-motherhood",
      title: "Luna Motherhood",
      date: "2026",
      section: "works",
      category: "web",
      tags: ["video", "code"],
      description: "New campaign for a maternity brand, with a custom video player and interactive timeline.",
      meta: "Website",
      status: "ARCHIVE",
      live: true,
      cover: {
        src: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=70",
        alt: "Luna Motherhood — project photo",
      },
    },
    body: [],
  },
  {
    core: {
      slug: "test-full-project",
      title: "Test — Full Project",
      date: "2026",
      section: "works",
      category: "web",
      tags: ["code", "design", "video", "audio", "ai"],
      description: "Scratch entry using every ProjectCore field and every ContentBlock type at once. Safe to delete.",
      link: "https://example.com",
      cover: {
        src: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=70",
        alt: "Test Full Project — placeholder cover photo",
      },
      meta: "TEST",
      status: "SANDBOX",
      live: true,
      audioPlayer: true,
    },
    body: [
      {
        type: "text",
        text: "This project exists to preview every core field and every content-block type together, in the real detail-page layout. Delete this entry once you're done comparing.",
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1487014679447-9f8336841d58?auto=format&fit=crop&w=1200&q=70",
        alt: "Placeholder inline image",
        caption: "A body `image` block — inline content, distinct from core.cover above.",
      },
      {
        type: "video",
        src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
        caption: "A body `video` block — native <video controls>.",
      },
      {
        type: "audio",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        caption: "A body `audio` block — native <audio controls>, separate from the audioPlayer widget above.",
      },
      {
        type: "embed",
        provider: "soundcloud",
        url: "https://soundcloud.com/forss/flickermood",
        caption: "A body `embed` block — SoundCloud's own iframe widget.",
      },
      {
        type: "link",
        label: "Example outbound link",
        url: "https://example.com",
      },
    ],
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
      audioPlayer: true,
    },
    body: [],
  },
  {
    core: {
      slug: "luxtige",
      title: "Investor Daddy",
      date: "2016",
      section: "lab",
      tags: ["code", "ai"],
      description: "We made money",
      meta: "Ai automation Tool",
      status: "In Development",
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
      meta: "3:21",
      status: "MIXED",
      live: false,
      audioPlayer: true,
    },
    body: [],
  },
  {
    core: {
      slug: "cms-crm",
      title: "CMS CRM API",
      date: "2025",
      section: "lab",
      tags: ["api"],
      description: "learning new tools and frameworks to build a CMS, CRM, and API for a project management system.",
      meta: "Web",
      status: "TESTING",
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
      slug: "test-embed",
      title: "Test — Embed Block",
      date: "2026",
      section: "lab",
      tags: ["code"],
      description: "Scratch entry for previewing the embed content-block type. Safe to delete.",
      meta: "TEST",
      status: "SANDBOX",
      live: false,
    },
    body: [
      {
        type: "text",
        text: "This project exists only to preview the SoundCloud embed block type in the real detail-page layout. Delete this entry once you're done comparing.",
      },
      {
        type: "embed",
        provider: "soundcloud",
        url: "https://soundcloud.com/forss/flickermood",
      },
    ],
  },
  {
    core: {
      slug: "test-link-button",
      title: "Test — Link Button",
      date: "2026",
      section: "lab",
      tags: ["code"],
      description: "Scratch entry for previewing core.link, which renders the VISIT LIVE button. Safe to delete.",
      meta: "TEST",
      status: "SANDBOX",
      live: false,
      link: "https://example.com",
    },
    body: [
      {
        type: "text",
        text: "core.link is the ONE canonical outbound URL for a project — setting it is what makes the VISIT LIVE button appear above the chips on this page. It's separate from a body `link` block (see the next test entry), which is for links inside the write-up itself, not the project's main destination.",
      },
    ],
  },
  {
    core: {
      slug: "test-image",
      title: "Test — Image Block",
      date: "2026",
      section: "lab",
      tags: ["code"],
      description: "Scratch entry for previewing the image content-block type. Safe to delete.",
      meta: "TEST",
      status: "SANDBOX",
      live: false,
    },
    body: [
      {
        type: "text",
        text: "This is a body `image` block — different from core.cover, which is the card/thumbnail shown on the index page. An image block is inline content, placed wherever it falls in the body array.",
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1487014679447-9f8336841d58?auto=format&fit=crop&w=1200&q=70",
        alt: "Placeholder test image",
        caption: "Just a stock photo, standing in for a real inline image.",
      },
    ],
  },
  {
    core: {
      slug: "test-video",
      title: "Test — Video Block",
      date: "2026",
      section: "lab",
      tags: ["code"],
      description: "Scratch entry for previewing the video content-block type. Safe to delete.",
      meta: "TEST",
      status: "SANDBOX",
      live: false,
    },
    body: [
      {
        type: "text",
        text: "This is a body `video` block. It renders a real HTML5 <video> element with native controls — no external player/embed needed for a self-hosted file.",
      },
      {
        type: "video",
        src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
        caption: "MDN's public-domain sample clip, used only to show the player.",
      },
    ],
  },
  {
    core: {
      slug: "test-audio",
      title: "Test — Audio Block",
      date: "2026",
      section: "lab",
      tags: ["code"],
      description: "Scratch entry for previewing the audio content-block type. Safe to delete.",
      meta: "TEST",
      status: "SANDBOX",
      live: false,
    },
    body: [
      {
        type: "text",
        text: "This is a body `audio` block — a native HTML5 <audio> element. Different from audioPlayer (the placeholder widget) and from an embed block (SoundCloud's own iframe player): this one plays a file you host directly.",
      },
      {
        type: "audio",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        caption: "A public demo track, used only to show the player.",
      },
    ],
  },
  {
    core: {
      slug: "test-link-inline",
      title: "Test — Link Block",
      date: "2026",
      section: "lab",
      tags: ["code"],
      description: "Scratch entry for previewing the inline link content-block type. Safe to delete.",
      meta: "TEST",
      status: "SANDBOX",
      live: false,
    },
    body: [
      {
        type: "text",
        text: "This is a body `link` block — an outbound button placed inline in the write-up (e.g. a Patreon or Dropbox share), as opposed to core.link's single VISIT LIVE button at the top of the page.",
      },
      {
        type: "link",
        label: "Example outbound link",
        url: "https://example.com",
      },
    ],
  },
  {
    core: {
      slug: "test-full-lab",
      title: "Test — Full Lab",
      date: "2026",
      section: "lab",
      category: "web",
      tags: ["code", "design", "video", "audio", "ai"],
      description: "Scratch entry using every ProjectCore field and every ContentBlock type at once. Safe to delete.",
      link: "https://example.com",
      cover: {
        src: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=70",
        alt: "Test Full Lab — placeholder cover photo",
      },
      meta: "TEST",
      status: "SANDBOX",
      live: true,
      audioPlayer: true,
    },
    body: [
      {
        type: "text",
        text: "This project exists to preview every core field and every content-block type together, in the real detail-page layout — the LAB counterpart to test-full-project in WORKS. Delete this entry once you're done comparing.",
      },
      {
        type: "link",
        label: "Clickable Text",
        url: "https://example.com",
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1487014679447-9f8336841d58?auto=format&fit=crop&w=1200&q=70",
        alt: "Placeholder inline image",
        caption: "A body `image` block — inline content, distinct from core.cover above.",
      },
      {
        type: "video",
        src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
        caption: "A body `video` block — native <video controls>.",
      },
      {
        type: "audio",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        caption: "A body `audio` block — native <audio controls>, separate from the audioPlayer widget above.",
      },
      {
        type: "embed",
        provider: "soundcloud",
        url: "https://soundcloud.com/forss/flickermood",
        caption: "A body `embed` block — SoundCloud's own iframe widget.",
      },
      {
        type: "link",
        label: "Example outbound link",
        url: "https://example.com",
      },
    ],
  },
  {
    core: {
      slug: "test-inline-link-a",
      title: "Test — Inline Link (Option A)",
      date: "2026",
      section: "lab",
      tags: ["code"],
      description: "Scratch entry previewing Option A: [label](url) syntax parsed inline inside a normal text block. Safe to delete.",
      meta: "TEST",
      status: "SANDBOX",
      live: false,
    },
    body: [
      {
        type: "text",
        text: "Option A — same `text` block type as always, just with a small addition: write a link right in the sentence, like this [Clickable Text](https://example.com), and it renders inline. Nothing else about the block changed — plain paragraphs with no brackets look exactly like they did before.",
      },
      {
        type: "text",
        text: "You can even have [more than one](https://example.com) link in [the same sentence](https://example.com) — the parser just splits on every match.",
      },
    ],
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
