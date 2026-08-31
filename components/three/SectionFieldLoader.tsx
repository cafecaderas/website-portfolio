"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { FieldPresetName } from "./presets";

const SectionField = dynamic(() => import("./SectionField").then((m) => m.SectionField), {
  ssr: false,
});

/**
 * Drop-in reactive backdrop. Renders an absolutely-positioned layer that
 * fills its nearest positioned ancestor, so the host section only needs
 * `position: relative`.
 *
 * Shares the three.js chunk with the Hero's reactor — mounting fields costs
 * no additional download on a page that already has one. Each field still
 * waits for its own section to scroll into view before mounting, and pauses
 * its frame loop (rather than tearing down the GL context) on the way out.
 */
export function SectionFieldLoader({ preset }: { preset: FieldPresetName }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setLoaded(true);
      },
      { rootMargin: "160px" },
    );

    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={hostRef} className="section-field" aria-hidden="true">
      {loaded && <SectionField preset={preset} hostRef={hostRef} active={visible} />}
    </div>
  );
}
