"use client";

import { motion, useScroll } from "framer-motion";

/**
 * Thin bar tracking page scroll position. Rendered as a normal-flow
 * sibling right after HeaderSignal inside the sticky .hdr — that way it
 * sits correctly below the header on every breakpoint (the header's
 * height isn't fixed; it wraps to multiple rows under 880px) without
 * hardcoding an offset.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return <motion.div className="h-0.5 w-full origin-left bg-rust-lit" style={{ scaleX: scrollYProgress }} />;
}
