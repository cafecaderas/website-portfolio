import Link from "next/link";
import type { Project } from "@/lib/content/types";

export interface WorkRowsProps {
  projects: Project[];
  /**
   * Filtering hides rows, it does not re-mount them — every row stays
   * in the DOM and toggles the `hidden` attribute instead.
   */
  isHidden?: (project: Project) => boolean;
  className?: string;
}

/**
 * Full-width rows, shared by Home's top-3 and the Works index. A
 * project with a case study links out; one without renders as a
 * static row instead — no hover phosphor bar, no cursor pointer.
 */
export function WorkRows({ projects, isHidden, className }: WorkRowsProps) {
  return (
    <div className={`rows${className ? ` ${className}` : ""}`}>
      {projects.map((project) => {
        const hidden = isHidden?.(project) ?? false;
        const inner = (
          <>
            <span className="ix">
              {project.index}
              {project.live && (
                <span className="led-dot animate__animated animate__pulse animate__infinite" />
              )}
            </span>
            <span className="ttl">
              {project.title}
              <span className="sub">{project.summary}</span>
            </span>
            <span className="meta">{project.meta}</span>
          </>
        );

        if (project.caseStudy) {
          return (
            <Link
              key={project.slug}
              className="row"
              href={`/works/${project.slug}`}
              hidden={hidden}
            >
              {inner}
            </Link>
          );
        }

        return (
          <div key={project.slug} className="row row--static" hidden={hidden}>
            {inner}
          </div>
        );
      })}
    </div>
  );
}
