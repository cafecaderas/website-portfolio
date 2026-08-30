import { Hero } from "@/components/home/Hero";
import { Ticker } from "@/components/chrome/Ticker";
import { SidesBlock } from "@/components/home/SidesBlock";
import { SelectedWork } from "@/components/home/SelectedWork";
import { LabCurrently } from "@/components/home/LabCurrently";
import { AboutTeaser } from "@/components/home/AboutTeaser";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Ticker />
      <SidesBlock />
      <SelectedWork />
      <LabCurrently />
      <AboutTeaser />
    </>
  );
}
