"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Project, ProjectCategory } from "@/lib/content/types";
import { WorkRows } from "./WorkRows";
import { FeaturedCaseStudy } from "./FeaturedCaseStudy";

type FilterKey = ProjectCategory | "all";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "ALL" },
  { key: "websites", label: "WEBSITES" },
  { key: "experiences", label: "DIGITAL EXPERIENCES" },
  { key: "direction", label: "CREATIVE DIRECTION" },
  { key: "visual", label: "VISUAL WORK" },
];

export function WorksPageClient({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<FilterKey>("all");
  const shownCount =
    active === "all" ? projects.length : projects.filter((p) => p.category === active).length;

  return (
    <>
      <section className="pagehead">
        <div className="wrap">
          <p className="eyebrow">WORKS — INDEX</p>
          <h1 className="h1">
            I build things.
            <br />
            <em>Here is the proof.</em>
          </h1>
          <p className="lede">
            Client and commissioned work: websites, digital experiences,
            creative direction, and visual work. Each entry opens a case
            study — the problem, the signal path, and what changed.
          </p>

          <div className="filters" role="group" aria-label="Filter works by category">
            {FILTERS.map((f) => (
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
          <FeaturedCaseStudy />
          <WorkRows
            projects={projects}
            isHidden={(p) => active !== "all" && p.category !== active}
            className="works-rows"
          />
        </div>
      </section>
    </>
  );
}
