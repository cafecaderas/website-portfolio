import { projects } from "@/lib/content/projects";
import { labPageContent } from "@/lib/content/lab";
import { NowPlayingBar } from "@/components/lab/NowPlayingBar";
import { LabModuleGrid } from "@/components/lab/LabModuleGrid";

export default function LabPage() {
  const lab = projects.filter((p) => p.section === "lab");

  return (
    <section className="pagehead">
      <div className="wrap">
        <p className="eyebrow">{labPageContent.eyebrow}</p>
        <h1 className="h1">
          {labPageContent.titleLine1}
          <br />
          <em>{labPageContent.titleLine2}</em>
        </h1>
        <p className="lede">{labPageContent.lede}</p>

        <NowPlayingBar />
        <LabModuleGrid projects={lab} />

        <div style={{ height: "clamp(46px, 7vw, 88px)" }} />
      </div>
    </section>
  );
}
