import { MotionConfig } from "motion/react";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";

// Frame for every page that isn't the homepage: the same Nav and Footer, the
// same reduced-motion contract, and room under the fixed header.
export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <Nav />
      <main id="main">{children}</main>
      <Footer />
    </MotionConfig>
  );
}
