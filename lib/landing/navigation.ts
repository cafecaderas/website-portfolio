/**
 * Primary site navigation — internal routes for the V1 section set.
 */
export const navLinks = [
  { label: "HOME", href: "/" },
  { label: "PORTFOLIO", href: "/portfolio" },
  { label: "LAB", href: "/lab" },
  { label: "ABOUT", href: "/about" },
] as const;

export const navCta = {
  label: "CONTACT",
  href: "/contact",
} as const;
