import { MotionConfig } from "motion/react";
import { DemoPlaybackProvider, PlaybackToggle } from "@/components/motion/DemoPlayback";
import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Canvas } from "@/components/sections/Canvas";
import { Features } from "@/components/sections/Features";
import { Models } from "@/components/sections/Models";
import { Compare } from "@/components/sections/Compare";
import { GetStarted } from "@/components/sections/GetStarted";
import { Discover } from "@/components/sections/Discover";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    // reducedMotion="user": every motion transform (pins, layout, springs)
    // respects the OS setting, not only components that check it themselves.
    <MotionConfig reducedMotion="user">
      <DemoPlaybackProvider>
        <Nav />
        <main id="main">
          <Hero />
          <HowItWorks />
          <Canvas />
          <Features />
          <Models />
          <Compare />
          <GetStarted />
          <Discover />
          <Faq />
          <FinalCta />
        </main>
        <Footer />
        <PlaybackToggle />
      </DemoPlaybackProvider>
    </MotionConfig>
  );
}
