import type { Metadata } from "next";
import { getLabProjects } from "@/lib/content/projects";
import { LabPageClient } from "@/components/lab/LabPageClient";
import { formatRelativeTime, getRepoLastPush } from "@/lib/github";
import { labPageContent } from "@/lib/content/lab";

export const metadata: Metadata = {
  title: "LAB",
  description: labPageContent.lede,
};

export default async function LabPage() {
  const lab = getLabProjects();

  const pushedAt = await getRepoLastPush("cafecaderas", "website-portfolio");
  const liveMeta = pushedAt ? { "this-site": `PUSHED ${formatRelativeTime(pushedAt)}` } : undefined;

  return <LabPageClient projects={lab} liveMeta={liveMeta} />;
}
