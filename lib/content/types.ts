export type ProjectSection = "works" | "lab";

/**
 * The client-facing service classification — "the main buttons." Singular:
 * a project is exactly one of these, like a nav tab, even though the real
 * engagement behind it might have touched more than one.
 */
export type MainCategory = "web" | "apps" | "branding" | "marketing";

/**
 * Granular craft/technique tags — plural on purpose, unlike `category`. The
 * same vocabulary applies whether a project is `lab` or `works`: nothing
 * about a project's tags needs to change when it graduates from one section
 * to the other, only `section` itself (and, once it's ready, `category`).
 */
export type SubTag =
  | "code"
  | "editing"
  | "audio"
  | "video"
  | "animation"
  | "design"
  | "3d"
  | "ux-ui"
  | "crm"
  | "cms"
  | "api"
  | "ai"
  | "photo";

const TAG_LABELS: Partial<Record<SubTag, string>> = {
  "ux-ui": "UX | UI",
};

/** Display label for a tag shown as a standalone badge/chip. Hashtag-style lists use the raw value instead — real hashtags don't have spaces either. */
export function formatTag(tag: SubTag): string {
  return TAG_LABELS[tag] ?? tag.toUpperCase();
}

export interface CoverImage {
  src: string;
  alt: string;
}

/** New medium => a new ContentBlock variant, never a new field on every project. */
export type ContentBlock =
  | { type: "text"; text: string }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "video"; src: string; poster?: string; caption?: string }
  | { type: "audio"; src: string; caption?: string }
  | { type: "embed"; provider: "soundcloud"; url: string; caption?: string }
  | { type: "link"; label: string; url: string };

export interface ProjectCore {
  slug: string;
  title: string;
  /** "2026", "2026-01", or "2026-01-15" — as much precision as actually exists. */
  date: string;
  section: ProjectSection;
  /**
   * The main category, once a project has one — usually unset while a
   * project is still lab-only, filled in when it's ready to show as works.
   * Not required: plenty of lab work never needs a client-facing category.
   */
  category?: MainCategory;
  /** Craft/technique tags. Usually how a lab project is described before it has a category at all. */
  tags?: SubTag[];
  /** One or two lines — card/list preview text. */
  description: string;
  /** The ONE canonical "go here to experience this" URL. Anything else is a body `link` block. */
  link?: string;
  /** Card/thumbnail image. Optional — a missing cover renders as no cover, never a fake one. */
  cover?: CoverImage;
  /** Short at-a-glance readout — a tech tag ("NEXT.JS"), a version, a duration. Not the year: `date` already carries that. */
  meta?: string;
  /** A free-text state word ("LIVE", "ARCHIVE", "WEIRD") — flavor, not a workflow enum. */
  status?: string;
  /** Drives the phosphor LED dot. Independent of `status` on purpose: a project can read ARCHIVE and still have a live demo up. */
  live?: boolean;
}

export interface Project {
  core: ProjectCore;
  body: ContentBlock[];
}

export interface Testimonial {
  id: string;
  author: string;
  role?: string;
  quote: string;
  avatarSrc?: string;
  avatarAlt?: string;
  link?: string;
  /** Unset => shows in the sitewide strip. Set => also retrievable per-project. */
  projectSlug?: string;
}
