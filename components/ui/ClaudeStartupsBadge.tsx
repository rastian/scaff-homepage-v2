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

// The official Claude mark, unmodified. Path from Simple Icons' "claude" icon
// (https://simpleicons.org/?q=claude), which tracks Anthropic's brand asset.
// Don't redraw or restyle it; only size, colour (clay) and whole-mark
// transforms are allowed.
const CLAUDE_MARK =
  "m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z";

// Entrance: the whole mark turns and scales in once; hover turns it a little.
function ClaudeSpark({ reduced, hover }: { reduced: boolean; hover: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className="size-[18px] shrink-0"
      aria-hidden
      initial={reduced ? false : { rotate: -120, scale: 0.4, opacity: 0 }}
      animate={{ rotate: hover && !reduced ? 45 : 0, scale: 1, opacity: 1 }}
      transition={reduced ? { duration: 0 } : { ...spring.soft, delay: hover ? 0 : 0.15 }}
    >
      <path d={CLAUDE_MARK} fill={CLAY} />
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
