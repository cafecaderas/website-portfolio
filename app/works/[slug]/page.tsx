import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/content/projects";

type Props = {
  params: Promise<{ slug: string }>;
};

/**
 * Case study pages are out of scope for this pass — this stubs the
 * route and renders the summary only.
 */
export default async function WorkDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project || project.section !== "works") {
    notFound();
  }

  return (
    <section className="pagehead">
      <div className="wrap">
        <p className="eyebrow">
          WORKS — {project.index} · {project.status}
        </p>
        <h1 className="h1" style={{ fontSize: "clamp(2.3rem, 5.6vw, 4.4rem)" }}>
          {project.title}
        </h1>
        <p className="lede">{project.caseStudy?.body ?? project.summary}</p>
        <div className="chips" style={{ marginTop: 26 }}>
          <span className="chip">{project.meta}</span>
        </div>
      </div>
    </section>
  );
}
