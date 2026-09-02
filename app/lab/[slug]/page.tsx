import { notFound } from "next/navigation";
import { getLabProjects } from "@/lib/content/projects";
import { ProjectDetail } from "@/components/projects/ProjectDetail";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function LabDetailPage({ params }: Props) {
  const { slug } = await params;
  const projects = getLabProjects();
  const project = projects.find((p) => p.core.slug === slug);

  if (!project) {
    notFound();
  }

  return <ProjectDetail project={project} collection={projects} basePath="/lab" sectionLabel="LAB" />;
}
