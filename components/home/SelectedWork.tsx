import Link from "next/link";
import { projects } from "@/lib/content/projects";
import { selectedWorkContent } from "@/lib/content/home";
import { WorkRows } from "@/components/works/WorkRows";

export function SelectedWork() {
  const { eyebrow, title, ctaLabel, featuredCount } = selectedWorkContent;
  const featured = projects.filter((p) => p.section === "works").slice(0, featuredCount);

  return (
    <section className="band">
      <div className="wrap">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="h2">{title}</h2>
        <WorkRows projects={featured} />
        <div style={{ marginTop: 26 }}>
          <Link href="/works" className="btn">
            {ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
