import Link from "next/link";

const CELLS = [
  {
    k: "BUILDING",
    v: "A signal-routing tool that plays back in the browser",
    t: "RUNNING",
  },
  {
    k: "LEARNING",
    v: "TypeScript, properly this time — types before tricks",
    t: "IN PROGRESS",
  },
  {
    k: "EXPLORING",
    v: "Type that redraws itself from an audio signal",
    t: "WEIRD",
  },
] as const;

export function LabCurrently() {
  return (
    <section className="band">
      <div className="wrap">
        <p className="eyebrow">LAB — CURRENTLY</p>
        <div className="labstrip">
          {CELLS.map((cell) => (
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
            ENTER THE LAB
          </Link>
        </div>
      </div>
    </section>
  );
}
