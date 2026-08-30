"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { nav, siteConfig } from "@/lib/content/site";
import { HeaderSignal } from "./HeaderSignal";
import { ScrollProgress } from "./ScrollProgress";
import { SignalToggle } from "./SignalToggle";
import { SkipLink } from "./SkipLink";

export function Header() {
  const pathname = usePathname();

  return (
    <>
      <SkipLink />
      <header className="hdr">
        <div className="hdr-in">
          <Link href="/" className="logo">
            {siteConfig.name}
            <sup>®</sup>
          </Link>
          <SignalToggle />
          <nav className="nav" aria-label="Primary">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="nav-link"
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="nav-underline"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
        <HeaderSignal />
        <ScrollProgress />
      </header>
    </>
  );
}
