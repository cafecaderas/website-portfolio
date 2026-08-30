import Link from "next/link";
import { TapeTransport } from "./TapeTransport";

export function Hero() {
  return (
    <section className="hero">
      <div className="wrap">
        <div className="hero-meta">
          <div>
            CREATIVE TECHNOLOGIST
            <br />
            <em>DESIGNER · ENGINEER · DJ</em>
            <br />
            BOGOTÁ / REMOTE
          </div>
          <div className="r">
            SITE V0.1
            <br />
            aSide: Sound
            <br />
            bSide: Systems
            <br />
            <em>REC. 03:12AM</em>
          </div>
        </div>
      </div>

      <div className="arcwrap">
        <svg className="arc" viewBox="0 0 1200 250" role="img" aria-label="Cafe Caderas">
          <defs>
            <path id="tapeArc" d="M 40 214 Q 600 78 1160 214" />
          </defs>
          <text fontSize={118}>
            <textPath
              href="#tapeArc"
              startOffset="50%"
              textAnchor="middle"
              textLength={1030}
              lengthAdjust="spacingAndGlyphs"
            >
              CAFE CADERAS
            </textPath>
          </text>
        </svg>
        <p className="hero-line">
          BUILDING DIGITAL <b>+</b> VISUAL EXPERIENCES
        </p>
        <div className="hero-cta">
          <Link href="/works" className="btn solid">
            VIEW WORKS
          </Link>
          <Link href="/lab" className="btn">
            <span className="led-dot animate__animated animate__pulse animate__infinite" />
            ENTER THE LAB
          </Link>
        </div>
      </div>

      <TapeTransport />
    </section>
  );
}
