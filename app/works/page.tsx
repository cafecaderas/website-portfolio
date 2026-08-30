import { projects } from "@/lib/content/projects";
import { WorksPageClient } from "@/components/works/WorksPageClient";

export default function WorksPage() {
  const works = projects.filter((p) => p.section === "works");
  return <WorksPageClient projects={works} />;
}
