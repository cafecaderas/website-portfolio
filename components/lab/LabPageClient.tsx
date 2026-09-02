"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { SubTag } from "@/lib/content/types";
import type { IndexedProject } from "@/lib/content/projects";
import { labPageContent, labFilters } from "@/lib/content/lab";
import { NowPlayingBar } from "./NowPlayingBar";
import { LabModuleGrid } from "./LabModuleGrid";
import { Reveal } from "@/components/chrome/Reveal";

type FilterKey = SubTag | "all";

export interface LabPageClientProps {
  projects: IndexedProject[];
  liveMeta?: Record<string, string>;
}

export function LabPageClient({ projects, liveMeta }: LabPageClientProps) {
  const [active, setActive] = useState<FilterKey>("all");
  const shownCount =
    active === "all" ? projects.length : projects.filter((p) => p.core.tags?.includes(active)).length;

  return (
    <section className="pagehead">
      <div className="wrap">
        <p className="eyebrow">{labPageContent.eyebrow}</p>
        <h1 className="h1">
          {labPageContent.titleLine1}
          <br />
          <em>{labPageContent.titleLine2}</em>
        </h1>
        <p className="lede">{labPageContent.lede}</p>

        <div className="filters" role="group" aria-label="Filter lab by tag">
          {labFilters.map((f) => (
            <button key={f.key} type="button" aria-pressed={active === f.key} onClick={() => setActive(f.key)}>
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

        <NowPlayingBar />
        <Reveal>
          <div className="tablebox">
            <span className="tablebox-tag mono">
              ~/lab<span className="cursor">_</span>
            </span>
            <LabModuleGrid
              projects={projects}
              liveMeta={liveMeta}
              isHidden={(p) => active !== "all" && !p.core.tags?.includes(active)}
            />
          </div>
        </Reveal>

        <div style={{ height: "clamp(46px, 7vw, 88px)" }} />
      </div>
    </section>
  );
}
