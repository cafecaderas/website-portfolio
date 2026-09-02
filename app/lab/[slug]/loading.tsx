import { ProjectDetailLoading } from "@/components/projects/ProjectDetailLoading";

/** Overrides app/lab/loading.tsx — the index skeleton is wrong shape for a detail page. */
export default function LabDetailLoading() {
  return <ProjectDetailLoading />;
}
