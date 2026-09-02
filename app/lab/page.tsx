import { getLabProjects } from "@/lib/content/projects";
import { LabPageClient } from "@/components/lab/LabPageClient";
import { formatRelativeTime, getRepoLastPush } from "@/lib/github";

export default async function LabPage() {
  const lab = getLabProjects();

  const pushedAt = await getRepoLastPush("cafecaderas", "website-portfolio");
  const liveMeta = pushedAt ? { "this-site": `PUSHED ${formatRelativeTime(pushedAt)}` } : undefined;

  return <LabPageClient projects={lab} liveMeta={liveMeta} />;
}
