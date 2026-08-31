"use client";

import dynamic from "next/dynamic";

/**
 * Splits the whole gallery into its own chunk, same reasoning as
 * TweakBarLoader — production never requests this even if someone finds
 * the URL (the page-level NODE_ENV gate already 404s it first).
 */
const Gallery = dynamic(() => import("./Gallery").then((m) => m.Gallery), { ssr: false });

export function GalleryLoader() {
  return <Gallery />;
}
