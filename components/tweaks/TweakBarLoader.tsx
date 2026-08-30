"use client";

import dynamic from "next/dynamic";

/**
 * Splits the Tweak Bar (and everything it imports — schema, color
 * utils, the panel itself) into its own chunk, fetched only if it
 * actually mounts. Combined with the dev-only gate below, this means
 * a production visitor's browser never requests this code at all —
 * not just that it doesn't render.
 */
const TweakBar = dynamic(() => import("./TweakBar").then((m) => m.TweakBar), { ssr: false });

export function TweakBarLoader() {
  if (process.env.NODE_ENV !== "development") return null;
  return <TweakBar />;
}
