import Link from "next/link";
import { getWorkProjects } from "@/lib/content/projects";
import { selectedWorkContent } from "@/lib/content/home";
import { WorkRows } from "@/components/works/WorkRows";
import { Reveal } from "@/components/chrome/Reveal";
import { SectionFieldLoader } from "@/components/three/SectionFieldLoader";

export function SelectedWork() {
  const { eyebrow, title, ctaLabel, featuredCount } = selectedWorkContent;
  const featured = getWorkProjects().slice(0, featuredCount);

  return (
    <Reveal>
      <section className="band band--field">
        <SectionFieldLoader preset="work" />
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
    </Reveal>
  );
}
