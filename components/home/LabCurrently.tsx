import Link from "next/link";
import { labCurrentlyContent } from "@/lib/content/home";
import { Reveal } from "@/components/chrome/Reveal";

export function LabCurrently() {
  const { eyebrow, cells, ctaLabel } = labCurrentlyContent;

  return (
    <Reveal>
      <section className="band">
        <div className="wrap">
          <p className="eyebrow">{eyebrow}</p>
          <div className="labstrip">
            {cells.map((cell) => (
              <div className="labcell" key={cell.k}>
                <div className="k">{cell.k}</div>
                <div className="v">{cell.v}</div>
                <div className="t">
                  <span className="led-dot animate__animated animate__pulse animate__infinite" />
                  {cell.t}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 22 }}>
            <Link href="/lab" className="btn">
              <span className="led-dot animate__animated animate__pulse animate__infinite" />
              {ctaLabel}
            </Link>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
