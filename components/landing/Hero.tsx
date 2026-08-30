import Link from "next/link";
import { AnimateIn } from "./AnimateIn";

/**
 * Placeholder copy — real headline/tagline/CTAs TBD in the design Q&A.
 */
export function Hero() {
  return (
    <section
      id="hero"
      className="hero landing-section"
      aria-labelledby="hero-heading"
    >
      <div className="hero__background" aria-hidden="true" />

      <div className="hero__content landing-container">
        <AnimateIn variant="fade-in" delay={0}>
          <h1 id="hero-heading" className="hero__headline">
            Lorem Ipsum Dolor Sit
          </h1>
        </AnimateIn>

        <AnimateIn variant="fade-in" delay={120}>
          <p className="hero__description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit —
            placeholder tagline pending final copy.
          </p>
        </AnimateIn>

        <AnimateIn variant="fade-in" delay={240}>
          <div className="hero__actions" role="group" aria-label="Call to action">
            <Link href="/portfolio" className="btn btn--primary">
              VIEW PORTFOLIO
            </Link>

            <Link href="/lab" className="btn btn--secondary">
              EXPLORE LAB
            </Link>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
