import { AboutHero } from "@/components/about/AboutHero";
import { Values } from "@/components/about/Values";
import { TechBlock } from "@/components/about/TechBlock";
import { AboutCTA } from "@/components/about/AboutCTA";

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <Values />
      <TechBlock />
      <AboutCTA />
    </>
  );
}
