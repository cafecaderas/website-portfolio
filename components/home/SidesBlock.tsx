"use client";

import { Scope } from "@/components/canvas/Scope";
import { Reveal } from "@/components/chrome/Reveal";
import { SpotlightGlow } from "@/components/chrome/SpotlightGlow";
import { onSpotlightMove } from "@/components/chrome/spotlight";
import { SectionFieldLoader } from "@/components/three/SectionFieldLoader";
import { sidesContent } from "@/lib/content/home";

/** One brand, two sides. Used once, on HOME only. */
export function SidesBlock() {
  const { eyebrow, a, b } = sidesContent;

  return (
    <Reveal>
      <section className="band">
        <div className="wrap">
          <p className="eyebrow">{eyebrow}</p>
          {/* One grid split down the middle into two hues — sound on the
              left, systems on the right, both derived from --phosphor. */}
          <div className="sides milled bezel">
            <SectionFieldLoader preset="sides" />
            <div className="sidecard group" onPointerMove={onSpotlightMove}>
              <SpotlightGlow />
              <span className="tag">
                <u>{a.tagLabel}</u> {a.tagSuffix}
              </span>
              <h3>{a.title}</h3>
              <p>{a.body}</p>
              <ul className="list">
                {a.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
              <div className="mini">
                <Scope amp={a.scopeAmp} />
              </div>
            </div>
            <div className="sidecard group" onPointerMove={onSpotlightMove}>
              <SpotlightGlow />
              <span className="tag">
                <u>{b.tagLabel}</u> {b.tagSuffix}
              </span>
              <h3>{b.title}</h3>
              <p>{b.body}</p>
              <ul className="list">
                {b.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
              <div className="mini">
                <Scope amp={b.scopeAmp} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
