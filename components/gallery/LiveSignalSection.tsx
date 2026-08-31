"use client";

import { Reactor } from "@/components/three/Reactor";
import { TapeTransport } from "@/components/home/TapeTransport";
import { SectionFieldLoader } from "@/components/three/SectionFieldLoader";
import { FIELD_PRESETS, type FieldPresetName } from "@/components/three/presets";

/**
 * The two heaviest live modules — the R3F reactor (three + postprocessing,
 * its own WebGL context) and TapeTransport's rAF loop + drag physics. Split
 * into its own chunk (see Gallery.tsx's dynamic import) so opening the
 * gallery doesn't pay for three.js before anything else has even painted.
 */
export function LiveSignalSection() {
  return (
    <>
      <div className="gallery-card">
        <div className="gallery-card-hd">
          <strong>Reactor</strong>
          <span>components/three/Reactor.tsx</span>
        </div>
        <div className="gallery-card-body pad-0">
          <div className="gallery-frame" style={{ height: 340 }}>
            <Reactor />
          </div>
        </div>
      </div>

      <div className="gallery-card">
        <div className="gallery-card-hd">
          <strong>TapeTransport</strong>
          <span>components/home/TapeTransport/index.tsx</span>
        </div>
        <div className="gallery-card-body pad-0">
          <div className="gallery-frame">
            <TapeTransport />
          </div>
        </div>
      </div>

      <div className="gallery-card">
        <div className="gallery-card-hd">
          <strong>SectionField — every preset</strong>
          <span>components/three/presets.ts</span>
        </div>
        <div className="gallery-card-body">
          <p className="mono" style={{ fontSize: 11, color: "var(--steel-faint)", marginBottom: 16 }}>
            Move the cursor across each one. Every knob lives in presets.ts — `lab` and `works`
            are defined and ready but not mounted on those pages yet.
          </p>
          <div className="field-specimens">
            {(Object.keys(FIELD_PRESETS) as FieldPresetName[]).map((name) => {
              const p = FIELD_PRESETS[name];
              return (
                <div key={name}>
                  <div className="field-specimen">
                    <SectionFieldLoader preset={name} />
                  </div>
                  <p className="mono field-specimen-label">
                    {name} · {p.mode} · density {p.density} · band {p.band}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
