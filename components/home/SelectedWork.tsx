import Link from "next/link";
import { projects } from "@/lib/content/projects";
import { WorkRows } from "@/components/works/WorkRows";

export function SelectedWork() {
  const featured = projects.filter((p) => p.section === "works").slice(0, 3);

  return (
    <section className="band">
      <div className="wrap">
        <p className="eyebrow">SELECTED WORK</p>
        <h2 className="h2">Things I built that shipped.</h2>
        <WorkRows projects={featured} />
        <div style={{ marginTop: 26 }}>
          <Link href="/works" className="btn">
            ALL WORKS →
          </Link>
        </div>
      </div>
    </section>
  );
}
