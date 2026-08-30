import Link from "next/link";

export function AboutTeaser() {
  return (
    <section className="band">
      <div className="wrap aboutgrid">
        <div>
          <p className="eyebrow">ABOUT</p>
          <p className="statement">
            I came up making records and stayed for the signal path. Now I
            build the things people <em>actually use</em> — with the same
            ear.
          </p>
        </div>
        <div style={{ paddingTop: 6 }}>
          <p className="lede" style={{ fontSize: "14.5px" }}>
            Available for websites, digital experiences and creative
            direction. Currently taking on two projects for the back half of
            2026.
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
            <Link href="/about" className="btn">
              READ THE CV
            </Link>
            <Link href="/about" className="btn solid">
              GET IN TOUCH
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
