import type { Metadata } from "next";
import { aboutPageContent } from "@/lib/content/about";
import { getTestimonials } from "@/lib/content/testimonials";
import { NowPastNext } from "@/components/about/NowPastNext";
import { CapabilitiesRack } from "@/components/about/CapabilitiesRack";
import { CvTable } from "@/components/about/CvTable";
import { ContactBlock } from "@/components/about/ContactBlock";
import { TestimonialStrip } from "@/components/testimonials/TestimonialStrip";
import { Reveal } from "@/components/chrome/Reveal";

export const metadata: Metadata = {
  title: "ABOUT + CONTACT",
  description: aboutPageContent.lede,
};

export default function AboutPage() {
  return (
    <section className="pagehead">
      <div className="wrap">
        <div className="about-head">
          <div>
            <p className="eyebrow">{aboutPageContent.eyebrow}</p>
            <h1 className="h1">
              {aboutPageContent.titleLine1}
              <br />
              <em>{aboutPageContent.titleLine2}</em>
            </h1>
            <p className="lede">{aboutPageContent.lede}</p>
          </div>
          <span className="logo-slot" aria-hidden="true">
            CC
          </span>
        </div>

        <Reveal>
          <NowPastNext />
        </Reveal>
        <Reveal>
          <CapabilitiesRack />
        </Reveal>
        <Reveal>
          <CvTable />
        </Reveal>
        <Reveal>
          <TestimonialStrip testimonials={getTestimonials()} />
        </Reveal>
        <Reveal>
          <ContactBlock />
        </Reveal>

        <div style={{ height: "clamp(46px, 7vw, 88px)" }} />
      </div>
    </section>
  );
}
