"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

/**
 * three + R3F + postprocessing is by far the heaviest thing on the site, so
 * it gets its own chunk and is only requested once the hero is actually on
 * screen — a visitor who lands deep-linked elsewhere never downloads it.
 */
const Reactor = dynamic(() => import("./Reactor").then((m) => m.Reactor), { ssr: false });

export function ReactorLoader() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        // Latches on: once the chunk is fetched and the WebGL context is
        // live, scrolling away pauses the frame loop rather than tearing the
        // context down and paying to rebuild it on the way back.
        if (entry.isIntersecting) setLoaded(true);
      },
      { rootMargin: "120px" },
    );

    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={hostRef} className="reactor-host" aria-hidden="true">
      {loaded && <Reactor active={visible} />}
    </div>
  );
}
