"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, type PointerEvent, type ReactNode } from "react";

const SPRING = { stiffness: 300, damping: 20, mass: 0.5 };
/** Fraction of the raw cursor offset the button actually follows. */
const STRENGTH = 0.35;

/**
 * Wraps a single child (a hero CTA) and pulls it a few px toward the
 * cursor on hover, springing back on leave. A highlight moment for the
 * two primary Hero CTAs, not a global button behavior.
 */
export function MagneticButton({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING);
  const springY = useSpring(y, SPRING);

  const handleMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left - rect.width / 2) * STRENGTH);
    y.set((e.clientY - rect.top - rect.height / 2) * STRENGTH);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: springX, y: springY, display: "inline-flex" }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {children}
    </motion.div>
  );
}
