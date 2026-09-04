import { labPageContent } from "@/lib/content/lab";

/**
 * Next wraps this whole route segment in Suspense for free just because
 * this file exists — LabPage itself is a plain synchronous Server
 * Component now (no data fetch to await), so this only fires on a
 * genuinely slow navigation. Reuses the real page's copy and layout
 * classes (.tablebox, .trow) so nothing shifts when the real content lands.
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

        <div className="tablebox" aria-hidden="true" style={{ marginTop: 26 }}>
          <span className="tablebox-tag mono">~/lab_</span>
          {Array.from({ length: 6 }, (_, i) => (
            <div className="trow" key={i}>
              <span className="skeleton" style={{ width: 60, height: 11 }} />
              <span className="skeleton" style={{ width: "70%", height: 16 }} />
              <span className="skeleton type" style={{ width: 50, height: 10 }} />
              <span className="skeleton year" style={{ width: 32, height: 10 }} />
              <span className="skeleton status" style={{ width: 70, height: 10 }} />
            </div>
          ))}
        </div>

        <div style={{ height: "clamp(46px, 7vw, 88px)" }} />
      </div>
    </section>
  );
}
