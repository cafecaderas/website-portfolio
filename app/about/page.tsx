import { NowPastNext } from "@/components/about/NowPastNext";
import { CvTable } from "@/components/about/CvTable";
import { ContactBlock } from "@/components/about/ContactBlock";

export default function AboutPage() {
  return (
    <section className="pagehead">
      <div className="wrap">
        <p className="eyebrow">ABOUT + CONTACT</p>
        <h1 className="h1">
          Cafe Caderas is
          <br />
          <em>a system, not a résumé.</em>
        </h1>
        <p className="lede">
          Creative technologist, designer and musician. I make websites and
          digital experiences for people who care how things feel — which
          usually means people who came from music, food, or somewhere else
          with a room tone.
        </p>

        <NowPastNext />
        <CvTable />
        <ContactBlock />

        <div style={{ height: "clamp(46px, 7vw, 88px)" }} />
      </div>
    </section>
  );
}
