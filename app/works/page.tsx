import { getWorkProjects } from "@/lib/content/projects";
import { WorksPageClient } from "@/components/works/WorksPageClient";

export default function WorksPage() {
  return <WorksPageClient projects={getWorkProjects()} />;
}
