"use client";

import Link from "next/link";
import { formatTag } from "@/lib/content/types";
import type { IndexedProject } from "@/lib/content/projects";
import { PlaceholderImage } from "@/components/chrome/PlaceholderImage";
import { SpotlightGlow } from "@/components/chrome/SpotlightGlow";
import { onSpotlightMove } from "@/components/chrome/spotlight";

/**
 * 22 segments, varying heights (deterministic — no randomness, so this
 * renders identically on server and client). Lit segments are steel;
 * only the top two are phosphor with a glow, which is what keeps
 * green rare while still reading as gear.
 *
 * Heights are rounded to 2 decimals: Math.sin() isn't spec-guaranteed to
 * be bit-identical across JS engines, so the raw value can differ in its
 * low-order digits between the server (Node) and client (browser) render
 * — invisible until this component became a Client Component (needed for
 * the spotlight hover on .mod) and started actually hydrating/re-running
 * client-side, at which point it surfaced as a hydration mismatch.
 */
function Meter({ level }: { level: number }) {
  const n = 22;
  const bars = Array.from({ length: n }, (_, i) => {
    const f = i / n;
    const height = (28 + Math.abs(Math.sin(i * 1.9)) * 62).toFixed(2);
    let className: string | undefined;
    if (f < level) {
      className = level - f < 2 / n ? "pk" : "on";
    }
    return <i key={i} className={className} style={{ height: `${height}%` }} />;
  });
  return <div className="meter">{bars}</div>;
}

/**
 * The meter reading is pure decoration, not tracked progress data — there's
 * no real "70% done" for a DJ mix or a typeface experiment. Deriving it from
 * the slug means every new lab entry still gets a personality-driven meter
 * for free, with nothing to fill in and nothing to keep in sync.
 */
function pseudoLevel(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  return (hash % 100) / 100;
}

export interface LabModuleGridProps {
  projects: IndexedProject[];
  /** slug → live-fetched value, overriding the static `meta` field. */
  liveMeta?: Record<string, string>;
  /**
   * Filtering hides modules, it does not re-mount them — every module stays
   * in the DOM and toggles the `hidden` attribute instead. Mirrors WorkRows.
   */
  isHidden?: (project: IndexedProject) => boolean;
}

/**
 * A grid of entry points, same as WorkRows — every module is a live link
 * into that project's own detail page, in-progress or not.
 */
export function LabModuleGrid({ projects, liveMeta, isHidden }: LabModuleGridProps) {
  return (
    <div className="labgrid">
      {projects.map((project) => {
        const { core } = project;
        return (
          <Link
            className="mod group"
            key={core.slug}
            href={`/lab/${core.slug}`}
            hidden={isHidden?.(project) ?? false}
            onPointerMove={onSpotlightMove}
          >
            <SpotlightGlow />
            <div className="mod-hd">
              <span className="id mono">{project.index}</span>
              <span className="fm">{core.tags?.[0] ? formatTag(core.tags[0]) : "—"}</span>
            </div>
            {core.cover && (
              <PlaceholderImage
                src={core.cover.src}
                alt={core.cover.alt}
                className="mod-photo"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
            )}
            <div className="mod-body">
              <h3>{core.title}</h3>
              <p>{core.description}</p>
              <Meter level={pseudoLevel(core.slug)} />
              {core.tags && core.tags.length > 0 && (
                <div className="mod-tags mono">{core.tags.map((t) => `#${t}`).join(" ")}</div>
              )}
              <div className="mod-ft">
                <span>{(liveMeta?.[core.slug] ?? core.meta) && `[${liveMeta?.[core.slug] ?? core.meta}]`}</span>
                <span>{core.status}</span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
