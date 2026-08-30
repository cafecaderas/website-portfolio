import Link from "next/link";
import { aboutTeaserContent } from "@/lib/content/home";
import { Reveal } from "@/components/chrome/Reveal";

export function AboutTeaser() {
  const { eyebrow, statement, availability, ctaCv, ctaContact } = aboutTeaserContent;

  return (
    <Reveal>
      <section className="band">
        <div className="wrap aboutgrid">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <p className="statement">
              {statement.before}
              <em>{statement.emphasis}</em>
              {statement.after}
            </p>
          </div>
          <div style={{ paddingTop: 6 }}>
            <p className="lede" style={{ fontSize: "14.5px" }}>
              {availability}
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
              <Link href="/about" className="btn">
                {ctaCv}
              </Link>
              <Link href="/about" className="btn solid">
                {ctaContact}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
