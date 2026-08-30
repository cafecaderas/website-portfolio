import { experiments } from "@/lib/lab/experiments";
import { ExperimentCard } from "./ExperimentCard";

export function ExperimentGrid() {
  return (
    <div className="grid">
      {experiments.map((experiment) => (
        <ExperimentCard key={experiment.slug} experiment={experiment} />
      ))}
    </div>
  );
}
