"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { navCta, navLinks } from "@/lib/landing/navigation";
import { siteConfig } from "@/lib/landing/site";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleNavClick = useCallback(() => {
    setMenuOpen(false);
  }, []);

  const toggleMenu = useCallback(() => {
    setMenuOpen((open) => !open);
  }, []);

  return (
    <header
      className={`navbar${scrolled ? " navbar--scrolled" : ""}`}
    >
      <div className="navbar__inner landing-container">
        <Link href="/" className="navbar__logo" onClick={handleNavClick}>
          {siteConfig.name}
        </Link>

        <nav className="navbar__nav" aria-label="Primary">
          <ul className="navbar__links">
            {navLinks.map((link) => (
              <li key={`${link.label}-${link.href}`}>
                <Link href={link.href} className="navbar__link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link href={navCta.href} className="btn btn--primary btn--nav navbar__cta">
          {navCta.label}
        </Link>

        <button
          type="button"
          className="navbar__toggle"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={toggleMenu}
        >
          <span className="navbar__toggle-icon" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>

      <nav
        id="mobile-nav"
        className={`navbar__mobile${menuOpen ? " navbar__mobile--open" : ""}`}
        aria-label="Mobile"
        aria-hidden={!menuOpen}
      >
        <ul className="navbar__mobile-links">
          {navLinks.map((link) => (
            <li key={`${link.label}-${link.href}`}>
              <Link
                href={link.href}
                className="navbar__mobile-link"
                tabIndex={menuOpen ? undefined : -1}
                onClick={handleNavClick}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href={navCta.href}
          className="btn btn--primary btn--nav navbar__mobile-cta"
          tabIndex={menuOpen ? undefined : -1}
          onClick={handleNavClick}
        >
          {navCta.label}
        </Link>
      </nav>
    </header>
  );
}
