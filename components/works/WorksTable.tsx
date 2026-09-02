"use client";

import Link from "next/link";
import type { IndexedProject } from "@/lib/content/projects";
import { SpotlightGlow } from "@/components/chrome/SpotlightGlow";
import { onSpotlightMove } from "@/components/chrome/spotlight";

export interface WorksTableProps {
  projects: IndexedProject[];
  /** Filtering hides rows, it does not re-mount them — same pattern as WorkRows. */
  isHidden?: (project: IndexedProject) => boolean;
}

/**
 * The works index, read as data rather than staged as a portfolio slideshow.
 * The stack (`meta`) leads each row instead of the sequential index — it's
 * the more interesting fact about a finished project, and the index still
 * lives on (in the sidebar, the detail page) for anything that needs strict
 * ordering. Cover photos stay on the detail page; this view is deliberately
 * text-only, closer to a directory listing than a gallery.
 */
export function WorksTable({ projects, isHidden }: WorksTableProps) {
  return (
    <div className="tablebox">
      <span className="tablebox-tag mono">
        ~/works<span className="cursor">_</span>
      </span>

      <div className="trow trow--head" aria-hidden="true">
        <span className="stack-tag">STACK</span>
        <span>PROJECT</span>
        <span className="type">CATEGORY</span>
        <span className="year">YEAR</span>
        <span className="status">STATUS</span>
      </div>

      {projects.map((project) => {
        const { core } = project;
        const hidden = isHidden?.(project) ?? false;
        return (
          <Link
            key={core.slug}
            href={`/works/${core.slug}`}
            className="trow group"
            hidden={hidden}
            onPointerMove={onSpotlightMove}
          >
            <SpotlightGlow />
            <span className="stack-tag">[{core.meta ?? "—"}]</span>
            <span className="ttl">
              {core.title}
              <span className="sub">{core.description}</span>
              {core.tags && core.tags.length > 0 && (
                <span className="tagline mono">{core.tags.map((t) => `#${t}`).join(" ")}</span>
              )}
            </span>
            <span className="type dim">{core.category?.toUpperCase() ?? "—"}</span>
            <span className="year dim">{core.date}</span>
            <span className="status">
              <span
                className={core.live ? "led-dot animate__animated animate__pulse animate__infinite" : "dot-off"}
              />
              {core.status}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
