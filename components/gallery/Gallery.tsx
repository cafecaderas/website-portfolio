"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { Header } from "@/components/chrome/Header";
import { Footer } from "@/components/chrome/Footer";
import { Ticker } from "@/components/chrome/Ticker";
import { SignalToggle } from "@/components/chrome/SignalToggle";
import { PlaceholderImage } from "@/components/chrome/PlaceholderImage";
import { SpotlightGlow } from "@/components/chrome/SpotlightGlow";
import { onSpotlightMove } from "@/components/chrome/spotlight";
import { Reveal } from "@/components/chrome/Reveal";
import { MagneticButton } from "@/components/chrome/MagneticButton";
import { Scope } from "@/components/canvas/Scope";
import { SidesBlock } from "@/components/home/SidesBlock";
import { SelectedWork } from "@/components/home/SelectedWork";
import { LabCurrently } from "@/components/home/LabCurrently";
import { AboutTeaser } from "@/components/home/AboutTeaser";
import { NowPastNext } from "@/components/about/NowPastNext";
import { CapabilitiesRack } from "@/components/about/CapabilitiesRack";
import { CvTable } from "@/components/about/CvTable";
import { ContactBlock } from "@/components/about/ContactBlock";
import { WorkRows } from "@/components/works/WorkRows";
import { FeaturedCaseStudy } from "@/components/works/FeaturedCaseStudy";
import { NowPlayingBar } from "@/components/lab/NowPlayingBar";
import { LabModuleGrid } from "@/components/lab/LabModuleGrid";
import { getLabProjects, getWorkProjects } from "@/lib/content/projects";

/** The two heaviest live modules (WebGL + its own rAF/drag loop) — own chunk. */
const LiveSignalSection = dynamic(
  () => import("./LiveSignalSection").then((m) => m.LiveSignalSection),
  {
    ssr: false,
    loading: () => (
      <p className="mono" style={{ padding: "20px 0", color: "var(--steel-faint)", fontSize: 11 }}>
        LOADING SHADER + TRANSPORT…
      </p>
    ),
  },
);

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="band">
      <div className="wrap">
        <p className="eyebrow">{title}</p>
        {children}
      </div>
    </section>
  );
}

function Card({
  name,
  path,
  pad = true,
  frame = false,
  children,
}: {
  name: string;
  path: string;
  pad?: boolean;
  frame?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="gallery-card">
      <div className="gallery-card-hd">
        <strong>{name}</strong>
        <span>{path}</span>
      </div>
      <div className={`gallery-card-body${pad ? "" : " pad-0"}`}>
        {frame ? <div className="gallery-frame">{children}</div> : children}
      </div>
    </div>
  );
}

/**
 * Every UI module rendered in isolation with real content from lib/content/
 * — the same data the live pages use, per the "no lorem ipsum" rule in
 * AGENTS.md. Organized by the same domain folders as components/ itself,
 * so this doubles as a map of that tree.
 */
export function Gallery() {
  // Client Component reading these at module scope — harmless while these
  // accessors stay synchronous. If they ever become async CMS fetches, this
  // needs to move server-side and come in as props (see WorksPageClient).
  const works = getWorkProjects();
  const lab = getLabProjects();

  return (
    <>
      <section className="pagehead">
        <div className="wrap">
          <p className="eyebrow">DEV — COMPONENT GALLERY</p>
          <h1 className="h1">
            EVERY MODULE,
            <br />
            <em>ISOLATED.</em>
          </h1>
          <p className="lede">
            Dev-only, gated the same way as the Tweak Bar (top-right, this same build) — a
            production build 404s this route instead of just hiding it. Every list, table
            row, and image below is pulled from lib/content/, not placeholder text.
          </p>
        </div>
      </section>

      <Section title="CHROME — SITE-WIDE UI">
        <Card name="Header" path="components/chrome/Header.tsx" pad={false} frame>
          <Header />
        </Card>
        <Card name="Footer" path="components/chrome/Footer.tsx" pad={false}>
          <Footer />
        </Card>
        <Card name="Ticker" path="components/chrome/Ticker.tsx" pad={false}>
          <Ticker />
        </Card>
        <Card name="SignalToggle" path="components/chrome/SignalToggle.tsx">
          <p className="mono" style={{ fontSize: 11, color: "var(--steel-faint)", marginBottom: 14 }}>
            Click SIGNAL — real Web Audio, not a mock.
          </p>
          <SignalToggle />
        </Card>
        <Card name="Shared atoms" path="app/globals.css — .btn / .chip / .led-dot">
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <button type="button" className="btn">
              BUTTON
            </button>
            <button type="button" className="btn solid">
              BUTTON — SOLID
            </button>
            <span className="chip">CHIP</span>
            <span className="chip live">
              <span className="led-dot animate__animated animate__pulse animate__infinite" />
              CHIP — LIVE
            </span>
            <span className="led-dot animate__animated animate__pulse animate__infinite" />
          </div>
        </Card>
        <Card name="MagneticButton" path="components/chrome/MagneticButton.tsx">
          <p className="mono" style={{ fontSize: 11, color: "var(--steel-faint)", marginBottom: 14 }}>
            Hover — a highlight for the two Hero CTAs only, not a global button behavior.
          </p>
          <MagneticButton>
            <span className="btn solid">FOLLOWS THE CURSOR</span>
          </MagneticButton>
        </Card>
        <Card name="SpotlightGlow" path="components/chrome/SpotlightGlow.tsx + spotlight.ts">
          <div
            className="group gallery-frame"
            style={{ height: 110, background: "var(--tape-2)", border: "1px solid var(--rule)" }}
            onPointerMove={onSpotlightMove}
          >
            <SpotlightGlow />
            <p className="mono" style={{ padding: 16, position: "relative" }}>
              Hover anywhere in this box
            </p>
          </div>
        </Card>
        <Card name="Reveal" path="components/chrome/Reveal.tsx">
          <Reveal>
            <p className="mono" style={{ color: "var(--steel-faint)" }}>
              Fades + slides in on first scroll into view — reload and scroll to see it fire.
            </p>
          </Reveal>
        </Card>
        <Card name="PlaceholderImage" path="components/chrome/PlaceholderImage.tsx">
          <div style={{ width: 200, height: 120, position: "relative" }}>
            <PlaceholderImage
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=200&q=70"
              alt=""
              sizes="200px"
            />
          </div>
        </Card>
        <p className="mono" style={{ fontSize: 11, color: "var(--steel-faint)" }}>
          PageTransition (route fades), plus ScrollProgress + HeaderSignal (both inside the
          Header demo above), aren&rsquo;t reproducible as static demos — see them live on the
          real site.
        </p>
      </Section>

      <Section title="CANVAS &amp; SIGNAL ENGINE">
        <div className="gallery-scope-row" style={{ marginBottom: 22 }}>
          <div>
            <p className="mono" style={{ fontSize: 10, color: "var(--steel-faint)", marginBottom: 6 }}>
              Scope — mode=&quot;wave&quot;
            </p>
            <div className="gallery-scope">
              <Scope mode="wave" />
            </div>
          </div>
          <div>
            <p className="mono" style={{ fontSize: 10, color: "var(--steel-faint)", marginBottom: 6 }}>
              Scope — mode=&quot;bars&quot;
            </p>
            <div className="gallery-scope">
              <Scope mode="bars" />
            </div>
          </div>
        </div>
        <LiveSignalSection />
      </Section>

      <Section title="HOME — page compositions">
        <Card name="SidesBlock" path="components/home/SidesBlock.tsx" pad={false}>
          <SidesBlock />
        </Card>
        <Card name="SelectedWork" path="components/home/SelectedWork.tsx" pad={false}>
          <SelectedWork />
        </Card>
        <Card name="LabCurrently" path="components/home/LabCurrently.tsx" pad={false}>
          <LabCurrently />
        </Card>
        <Card name="AboutTeaser" path="components/home/AboutTeaser.tsx" pad={false}>
          <AboutTeaser />
        </Card>
      </Section>

      <Section title="ABOUT — page compositions">
        <Card name="NowPastNext" path="components/about/NowPastNext.tsx">
          <NowPastNext />
        </Card>
        <Card name="CapabilitiesRack" path="components/about/CapabilitiesRack.tsx">
          <CapabilitiesRack />
        </Card>
        <Card name="CvTable" path="components/about/CvTable.tsx">
          <CvTable />
        </Card>
        <Card name="ContactBlock" path="components/about/ContactBlock.tsx">
          <ContactBlock />
        </Card>
      </Section>

      <Section title="WORKS — page compositions">
        <Card name="WorkRows" path="components/works/WorkRows.tsx">
          <WorkRows projects={works.slice(0, 4)} />
        </Card>
        <Card name="FeaturedCaseStudy" path="components/works/FeaturedCaseStudy.tsx" pad={false}>
          <FeaturedCaseStudy />
        </Card>
      </Section>

      <Section title="LAB — page compositions">
        <Card name="NowPlayingBar" path="components/lab/NowPlayingBar.tsx" pad={false}>
          <NowPlayingBar />
        </Card>
        <Card name="LabModuleGrid" path="components/lab/LabModuleGrid.tsx">
          <LabModuleGrid projects={lab.slice(0, 3)} />
        </Card>
      </Section>

      <div style={{ height: "clamp(46px, 7vw, 88px)" }} />
    </>
  );
}
