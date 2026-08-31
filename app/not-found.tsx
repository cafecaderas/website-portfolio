import Link from "next/link";

/**
 * Renders for any unmatched URL, and wherever a page calls next/navigation's
 * notFound() — e.g. app/works/[slug]/page.tsx for an unknown slug.
 */
export default function NotFound() {
  return (
    <section className="pagehead">
      <div className="wrap">
        <p className="eyebrow">404</p>
        <h1 className="h1">
          NOTHING ON
          <br />
          <em>THIS FREQUENCY.</em>
        </h1>
        <p className="lede">Whatever you were tuning into isn&rsquo;t here. Try one of the real channels.</p>
        <div style={{ display: "flex", gap: 10, marginTop: 26, flexWrap: "wrap" }}>
          <Link href="/" className="btn solid">
            HOME
          </Link>
          <Link href="/works" className="btn">
            WORKS
          </Link>
          <Link href="/lab" className="btn">
            LAB
          </Link>
        </div>
      </div>
    </section>
  );
}
