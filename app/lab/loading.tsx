import { labPageContent } from "@/lib/content/lab";

/**
 * Shown automatically while LabPage's `await getRepoLastPush(...)` is in
 * flight — Next wraps this route segment in Suspense for free because the
 * page component is async. Reuses the real page's copy and layout classes
 * (.nowbar, .labgrid, .mod) so nothing shifts when the real content lands.
 */
export default function LabLoading() {
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

        <div className="nowbar" aria-hidden="true">
          <div className="skeleton cover" style={{ width: 56, height: 56 }} />
          <div className="skeleton" style={{ width: 110, height: 12, margin: "0 16px" }} />
          <div className="skeleton" style={{ flex: 1, height: 24, minWidth: 120 }} />
          <div className="skeleton" style={{ width: 140, height: 10, marginRight: 16 }} />
        </div>

        <div className="labgrid" aria-hidden="true" style={{ marginTop: 26 }}>
          {Array.from({ length: 6 }, (_, i) => (
            <div className="mod" key={i}>
              <div className="mod-hd">
                <span className="skeleton" style={{ width: 36, height: 10 }} />
                <span className="skeleton" style={{ width: 48, height: 9 }} />
              </div>
              <div className="mod-body">
                <div className="skeleton" style={{ width: "70%", height: 16, marginBottom: 8 }} />
                <div className="skeleton" style={{ width: "100%", height: 40, marginBottom: 12 }} />
                <div className="meter">
                  {Array.from({ length: 22 }, (_, j) => (
                    <i key={j} style={{ height: `${28 + ((j * 37) % 62)}%` }} />
                  ))}
                </div>
                <div className="mod-ft">
                  <span className="skeleton" style={{ width: 60, height: 9 }} />
                  <span className="skeleton" style={{ width: 40, height: 9 }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ height: "clamp(46px, 7vw, 88px)" }} />
      </div>
    </section>
  );
}
