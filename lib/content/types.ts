export type ProjectSection = "works" | "lab";

export type ProjectCategory =
  | "websites"
  | "experiences"
  | "direction"
  | "visual"
  | "code"
  | "dj"
  | "photo"
  | "audio"
  | "proto";

export interface CaseStudy {
  /** Stubbed — full case study pages are out of scope for this pass. */
  body?: string;
}

export interface Project {
  slug: string;
  /** "W01" / "LAB 03" — displayed. */
  index: string;
  title: string;
  /** One line, shown in the index. */
  summary: string;
  /** Purpose decides placement, not medium. */
  section: ProjectSection;
  category: ProjectCategory;
  /** "NEXT.JS · 2026" — displayed right-aligned. */
  meta: string;
  year: number;
  status: string;
  /** Drives the phosphor LED dot. */
  live: boolean;
  /** 0–1, drives the LAB meter fill. */
  level?: number;
  /** Present => the row links to a detail page. */
  caseStudy?: CaseStudy;
}
