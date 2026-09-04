import type { Metadata } from "next";
import { getLabProjects } from "@/lib/content/projects";
import { LabPageClient } from "@/components/lab/LabPageClient";
import { labPageContent } from "@/lib/content/lab";

export const metadata: Metadata = {
  title: "LAB",
  description: labPageContent.lede,
};

export default function LabPage() {
  const lab = getLabProjects();
  return <LabPageClient projects={lab} />;
}
