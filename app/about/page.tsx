import { aboutPageContent } from "@/lib/content/about";
import { NowPastNext } from "@/components/about/NowPastNext";
import { CvTable } from "@/components/about/CvTable";
import { ContactBlock } from "@/components/about/ContactBlock";

export default function AboutPage() {
  return (
    <section className="pagehead">
      <div className="wrap">
        <p className="eyebrow">{aboutPageContent.eyebrow}</p>
        <h1 className="h1">
          {aboutPageContent.titleLine1}
          <br />
          <em>{aboutPageContent.titleLine2}</em>
        </h1>
        <p className="lede">{aboutPageContent.lede}</p>

        <NowPastNext />
        <CvTable />
        <ContactBlock />

        <div style={{ height: "clamp(46px, 7vw, 88px)" }} />
      </div>
    </section>
  );
}
