"use client";

import type { Project } from "@/lib/content/types";
import { PlaceholderImage } from "@/components/chrome/PlaceholderImage";
import { SpotlightGlow } from "@/components/chrome/SpotlightGlow";
import { onSpotlightMove } from "@/components/chrome/spotlight";
import { labCategoryLabel } from "@/lib/content/lab";

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

export interface LabModuleGridProps {
  projects: Project[];
  /** slug → live-fetched value, overriding the static `meta` field. */
  liveMeta?: Record<string, string>;
}

export function LabModuleGrid({ projects, liveMeta }: LabModuleGridProps) {
  return (
    <div className="labgrid">
      {projects.map((project) => (
        <article className="mod group" key={project.slug} onPointerMove={onSpotlightMove}>
          <SpotlightGlow />
          <div className="mod-hd">
            <span className="id mono">{project.index}</span>
            <span className="fm">{labCategoryLabel[project.category] ?? project.category.toUpperCase()}</span>
          </div>
          {project.slug === "room-tone" && (
            <PlaceholderImage
              src="https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=700&q=70"
              alt="Interior photo placeholder for Room Tone"
              className="mod-photo"
              sizes="(max-width: 640px) 100vw, 33vw"
            />
          )}
          <div className="mod-body">
            <h3>{project.title}</h3>
            <p>{project.summary}</p>
            <Meter level={project.level ?? 0} />
            <div className="mod-ft">
              <span>{liveMeta?.[project.slug] ?? project.meta}</span>
              <span>{project.status}</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
