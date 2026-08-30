import type { Project } from "@/lib/content/types";

const CATEGORY_LABEL: Record<string, string> = {
  code: "CODE",
  dj: "DJ",
  audio: "AUDIO",
  photo: "PHOTO",
  proto: "PROTO",
};

/**
 * 22 segments, varying heights (deterministic — no randomness, so this
 * renders identically on server and client). Lit segments are steel;
 * only the top two are phosphor with a glow, which is what keeps
 * green rare while still reading as gear.
 */
function Meter({ level }: { level: number }) {
  const n = 22;
  const bars = Array.from({ length: n }, (_, i) => {
    const f = i / n;
    const height = 28 + Math.abs(Math.sin(i * 1.9)) * 62;
    let className: string | undefined;
    if (f < level) {
      className = level - f < 2 / n ? "pk" : "on";
    }
    return <i key={i} className={className} style={{ height: `${height}%` }} />;
  });
  return <div className="meter">{bars}</div>;
}

export function LabModuleGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="labgrid">
      {projects.map((project) => (
        <article className="mod" key={project.slug}>
          <div className="mod-hd">
            <span className="id mono">{project.index}</span>
            <span className="fm">{CATEGORY_LABEL[project.category] ?? project.category.toUpperCase()}</span>
          </div>
          <div className="mod-body">
            <h3>{project.title}</h3>
            <p>{project.summary}</p>
            <Meter level={project.level ?? 0} />
            <div className="mod-ft">
              <span>{project.meta}</span>
              <span>{project.status}</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
