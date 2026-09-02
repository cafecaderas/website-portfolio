import Link from "next/link";
import type { IndexedProject } from "@/lib/content/projects";

export interface ProjectSidebarProps {
  /** Every project in the current collection (works or lab) — never a filtered subset. */
  collection: IndexedProject[];
  activeSlug: string;
  basePath: "/works" | "/lab";
  label: string;
}

/**
 * The panel: every sibling project in this collection, one click away, with
 * the current one marked. A detail page is never actually a dead end when
 * the full collection is sitting right next to it — this is the answer to
 * "now what" that doesn't require leaving the page.
 */
export function ProjectSidebar({ collection, activeSlug, basePath, label }: ProjectSidebarProps) {
  return (
    <nav className="project-sidebar" aria-label={`${label} projects`}>
      <p className="eyebrow">{label}</p>
      <ul>
        {collection.map((project) => {
          const active = project.core.slug === activeSlug;
          return (
            <li key={project.core.slug}>
              <Link
                className="linkline"
                href={`${basePath}/${project.core.slug}`}
                aria-current={active ? "page" : undefined}
              >
                <span>{project.core.title}</span>
                <span>{project.index}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
