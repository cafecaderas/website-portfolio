import { ExperimentGrid } from "@/components/lab";

export default function LabPage() {
  return (
    <main className="landing-main page-main">
      <section className="landing-container page-section">
        <h1 className="page-title">Lab</h1>
        <p className="page-intro">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Placeholder
          intro copy for the experimental lab index, pending real proof-of-
          concept entries.
        </p>
        <ExperimentGrid />
      </section>
    </main>
  );
}
