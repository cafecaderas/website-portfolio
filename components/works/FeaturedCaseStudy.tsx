import Link from "next/link";
import { Scope } from "@/components/canvas/Scope";
import { PlaceholderImage } from "@/components/chrome/PlaceholderImage";
import { getProjectBySlug } from "@/lib/content/projects";
import { featuredCaseStudyContent } from "@/lib/content/works";

export function FeaturedCaseStudy() {
  const { slug, chipLabel, labels, ctaLabel, readouts, scopeAmp } = featuredCaseStudyContent;
  const project = getProjectBySlug(slug);
  if (!project) return null;

  const { core } = project;
  const introText = project.body.find((block) => block.type === "text")?.text ?? core.description;

  return (
    <div className="feature">
      <div className="txt">
        <span className="chip live">
          <span className="led-dot animate__animated animate__pulse animate__infinite" />
          {chipLabel}
        </span>
        <h3 style={{ marginTop: 16 }}>{core.title}</h3>
        <p className="lede" style={{ fontSize: "14.5px" }}>
          {introText}
        </p>
        <div className="chips">
          {labels.map((label) => (
            <span className="chip" key={label}>
              {label}
            </span>
          ))}
        </div>
        <div style={{ marginTop: 22 }}>
          <Link className="btn" href={`/works/${core.slug}`}>
            {ctaLabel}
          </Link>
        </div>
      </div>
      <div className="vis">
        {core.cover && (
          <PlaceholderImage src={core.cover.src} alt={core.cover.alt} sizes="(max-width: 880px) 100vw, 45vw" showTag={false} />
        )}
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
