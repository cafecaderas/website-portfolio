import { projects } from "@/lib/content/projects";
import { NowPlayingBar } from "@/components/lab/NowPlayingBar";
import { LabModuleGrid } from "@/components/lab/LabModuleGrid";

export default function LabPage() {
  const lab = projects.filter((p) => p.section === "lab");

  return (
    <section className="pagehead">
      <div className="wrap">
        <p className="eyebrow">LAB — EXPERIMENTS</p>
        <h1 className="h1">
          This is how
          <br />
          <em>I think.</em>
        </h1>
        <p className="lede">
          Unfinished on purpose. Music, photography, audio tools, code
          sketches and prototypes — the things that feed the work but
          aren&apos;t for sale. Some of it works. Some of it is just loud.
        </p>

        <NowPlayingBar />
        <LabModuleGrid projects={lab} />

        <div style={{ height: "clamp(46px, 7vw, 88px)" }} />
      </div>
    </section>
  );
}
