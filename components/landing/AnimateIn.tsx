"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(callback: () => void) {
  const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );
}

export type AnimationVariant = "fade-up" | "fade-in" | "fade-down";

export interface AnimateInProps {
  children: ReactNode;
  variant?: AnimationVariant;
  /** Delay in milliseconds before the animation starts. */
  delay?: number;
  className?: string;
  as?: ElementType;
}

export function AnimateIn({
  children,
  variant = "fade-up",
  delay = 0,
  className = "",
  as: Component = "div",
  ...rest
}: AnimateInProps & Record<string, unknown>) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -4% 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  const isVisible = visible || prefersReducedMotion;

  const classes = [
    "animate-in",
    `animate-in--${variant}`,
    isVisible ? "animate-in--visible" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component
      ref={ref}
      className={classes}
      style={{ "--animate-delay": `${delay}ms` } as CSSProperties}
      {...rest}
    >
      {children}
    </Component>
  );
}
