"use client";

import { Scope } from "@/components/canvas/Scope";
import { Reveal } from "@/components/chrome/Reveal";
import { SpotlightGlow } from "@/components/chrome/SpotlightGlow";
import { onSpotlightMove } from "@/components/chrome/spotlight";
import { sidesContent } from "@/lib/content/home";

/** One brand, two sides. Used once, on HOME only. */
export function SidesBlock() {
  const { eyebrow, a, b } = sidesContent;

  return (
    <Reveal>
      <section className="band">
        <div className="wrap">
          <p className="eyebrow">{eyebrow}</p>
          <div className="sides">
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
