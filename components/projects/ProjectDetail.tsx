import Link from "next/link";
import { getTestimonialsForProject } from "@/lib/content/testimonials";
import { formatTag } from "@/lib/content/types";
import type { IndexedProject } from "@/lib/content/projects";
import { PlaceholderImage } from "@/components/chrome/PlaceholderImage";
import { BlockRenderer } from "@/components/content/BlockRenderer";
import { TestimonialStrip } from "@/components/testimonials/TestimonialStrip";
import { ProjectSidebar } from "./ProjectSidebar";

export interface ProjectDetailProps {
  project: IndexedProject;
  /** Every project in this project's own section — powers the sidebar and prev/next, never a filtered subset. */
  collection: IndexedProject[];
  basePath: "/works" | "/lab";
  /** "WORKS" or "LAB" — the only thing that actually differs between the two routes. */
  sectionLabel: string;
}

/**
 * The one detail-page layout, shared by /works/[slug] and /lab/[slug]. Works
 * and lab are the same kind of thing — a PROJECT — shown through the same
 * schema; the only real difference is finished vs. in-progress, which shows
 * up in the data (status, whether body has anything in it yet), not in a
 * second page template.
 *
 * Never a dead end: a back link to the index, a sidebar listing every
 * sibling project, and a prev/next pager that wraps around (last project's
 * "next" is the first) — there is always somewhere else to go without
 * leaving the page.
 */
export function ProjectDetail({ project, collection, basePath, sectionLabel }: ProjectDetailProps) {
  const { core } = project;
  const testimonials = getTestimonialsForProject(core.slug);

  const currentIndex = collection.findIndex((p) => p.core.slug === core.slug);
  const prev = collection[(currentIndex - 1 + collection.length) % collection.length];
  const next = collection[(currentIndex + 1) % collection.length];
  const hasSiblings = collection.length > 1;

  return (
    <section className="pagehead">
      <div className="wrap">
        <Link className="backlink" href={basePath}>
          ← {sectionLabel} INDEX
        </Link>

        <div className="project-layout">
          <div className="project-main">
            <p className="eyebrow">
              {sectionLabel} — {project.index}
              {core.status && <> · {core.status}</>}
            </p>
            <h1 className="h1" style={{ fontSize: "clamp(2.3rem, 5.6vw, 4.4rem)" }}>
              {core.title}
            </h1>
            <p className="lede">{core.description}</p>
            <div className="chips" style={{ marginTop: 26 }}>
              {core.meta && <span className="chip">{core.meta}</span>}
              {core.category && <span className="chip">{core.category.toUpperCase()}</span>}
              {core.tags?.map((tag) => (
                <span className="chip" key={tag}>
                  {formatTag(tag)}
                </span>
              ))}
            </div>

            {core.link && (
              <div style={{ marginTop: 22 }}>
                <a className="btn solid" href={core.link} target="_blank" rel="noopener noreferrer">
                  VISIT LIVE
                </a>
              </div>
            )}

            {core.cover && (
              <div className="project-media" style={{ marginTop: 26, maxWidth: 720 }}>
                <PlaceholderImage src={core.cover.src} alt={core.cover.alt} sizes="(max-width: 720px) 100vw, 720px" />
              </div>
            )}

            {project.body.map((block, i) => (
              <div key={i} style={{ marginTop: 26, maxWidth: 720 }}>
                <BlockRenderer
                  block={block}
                  className={block.type === "image" ? "project-media" : undefined}
                  sizes="(max-width: 720px) 100vw, 720px"
                />
              </div>
            ))}

            {testimonials.length > 0 && (
              <div style={{ marginTop: 46 }}>
                <TestimonialStrip testimonials={testimonials} />
              </div>
            )}

            {hasSiblings && (
              <div className="project-nav">
                <Link href={`${basePath}/${prev.core.slug}`} className="prev">
                  ← {prev.core.title}
                </Link>
                <Link href={`${basePath}/${next.core.slug}`} className="next">
                  {next.core.title} →
                </Link>
              </div>
            )}
          </div>

          {hasSiblings && (
            <ProjectSidebar collection={collection} activeSlug={core.slug} basePath={basePath} label={`${sectionLabel} INDEX`} />
          )}
        </div>
      </div>
    </section>
  );
}
