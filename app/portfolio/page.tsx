import { ProjectGrid } from "@/components/portfolio";

export default function PortfolioPage() {
  return (
    <main className="landing-main page-main">
      <section className="landing-container page-section">
        <h1 className="page-title">Portfolio</h1>
        <p className="page-intro">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Placeholder
          intro copy for the portfolio index, pending final content.
        </p>
        <ProjectGrid />
      </section>
    </main>
  );
}
