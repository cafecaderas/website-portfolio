import type { Experiment } from "@/lib/lab/experiments";

const STATUS_LABEL: Record<Experiment["status"], string> = {
  "in-progress": "In Progress",
  complete: "Complete",
  idea: "Idea",
};

export function ExperimentCard({ experiment }: { experiment: Experiment }) {
  return (
    <div className="card">
      <h3 className="card__title">{experiment.title}</h3>
      <p className="card__summary">{experiment.summary}</p>
      <ul className="card__tags">
        <li className="card__tag">{STATUS_LABEL[experiment.status]}</li>
      </ul>
    </div>
  );
}
