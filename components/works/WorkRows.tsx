"use client";

import Link from "next/link";
import type { Project } from "@/lib/content/types";
import { PlaceholderImage } from "@/components/chrome/PlaceholderImage";
import { SpotlightGlow } from "@/components/chrome/SpotlightGlow";
import { onSpotlightMove } from "@/components/chrome/spotlight";

/** One placeholder thumbnail per WORK category — swap for real project art. */
const CATEGORY_THUMB: Partial<Record<Project["category"], string>> = {
  websites: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=200&q=70",
  experiences: "https://images.unsplash.com/photo-1487014679447-9f8336841d58?auto=format&fit=crop&w=200&q=70",
  direction: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=200&q=70",
  visual: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&w=200&q=70",
};

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
        const thumb = CATEGORY_THUMB[project.category];
        const inner = (
          <>
            <span className="ix">
              {project.index}
              {project.live && (
                <span className="led-dot animate__animated animate__pulse animate__infinite" />
              )}
            </span>
            <span className="ttl">
              {thumb && (
                <PlaceholderImage
                  src={thumb}
                  alt=""
                  className="row-thumb"
                  sizes="44px"
                  showTag={false}
                />
              )}
              <span>
                {project.title}
                <span className="sub">{project.summary}</span>
              </span>
            </span>
            <span className="meta">{project.meta}</span>
          </>
        );

        if (project.caseStudy) {
          return (
            <Link
              key={project.slug}
              className="row group"
              href={`/works/${project.slug}`}
              hidden={hidden}
              onPointerMove={onSpotlightMove}
            >
              <SpotlightGlow />
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
