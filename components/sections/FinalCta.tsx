"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { finalCta } from "@/content/home";
import { Accent } from "@/components/ui/SectionHeading";
import { DownloadButton } from "@/components/ui/DownloadButton";
import { Cursor } from "@/components/motion/Cursor";
import { NotePin } from "@/components/motion/NotePin";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { ease } from "@/components/motion/tokens";

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

export function FinalCta() {
  const reduced = useReducedMotionSafe();
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(1000);

  // Cursor travel distances scale with the panel so they stay inside it on phones.
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // 0 when the section enters from below, 1 once it's centred: scrubbed, not timed.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "center 55%"] });

  const reach = Math.min(width * 0.42, 440);
  // Roughly half the button's width: where the cursors land, relative to its centre.
  const half = Math.max(Math.min(width / 2 - 36, 158), 80);

  // "You" travels in from the lower left, "Scaff" from the upper right. The two
  // axes use different easing so the paths curve instead of sliding straight.
  const youX = useTransform(scrollYProgress, [0, 1], [-reach, 0], { ease: easeOutCubic });
  const youY = useTransform(scrollYProgress, [0, 1], [180, 0], { ease: easeInOutSine });
  const agentX = useTransform(scrollYProgress, [0.1, 1], [reach, 0], { ease: easeInOutSine });
  const agentY = useTransform(scrollYProgress, [0.1, 1], [-240, 0], { ease: easeOutCubic });

  // "Scaff" lands just past the button's right edge. On narrow panels there's
  // no room past that edge, so it rests above the button's right end instead,
  // clear of the label.
  const narrow = width / 2 - 96 < half + 10;
  const agentLeft = narrow ? half - 84 : half + 10;
  const agentTop = narrow ? -62 : -14;

  const [arrived, setArrived] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (v) => setArrived(v > 0.86));
  // Loading already scrolled past (anchor link, restored scroll) fires no change.
  useEffect(() => {
    const id = requestAnimationFrame(() => setArrived(scrollYProgress.get() > 0.86));
    return () => cancelAnimationFrame(id);
  }, [scrollYProgress]);
  const showPin = reduced || arrived;

  const lines = [
    { key: "a", node: finalCta.titleA },
    { key: "b", node: finalCta.titleB },
    { key: "c", node: <Accent>{finalCta.titleC}</Accent> },
  ];

  return (
    <section
      ref={sectionRef}
      id="final-cta"
      aria-labelledby="final-cta-title"
      className="relative px-4 sm:px-6 py-24 sm:py-32"
    >
      <div
        ref={panelRef}
        className="relative mx-auto max-w-7xl overflow-hidden rounded-[36px] border border-line bg-surface px-5 py-20 sm:px-10 sm:py-28 lg:py-36"
      >
        {/* Faint canvas behind the statement, fading out toward the edges */}
        <div
          aria-hidden
          className="dot-grid pointer-events-none absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
        />
        <BranchFrames />

        <div className="relative mx-auto max-w-5xl text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle">{finalCta.sub}</p>
          {/* whileInView sits on the heading, not the clipped lines: a line
              translated below its overflow-hidden mask never intersects, so
              it would never trigger. Variants cascade the stagger down. */}
          <motion.h2
            id="final-cta-title"
            className="mt-6 font-serif text-[clamp(2.25rem,5.4vw,4.25rem)] font-normal leading-[1.02] tracking-[-0.02em] text-fg"
            initial="hidden"
            whileInView="shown"
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            variants={{ hidden: {}, shown: { transition: { staggerChildren: 0.09 } } }}
          >
            {lines.map((line) => (
              <span key={line.key} className="block overflow-hidden pb-[0.14em] -mb-[0.14em] sm:whitespace-nowrap">
                <motion.span
                  className="block"
                  variants={{
                    hidden: reduced ? { opacity: 0 } : { y: "100%", opacity: 0 },
                    shown: { y: 0, opacity: 1 },
                  }}
                  transition={{ duration: 0.6, ease: ease.out }}
                >
                  {line.node}
                </motion.span>
              </span>
            ))}
          </motion.h2>

          <div className="relative mt-16 flex justify-center sm:mt-20">
            {/* Anchor sits at the button's vertical centre; cursors converge on it. */}
            <div aria-hidden className="pointer-events-none absolute left-1/2 top-[26px] z-20">
              {/* "You" lands beside the pin it just dropped; "Scaff" lands on the button. */}
              <div className="absolute" style={{ left: -half - 30, top: -54 }}>
                <Cursor tone="you" label={finalCta.cursors.you} x={reduced ? 0 : youX} y={reduced ? 0 : youY} />
              </div>
              <div className="absolute" style={{ left: agentLeft, top: agentTop }}>
                <Cursor tone="agent" label={finalCta.cursors.agent} x={reduced ? 0 : agentX} y={reduced ? 0 : agentY} />
              </div>
              <div className="absolute w-40" style={{ left: -half - 44, top: -98 }}>
                <AnimatePresence>
                  {showPin ? <NotePin key="pin" n={1} text={finalCta.pin} tone="you" className="left-0 top-0" /> : null}
                </AnimatePresence>
              </div>
            </div>

            <DownloadButton size="lg" className="relative z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}

// Two faint branch frames in the corners: the canvas the cursors came from.
function BranchFrames() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
      <div className="absolute -left-10 top-14 w-56 rotate-[-4deg] opacity-60">
        <p className="mb-1.5 font-mono text-[10px] text-fg-subtle">branch / editorial</p>
        <div className="h-36 rounded-xl border border-line-strong bg-ink/60 p-3">
          <div className="h-2 w-16 rounded-full bg-fg/10" />
          <div className="mt-3 h-12 rounded-lg bg-sky/10" />
          <div className="mt-2 h-2 w-24 rounded-full bg-fg/10" />
        </div>
      </div>
      <div className="absolute -right-8 bottom-12 w-60 rotate-[3deg] opacity-60">
        <p className="mb-1.5 font-mono text-[10px] text-fg-subtle">branch / soft-palette</p>
        <div className="h-40 rounded-xl border border-line-strong bg-ink/60 p-3">
          <div className="h-3 w-28 rounded-full bg-fg/15" />
          <div className="mt-2 h-2 w-20 rounded-full bg-fg/10" />
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="h-14 rounded-lg bg-blue/10" />
            <div className="h-14 rounded-lg bg-fg/[0.05]" />
          </div>
        </div>
      </div>
    </div>
  );
}
