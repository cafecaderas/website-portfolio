"use client";

import Link from "next/link";
import { formatTag } from "@/lib/content/types";
import type { IndexedProject } from "@/lib/content/projects";
import { SpotlightGlow } from "@/components/chrome/SpotlightGlow";
import { onSpotlightMove } from "@/components/chrome/spotlight";

export interface LabTableProps {
  projects: IndexedProject[];
  /** Filtering hides rows, it does not re-mount them — same pattern as WorksTable. */
  isHidden?: (project: IndexedProject) => boolean;
}

/**
 * The lab index, read as the same kind of data table as WORKS — text-only,
 * cover photos left on the detail page. TAG leads the narrow column with a
 * lab project's primary craft tag (most lab entries don't have a `category`
 * yet — that's earned on graduating to works), with the full tag set
 * underneath the title, same split WorksTable uses for category vs. tags.
 * YEAR/STATUS reuse `date`/`status`/`live` exactly as WORKS does — lab
 * entries already carry all three, nothing new to add.
 */
export function LabTable({ projects, isHidden }: LabTableProps) {
  return (
    <div className="tablebox">
      <span className="tablebox-tag mono">
        ~/lab<span className="cursor">_</span>
      </span>

      <div className="trow trow--head" aria-hidden="true">
        <span className="stack-tag">TAG</span>
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
            href={`/lab/${core.slug}`}
            className="trow group"
            hidden={hidden}
            onPointerMove={onSpotlightMove}
          >
            <SpotlightGlow />
            <span className="stack-tag">{core.tags?.[0] ? formatTag(core.tags[0]) : "—"}</span>
            <span className="ttl">
              {core.title}
              <span className="sub">{core.description}</span>
              {core.tags && core.tags.length > 0 && (
                <span className="tagline mono">{core.tags.map((t) => `#${t}`).join(" ")}</span>
              )}
            </span>
            <span className="type dim">[{core.meta ?? "—"}]</span>
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
