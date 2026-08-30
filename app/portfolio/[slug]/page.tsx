import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/portfolio/projects";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="landing-main page-main">
      <section className="landing-container page-section">
        <h1 className="page-title">{project.title}</h1>
        <p className="page-intro">{project.description}</p>

        <ul className="card__tags">
          {project.tags.map((tag) => (
            <li key={tag} className="card__tag">
              {tag}
            </li>
          ))}
        </ul>

        {project.links ? (
          <div className="hero__actions" role="group" aria-label="Project links">
            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--secondary"
              >
                {link.label}
              </a>
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}
