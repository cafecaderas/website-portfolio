import { Scope } from "@/components/canvas/Scope";

/** One brand, two sides. Used once, on HOME only. */
export function SidesBlock() {
  return (
    <section className="band">
      <div className="wrap">
        <p className="eyebrow">ONE BRAND · TWO SIDES</p>
        <div className="sides">
          <div className="sidecard">
            <span className="tag">
              <u>A-SIDE</u> — SOUND
            </span>
            <h3>Where it started</h3>
            <p>
              Ten years of tracking, mixing and playing records taught me the
              thing that actually transfers: how something feels in the
              first four seconds, and what to cut so the rest lands.
            </p>
            <ul className="list">
              <li>MIXING</li>
              <li>MASTERING</li>
              <li>LIVE SETS</li>
              <li>FIELD RECORDING</li>
            </ul>
            <div className="mini">
              <Scope amp={0.62} />
            </div>
          </div>
          <div className="sidecard">
            <span className="tag">
              <u>B-SIDE</u> — SYSTEMS
            </span>
            <h3>Where it&apos;s going</h3>
            <p>
              Now I build the tools and the interfaces — sites, prototypes,
              small strange software. Same ear, different signal path. The
              engineering is in service of the feeling, not the other way
              round.
            </p>
            <ul className="list">
              <li>WEBSITES</li>
              <li>DIGITAL EXPERIENCES</li>
              <li>CREATIVE DIRECTION</li>
              <li>PROTOTYPES</li>
            </ul>
            <div className="mini">
              <Scope amp={0.42} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
