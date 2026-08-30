import { projects } from "@/lib/portfolio/projects";
import { ProjectCard } from "./ProjectCard";

export function ProjectGrid() {
  return (
    <div className="grid">
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </div>
  );
}
