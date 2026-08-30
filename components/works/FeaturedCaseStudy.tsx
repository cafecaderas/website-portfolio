import Link from "next/link";
import { Scope } from "@/components/canvas/Scope";
import { PlaceholderImage } from "@/components/chrome/PlaceholderImage";
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
        <PlaceholderImage
          src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1000&q=70"
          alt="Studio placeholder photo for this case study"
          sizes="(max-width: 880px) 100vw, 45vw"
          showTag={false}
        />
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
