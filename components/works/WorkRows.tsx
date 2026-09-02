"use client";

import Link from "next/link";
import type { IndexedProject } from "@/lib/content/projects";
import { PlaceholderImage } from "@/components/chrome/PlaceholderImage";
import { SpotlightGlow } from "@/components/chrome/SpotlightGlow";
import { onSpotlightMove } from "@/components/chrome/spotlight";

export interface WorkRowsProps {
  projects: IndexedProject[];
  /**
   * Filtering hides rows, it does not re-mount them — every row stays
   * in the DOM and toggles the `hidden` attribute instead.
   */
  isHidden?: (project: IndexedProject) => boolean;
  className?: string;
}

/**
 * Full-width rows, shared by Home's top-3 and the Works index. Every row is
 * an entry point into that project's own data — there is no "too thin to
 * click" project, finished or not.
 */
export function WorkRows({ projects, isHidden, className }: WorkRowsProps) {
  return (
    <div className={`rows${className ? ` ${className}` : ""}`}>
      {projects.map((project) => {
        const { core } = project;
        const hidden = isHidden?.(project) ?? false;
        const meta = [core.meta, core.date].filter(Boolean).join(" · ");

        return (
          <Link
            key={core.slug}
            className="row group"
            href={`/works/${core.slug}`}
            hidden={hidden}
            onPointerMove={onSpotlightMove}
          >
            <SpotlightGlow />
            <span className="ix">
              {project.index}
              {core.live && <span className="led-dot animate__animated animate__pulse animate__infinite" />}
            </span>
            <span className="ttl">
              {core.cover && (
                <PlaceholderImage src={core.cover.src} alt={core.cover.alt} className="row-thumb" sizes="44px" showTag={false} />
              )}
              <span>
                {core.title}
                <span className="sub">{core.description}</span>
              </span>
            </span>
            <span className="meta">{meta}</span>
          </Link>
        );
      })}
    </div>
  );
}
