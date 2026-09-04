import type { Metadata } from "next";
import { getWorkProjects } from "@/lib/content/projects";
import { WorksPageClient } from "@/components/works/WorksPageClient";
import { worksPageContent } from "@/lib/content/works";

export const metadata: Metadata = {
  title: "WORKS",
  description: worksPageContent.lede,
};

export default function WorksPage() {
  return <WorksPageClient projects={getWorkProjects()} />;
}
