import Link from "next/link";
import { Scope } from "@/components/canvas/Scope";
import { getProjectBySlug } from "@/lib/content/projects";
import { featuredCaseStudyContent } from "@/lib/content/works";

export function FeaturedCaseStudy() {
  const { slug, chipLabel, tags, ctaLabel, readouts, scopeAmp } = featuredCaseStudyContent;
  const project = getProjectBySlug(slug);
  if (!project) return null;

  return (
    <div className="feature">
      <div className="txt">
        <span className="chip live">
          <span className="led-dot animate__animated animate__pulse animate__infinite" />
          {chipLabel}
        </span>
        <h3 style={{ marginTop: 16 }}>{project.title}</h3>
        <p className="lede" style={{ fontSize: "14.5px" }}>
          {project.caseStudy?.body}
        </p>
        <div className="chips">
          {tags.map((tag) => (
            <span className="chip" key={tag}>
              {tag}
            </span>
          ))}
        </div>
        <div style={{ marginTop: 22 }}>
          <Link className="btn" href={`/works/${project.slug}`}>
            {ctaLabel}
          </Link>
        </div>
      </div>
      <div className="vis">
        <Scope amp={scopeAmp} />
        <span className="rd">
          {readouts.map((readout) => (
            <span key={readout}>{readout}</span>
          ))}
        </span>
      </div>
    </div>
  );
}
