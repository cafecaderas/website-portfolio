import type { Metadata } from "next";
import { Bebas_Neue, Inter, JetBrains_Mono, Pacifico, Playfair_Display } from "next/font/google";
import { MotionConfig } from "framer-motion";
import { siteConfig } from "@/lib/content/site";
import { Header } from "@/components/chrome/Header";
import { Footer } from "@/components/chrome/Footer";
import { PageTransition } from "@/components/chrome/PageTransition";
import { TweakBarLoader } from "@/components/tweaks/TweakBarLoader";
import "./globals.css";

// Five roles, five "leader of the category" picks. adjustFontFallback: false
// on all of them uniformly — some of these families have full metrics-override
// data bundled in this Next version and some don't, and disabling it avoids
// depending on which (see the "Failed to find font override values" warning
// this bit us with previously for a family that wasn't covered).
const displayFont = Bebas_Neue({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
});

const bodyFont = Inter({
  variable: "--font-body",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
});

const serifFont = Playfair_Display({
  variable: "--font-serif",
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
});

const machFont = JetBrains_Mono({
  variable: "--font-mach",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
});

const artisticFont = Pacifico({
  variable: "--font-artistic",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${displayFont.variable} ${bodyFont.variable} ${serifFont.variable} ${machFont.variable} ${artisticFont.variable}`}
    >
      <body>
        <MotionConfig reducedMotion="user">
          <Header />
          <main id="main-content" tabIndex={-1}>
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </MotionConfig>
        <TweakBarLoader />
      </body>
    </html>
  );
}
