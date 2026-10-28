"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { dur, ease } from "./tokens";
import { useReducedMotionSafe } from "./useReducedMotionSafe";

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
  y?: number;
};

// Fades and lifts content in once as it enters the viewport. Opacity and y
// only (both composited); no filter, which would re-rasterize big subtrees.
// Reduced motion: opacity only, no movement.
export function Reveal({ delay = 0, y = 18, children, ...rest }: RevealProps) {
  const reduced = useReducedMotionSafe();
  return (
    <motion.div
      initial={{ opacity: 0, y: reduced ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: dur.slow * 1.6, ease: ease.out, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

// Splits a line into words that rise in sequence. Text stays in the DOM as
// one readable string for screen readers. A CSS animation (word-rise in
// globals.css), so the headline paints from the server HTML instead of
// waiting for hydration; the global reduced-motion rule makes it instant.
export function WordReveal({
  text,
  className,
  delay = 0,
  stagger = 0.06,
  as: Tag = "span",
  highlight,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: "span" | "div";
  // Colour one word (matched ignoring trailing punctuation), e.g. the brand name.
  highlight?: { word: string; className: string };
}) {
  const words = text.split(" ");
  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
          <span
            className={`inline-block ${highlight && w.replace(/[.,!?;:]+$/, "") === highlight.word ? highlight.className : ""}`}
            style={{
              animationName: "word-rise",
              animationDuration: "0.9s",
              animationTimingFunction: "var(--ease-out)",
              animationFillMode: "both",
              animationDelay: `${delay + i * stagger}s`,
            }}
          >
            {w}
            {i < words.length - 1 ? "\u00a0" : ""}
          </span>
        </span>
      ))}
    </Tag>
  );
}
