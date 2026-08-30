import Link from "next/link";
import { Scope } from "@/components/canvas/Scope";
import { getProjectBySlug } from "@/lib/content/projects";

export function FeaturedCaseStudy() {
  const project = getProjectBySlug("nocturne-studio");
  if (!project) return null;

  return (
    <div className="feature">
      <div className="txt">
        <span className="chip live">
          <span className="led-dot animate__animated animate__pulse animate__infinite" />
          CASE STUDY 01
        </span>
        <h3 style={{ marginTop: 16 }}>{project.title}</h3>
        <p className="lede" style={{ fontSize: "14.5px" }}>
          {project.caseStudy?.body}
        </p>
        <div className="chips">
          <span className="chip">WEBSITE</span>
          <span className="chip">ART DIRECTION</span>
          <span className="chip">NEXT.JS</span>
          <span className="chip">2026</span>
        </div>
        <div style={{ marginTop: 22 }}>
          <Link className="btn" href={`/works/${project.slug}`}>
            READ CASE STUDY →
          </Link>
        </div>
      </div>
      <div className="vis">
        <Scope amp={0.4} />
        <span className="rd">
          <span>BOOKINGS +240%</span>
          <span>0.6s FIRST PAINT</span>
        </span>
      </div>
    </div>
  );
}
