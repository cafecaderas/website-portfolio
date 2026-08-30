import { Hero } from "./Hero";
import { Navbar } from "./Navbar";
import { SkipLink } from "./SkipLink";

/**
 * Root shell for the Home page. Portfolio/Lab/About/Contact live as
 * separate routes under app/ — see lib/landing/navigation.ts.
 */
export function LandingPage() {
  return (
    <>
      <SkipLink />
      <Navbar />
      <main id="main-content" className="landing-main" tabIndex={-1}>
        <Hero />
      </main>
    </>
  );
}
