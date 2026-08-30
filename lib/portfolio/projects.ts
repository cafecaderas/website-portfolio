/**
 * Portfolio project data. Most entries are lorem-ipsum placeholders
 * pending real content from the design Q&A. `cafe-caderas` is real —
 * it preserves the original DJ landing page content/links rather than
 * deleting them.
 */
export type Project = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  tags: string[];
  links?: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    slug: "cafe-caderas",
    title: "Cafe Caderas",
    summary: "Tech House, Latin Groove, Rolling Tech.",
    description:
      "Cafe Caderas is a DJ act and event brand spanning tech house, Latin groove, and rolling tech rhythms. This entry preserves the original landing page content and links.",
    tags: ["Music", "DJ", "Brand", "Live Events"],
    links: [
      { label: "Website", href: "https://www.cafecaderas.com" },
      { label: "Instagram", href: "https://instagram.com/cafecaderas" },
    ],
  },
  {
    slug: "project-one",
    title: "Lorem Ipsum Project",
    summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Placeholder project detail copy pending real content.",
    tags: ["Placeholder"],
  },
  {
    slug: "project-two",
    title: "Lorem Ipsum Project Two",
    summary: "Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
    description:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Placeholder project detail copy pending real content.",
    tags: ["Placeholder"],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
