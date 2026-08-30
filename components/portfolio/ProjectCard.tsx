import Link from "next/link";
import type { Project } from "@/lib/portfolio/projects";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/portfolio/${project.slug}`} className="card">
      <h3 className="card__title">{project.title}</h3>
      <p className="card__summary">{project.summary}</p>
      <ul className="card__tags">
        {project.tags.map((tag) => (
          <li key={tag} className="card__tag">
            {tag}
          </li>
        ))}
      </ul>
    </Link>
  );
}
