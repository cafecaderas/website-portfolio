"use client";

import Link from "next/link";
import { heroContent } from "@/lib/content/home";
import { MagneticButton } from "@/components/chrome/MagneticButton";
import { onHeroColorMove } from "./heroColor";
import { ReactorLoader } from "@/components/three/ReactorLoader";
import { TapeTransport } from "./TapeTransport";

export function Hero() {
  const { metaLeft, metaRight, logotype, tagline, ctaPrimary, ctaSecondary } = heroContent;

  return (
    <section className="hero" onPointerMove={onHeroColorMove}>
      <ReactorLoader />
      <span className="hero-tune-hint mono">MOVE TO TUNE · CLICK TO PULSE</span>
      <div className="wrap">
        <div className="hero-meta">
          <div>
            {metaLeft.role}
            <br />
            <em>{metaLeft.tags}</em>
            <br />
            {metaLeft.location}
          </div>
          <div className="r">
            {metaRight.version}
            <br />
            {metaRight.aSide}
            <br />
            {metaRight.bSide}
            <br />
            <em>{metaRight.timestamp}</em>
          </div>
        </div>
      </div>

      <div className="arcwrap">
        <svg className="arc" viewBox="0 0 1200 250" role="img" aria-label={logotype}>
          <defs>
            <path id="tapeArc" d="M 40 214 Q 600 78 1160 214" />
          </defs>
          <text>
            <textPath
              href="#tapeArc"
              startOffset="50%"
              textAnchor="middle"
              textLength={1030}
              lengthAdjust="spacingAndGlyphs"
            >
              {logotype}
            </textPath>
          </text>
        </svg>
        <p className="hero-line">
          {tagline.before}
          <b>{tagline.emphasis}</b>
          {tagline.after}
        </p>
        <div className="hero-cta">
          <MagneticButton>
            <Link href={ctaPrimary.href} className="btn solid">
              {ctaPrimary.label}
            </Link>
          </MagneticButton>
          <MagneticButton>
            <Link href={ctaSecondary.href} className="btn">
              <span className="led-dot animate__animated animate__pulse animate__infinite" />
              {ctaSecondary.label}
            </Link>
          </MagneticButton>
        </div>
      </div>

      <TapeTransport />
    </section>
  );
}
