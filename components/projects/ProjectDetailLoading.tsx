/** Shared skeleton for both /works/[slug] and /lab/[slug] — same layout, so one loading state covers both. */
export function ProjectDetailLoading() {
  return (
    <section className="pagehead">
      <div className="wrap">
        <p className="skeleton" style={{ width: 160, height: 11 }} aria-hidden="true" />
        <div className="skeleton" style={{ width: "60%", height: 48, marginTop: 14 }} aria-hidden="true" />
        <div className="skeleton" style={{ width: "80%", height: 16, marginTop: 18 }} aria-hidden="true" />
        <div className="skeleton" style={{ width: 90, height: 22, marginTop: 26 }} aria-hidden="true" />
        <div className="project-media skeleton" style={{ marginTop: 26, maxWidth: 720 }} aria-hidden="true" />
      </div>
    </section>
  );
}
