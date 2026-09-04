"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { MainCategory } from "@/lib/content/types";
import type { IndexedProject } from "@/lib/content/projects";
import { worksPageContent, workFilters } from "@/lib/content/works";
import { WorksTable } from "./WorksTable";
import { FeaturedCaseStudy } from "./FeaturedCaseStudy";
import { Reveal } from "@/components/chrome/Reveal";
import { SpectrumBands } from "@/components/decor/SpectrumBands";
import { SignalPath } from "@/components/decor/SignalPath";
import { ChromaWall } from "@/components/decor/ChromaWall";

type FilterKey = MainCategory | "all";

export function WorksPageClient({ projects }: { projects: IndexedProject[] }) {
  const [active, setActive] = useState<FilterKey>("all");
  const shownCount =
    active === "all" ? projects.length : projects.filter((p) => p.core.category === active).length;

  return (
    <>
      <section className="pagehead">
        <div className="wrap">
          <p className="eyebrow">{worksPageContent.eyebrow}</p>
          <h1 className="h1">
            {worksPageContent.titleLine1}
            <br />
            <em>{worksPageContent.titleLine2}</em>
          </h1>
          <p className="lede">{worksPageContent.lede}</p>

          <div className="filters" role="group" aria-label="Filter works by category">
            {workFilters.map((f) => (
              <button
                key={f.key}
                type="button"
                aria-pressed={active === f.key}
                onClick={() => setActive(f.key)}
              >
                {active === f.key && (
                  <motion.span
                    layoutId="filter-pill"
                    className="filter-pill"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                {f.label}
              </button>
            ))}
            <span className="count mono">
              {String(shownCount).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </section>

      <section style={{ paddingBottom: "clamp(46px, 7vw, 88px)" }}>
        <div className="wrap">
          <Reveal>
            <WorksTable
              projects={projects}
              isHidden={(p) => active !== "all" && p.core.category !== active}
            />
          </Reveal>
          <Reveal>
            <div style={{ marginTop: 46 }}>
              <FeaturedCaseStudy />
            </div>
          </Reveal>

          <Reveal>
            <SpectrumBands />
          </Reveal>
          <Reveal>
            <SignalPath />
          </Reveal>
          <Reveal>
            <ChromaWall />
          </Reveal>
        </div>
      </section>
    </>
  );
}
