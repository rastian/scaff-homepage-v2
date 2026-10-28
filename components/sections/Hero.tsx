"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { hero } from "@/content/home";
import { WordReveal } from "@/components/motion/Reveal";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { DownloadButton, SecondaryDownload, counterpartOf, usePlatform } from "@/components/ui/DownloadButton";
import { ClaudeStartupsBadge } from "@/components/ui/ClaudeStartupsBadge";
import { HeroDemo } from "./HeroDemo";

// The entrance runs in CSS (.animate-fade-up, like WordReveal's word-rise), so
// it starts at first paint from the server HTML instead of waiting for hydration.
const delay = (s: number) => ({ animationDelay: `${s}s` });

export function Hero() {
  const reduced = useReducedMotionSafe();
  const demoRef = useRef<HTMLDivElement>(null);
  const [badgeHover, setBadgeHover] = useState(false);
  // The secondary button offers the other platform, so the meta line skips it.
  const counterpart = counterpartOf(usePlatform());
  const secondaryExclude = counterpart ? [counterpart] : [];

  // The product window starts tipped back and flattens as it scrolls up.
  const { scrollYProgress } = useScroll({
    target: demoRef,
    offset: ["start end", "start 0.3"],
  });
  const rotateX = useTransform(scrollYProgress, [0, 1], [12, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);

  return (
    // overflow-x-clip guards the tilted window's edges.
    <section
      id="top"
      className="relative overflow-x-clip px-4 pb-24 pt-28 sm:px-6 sm:pb-32 sm:pt-32 [@media(max-height:820px)]:sm:pt-24"
    >
      {/* Faint canvas dots behind the window, fading out at the edges */}
      <div
        aria-hidden
        className="dot-grid pointer-events-none absolute inset-x-0 top-[38%] bottom-0 overflow-hidden opacity-70 [mask-image:radial-gradient(ellipse_60%_55%_at_50%_45%,black,transparent)]"
      />

      <div className="relative mx-auto max-w-6xl text-center">
        <a
          href={hero.badge.href}
          target="_blank"
          rel="noopener noreferrer"
          style={delay(0)}
          onPointerEnter={() => setBadgeHover(true)}
          onPointerLeave={() => setBadgeHover(false)}
          onFocus={() => setBadgeHover(true)}
          onBlur={() => setBadgeHover(false)}
          className="animate-fade-up group relative inline-flex rounded-full transition-transform duration-[var(--dur-fast)] ease-out hover:-translate-y-px active:translate-y-0 active:scale-[0.98]"
        >
          <span className="sr-only">
            Scaff is a {hero.badge.label} {hero.badge.tag} (opens in a new tab)
          </span>
          <span aria-hidden>
            <ClaudeStartupsBadge hover={badgeHover} />
          </span>
        </a>

        <h1 className="mx-auto mt-10 max-w-4xl text-balance font-serif text-[clamp(2.4rem,6vw,4.5rem)] [@media(max-height:820px)]:sm:text-[clamp(2.4rem,5.4vw,4rem)] font-medium leading-[1.04] tracking-[-0.02em] text-fg">
          {/* WordReveal labels a generic span, which many screen readers skip,
            so the heading's accessible text is this sr-only copy. */}
          <span className="sr-only">
            {hero.titleA} {hero.titleB}
          </span>
          <span aria-hidden className="block">
            <WordReveal text={hero.titleA} className="block" delay={0.05} />
          </span>
          <span aria-hidden className="block">
            <WordReveal
              text={hero.titleB}
              className="block"
              delay={0.3}
              highlight={{ word: hero.titleBrand, className: "text-accent" }}
            />
          </span>
        </h1>

        <p
          style={delay(0.5)}
          className="animate-fade-up mx-auto mt-8 max-w-xl text-pretty text-[17px] leading-relaxed text-fg-muted sm:text-[18px]"
        >
          {hero.sub}
        </p>

        <div className="animate-fade-up" style={delay(0.62)}>
          <div
            id="hero-cta"
            className="mt-10 flex flex-wrap items-center justify-center gap-x-2 gap-y-3 [&_p]:order-3 [&_p]:mt-2 [&_p]:basis-full"
          >
            {/* `contents!` lets the button and its meta line join this row,
              so the two CTAs sit side by side and the line spans below. */}
            <DownloadButton size="lg" className="contents!" exclude={secondaryExclude} />
            <SecondaryDownload className="order-2" />
          </div>
        </div>
      </div>

      <div
        ref={demoRef}
        className="relative mx-auto mt-12 max-w-6xl sm:mt-12 [@media(max-height:820px)]:sm:mt-9 [perspective:1800px]"
      >
        <div className="animate-fade-up" style={{ ...delay(0.7), animationDuration: "1s" }}>
          <motion.div
            style={
              reduced
                ? undefined
                : { rotateX, scale, transformOrigin: "50% 0%" }
            }
          >
            <HeroDemo />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
