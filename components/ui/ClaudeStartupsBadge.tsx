"use client";

import { motion, useAnimationControls } from "motion/react";
import { useEffect, useRef } from "react";
import { hero } from "@/content/home";
import { ease, spring } from "@/components/motion/tokens";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";

// Claude brand colours (Anthropic's palette). Brand exception to the page's
// no-orange rule: the Claude mark is always clay. The pill follows the theme
// (ivory on light, Claude's warm dark on dark) via --claude-* in globals.css.
const CLAY = "#D97757";

// Claude-style spark: irregular tapered rays with rounded tips. Deterministic
// lengths so server and client render the same path.
const RAYS = [1, 0.78, 0.92, 0.7, 0.96, 0.74, 0.88, 0.72, 1, 0.8, 0.9, 0.76];

function rayPath(i: number) {
  const a = ((i * 360) / RAYS.length - 90) * (Math.PI / 180);
  const len = 10.5 * RAYS[i];
  const w = 1.35;
  const nx = -Math.sin(a) * w;
  const ny = Math.cos(a) * w;
  const tipX = 12 + Math.cos(a) * len;
  const tipY = 12 + Math.sin(a) * len;
  // Base sits slightly off-centre so rays overlap into a solid core.
  const bx = 12 + Math.cos(a) * 1.2;
  const by = 12 + Math.sin(a) * 1.2;
  const r = 0.55;
  // Fixed precision: server and client float maths can differ in the last
  // digits, which would cause a hydration mismatch on `d`.
  const f = (n: number) => n.toFixed(2);
  return `M${f(bx + nx)} ${f(by + ny)} L${f(tipX + nx * r)} ${f(tipY + ny * r)} Q${f(tipX + Math.cos(a) * 0.9)} ${f(tipY + Math.sin(a) * 0.9)} ${f(tipX - nx * r)} ${f(tipY - ny * r)} L${f(bx - nx)} ${f(by - ny)} Z`;
}

function ClaudeSpark({ reduced, hover }: { reduced: boolean; hover: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className="size-5 shrink-0"
      aria-hidden
      initial={reduced ? false : { rotate: -120, scale: 0.4, opacity: 0 }}
      animate={{ rotate: hover && !reduced ? 45 : 0, scale: 1, opacity: 1 }}
      transition={reduced ? { duration: 0 } : { ...spring.soft, delay: hover ? 0 : 0.15 }}
    >
      <circle cx="12" cy="12" r="2.2" fill={CLAY} />
      {RAYS.map((_, i) => (
        <motion.path
          key={i}
          d={rayPath(i)}
          fill={CLAY}
          style={{ originX: "50%", originY: "50%", transformBox: "view-box" }}
          initial={reduced ? false : { scale: 0 }}
          animate={{ scale: 1 }}
          transition={reduced ? { duration: 0 } : { duration: 0.5, ease: ease.out, delay: 0.25 + i * 0.03 }}
        />
      ))}
    </motion.svg>
  );
}

// "Claude Startups · Member" badge above the hero headline. Built to read as
// an achievement: Claude's ivory + clay, a serif wordmark, and a one-time
// entrance (spark blooms, then a sheen sweeps the pill). Hover replays the
// sheen and turns the spark. Reduced motion: static.
export function ClaudeStartupsBadge({ hover }: { hover: boolean }) {
  const reduced = useReducedMotionSafe();
  const sheen = useAnimationControls();
  const entered = useRef(false);

  // Plays once on mount, then only when hover/focus begins (not on leave).
  useEffect(() => {
    if (reduced) return;
    if (entered.current && !hover) return;
    entered.current = true;
    sheen.set({ x: "-120%" });
    sheen.start({ x: "120%", transition: { duration: 1.1, ease: ease.spatial, delay: hover ? 0 : 0.9 } });
  }, [hover, reduced, sheen]);

  return (
    <span
      className="relative inline-flex h-11 items-center gap-2.5 overflow-hidden rounded-full pl-3.5 pr-1.5 shadow-[0_0_0_1px_rgb(217_119_87/0.35),0_10px_30px_-12px_rgb(217_119_87/0.55)] transition-shadow duration-[var(--dur-med)] group-hover:shadow-[0_0_0_1px_rgb(217_119_87/0.6),0_14px_36px_-12px_rgb(217_119_87/0.7)]"
      style={{ background: "var(--claude-bg)", color: "var(--claude-fg)" }}
    >
      <ClaudeSpark reduced={reduced} hover={hover} />
      <span className="flex items-baseline gap-1.5 whitespace-nowrap">
        <span className="font-serif text-[17px] leading-none tracking-[-0.01em]">Claude</span>
        <span className="text-[13px] font-medium leading-none">{hero.badge.label.replace(/^Claude\s*/, "")}</span>
      </span>
      <span
        className="inline-flex h-8 items-center gap-1.5 rounded-full px-2.5 font-mono text-[10.5px] font-medium uppercase tracking-[0.1em]"
        style={{ background: "var(--claude-chip)" }}
      >
        <svg viewBox="0 0 12 12" className="size-3" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
          <path d="m2.5 6.3 2.3 2.2L9.5 3.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {hero.badge.tag}
        <svg
          viewBox="0 0 12 12"
          className="size-2.5 transition-transform duration-[var(--dur-fast)] ease-out group-hover:translate-x-0.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M4.5 2.5 8 6l-3.5 3.5" />
        </svg>
      </span>
      {/* Sheen */}
      <motion.span
        aria-hidden
        initial={{ x: "-120%" }}
        animate={sheen}
        className="pointer-events-none absolute inset-y-0 left-0 w-full"
        style={{
          background: "linear-gradient(100deg, transparent 32%, rgb(217 119 87 / 0.22) 50%, transparent 68%)",
        }}
      />
    </span>
  );
}
