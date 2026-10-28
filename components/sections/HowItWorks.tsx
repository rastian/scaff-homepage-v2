"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, MotionConfig, motion, useMotionValueEvent, useScroll } from "motion/react";
import { workflow } from "@/content/home";
import { AppWindow } from "@/components/ui/AppWindow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { NotePin } from "@/components/motion/NotePin";
import { useDemoActive } from "@/components/motion/DemoPlayback";
import { scrollToY } from "@/components/motion/SmoothScroll";
import { dur, ease, spring } from "@/components/motion/tokens";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";

type Step = (typeof workflow.steps)[number];
const STEPS = workflow.steps;
const COUNT = STEPS.length;
const IMG_SIZES = "(min-width: 1280px) 760px, (min-width: 768px) 58vw, 100vw";
// Scroll distance budget per step of the pinned track (container height = COUNT x this).
const STEP_VH = 65;
// In light theme the dark app screenshots sit in a dark inset so they read as embedded UI.
const SHOT_INSET = "[[data-theme=light]_&]:bg-[#1b1b1a] [[data-theme=light]_&]:p-1.5";
const SHOT_INNER = "[[data-theme=light]_&]:rounded-xl";

export function HowItWorks() {
  return (
    <section id="workflow" aria-labelledby="workflow-title" className="relative px-4 pb-16 pt-24 sm:px-6 sm:pt-32 md:pb-0">
      <div className="mx-auto max-w-7xl">
        <SectionHeading id="workflow-title" eyebrow={workflow.eyebrow} title={workflow.title[0]} muted={workflow.title[1]} />
        <PinnedStory />
        <StackedStory />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Desktop: pinned, scroll-scrubbed story                              */
/* ------------------------------------------------------------------ */

function PinnedStory() {
  const trackRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const reduced = useReducedMotionSafe();
  const [active, setActive] = useState(0);
  // Furthest step reached. Screenshots mount up to one step past it, so the
  // next step is preloaded while later ones wait until the reader gets close.
  const [reached, setReached] = useState(0);
  if (active > reached) setReached(active);
  // Window root: pauses the looping "checks" pulse offscreen / on hover / when paused globally.
  // One-shot overlay sequences are NOT gated on hover (the cursor often rests on the window
  // while wheel-scrolling); a global pause shows them in their final state instead.
  const { ref: demoRef, active: demoActive, paused, hoverProps } = useDemoActive<HTMLDivElement>();
  const final = reduced || paused;

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });
  const toIndex = (v: number) => Math.min(COUNT - 1, Math.max(0, Math.floor(v * COUNT)));
  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(toIndex(v)));
  // "change" only fires on scroll; sync once on mount for reloads that restore mid-section.
  useEffect(() => {
    const raf = requestAnimationFrame(() => setActive(toIndex(scrollYProgress.get())));
    return () => cancelAnimationFrame(raf);
  }, [scrollYProgress]);

  // Scroll so step i sits in the middle of its segment of the track.
  const goTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const scrollable = Math.max(0, el.offsetHeight - window.innerHeight);
    const target = top + scrollable * ((i + 0.5) / COUNT);
    const immediate = reduced || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scrollToY(target, { immediate });
  };

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    let next = -1;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = Math.min(COUNT - 1, i + 1);
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = Math.max(0, i - 1);
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = COUNT - 1;
    if (next === -1) return;
    e.preventDefault();
    buttonRefs.current[next]?.focus({ preventScroll: true });
    goTo(next);
  };

  const step = STEPS[active];

  return (
    <div ref={trackRef} className="relative mt-16 hidden md:block" style={{ height: `${COUNT * STEP_VH}vh` }}>
      <div className="sticky top-24 grid h-[calc(100svh-8rem)] max-h-[760px] min-h-[460px] grid-cols-[2fr_3fr] items-center gap-10 lg:gap-16">
        {/* Steps + progress rail */}
        <div className="relative">
          <div aria-hidden className="absolute bottom-5 left-[11px] top-5 w-px overflow-hidden bg-line">
            <motion.div className="h-full w-full origin-top bg-fg" style={{ scaleY: scrollYProgress }} />
          </div>
          <ol aria-label="How Scaff works, step by step" className="relative space-y-1">
            {STEPS.map((s, i) => {
              const isActive = i === active;
              const isPast = i < active;
              return (
                <li key={s.n} className="relative pl-10">
                  <span
                    aria-hidden
                    className={`absolute left-[6px] top-[22px] size-[11px] rounded-full border transition-[background-color,border-color,transform] duration-[var(--dur-med)] ${
                      isActive
                        ? "scale-110 border-blue bg-blue"
                        : isPast
                          ? "border-fg bg-fg"
                          : "border-line-strong bg-ink"
                    }`}
                  />
                  <h3>
                    <button
                      ref={(el) => {
                        buttonRefs.current[i] = el;
                      }}
                      type="button"
                      onClick={() => goTo(i)}
                      onKeyDown={(e) => onKeyDown(e, i)}
                      aria-current={isActive ? "step" : undefined}
                      aria-describedby={isActive ? `workflow-body-${s.n}` : undefined}
                      className={`group -ml-3 flex min-h-11 w-[calc(100%+0.75rem)] items-baseline gap-3 rounded-xl px-3 py-3 text-left transition-[color,background-color,transform] duration-[var(--dur-fast)] hover:bg-surface-2/60 active:scale-[0.99] ${
                        isActive ? "text-fg" : "text-fg-subtle hover:text-fg-muted"
                      }`}
                    >
                      <span className="font-mono text-[11px] tracking-[0.08em] tabular-nums">{s.n}</span>
                      <span className="text-balance font-serif text-[22px] font-normal leading-tight tracking-[-0.01em] lg:text-[26px]">
                        {s.title}
                      </span>
                    </button>
                  </h3>
                  <motion.div
                    id={`workflow-body-${s.n}`}
                    inert={!isActive}
                    aria-hidden={!isActive}
                    initial={false}
                    animate={isActive ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
                    transition={{
                      duration: reduced ? dur.fast : dur.slow,
                      ease: ease.out,
                    }}
                    className="overflow-hidden"
                  >
                    <p className="pb-4 pl-8 pr-2 text-pretty text-[15px] leading-relaxed text-fg-muted">{s.body}</p>
                  </motion.div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Product window */}
        <div ref={demoRef} {...hoverProps} className="min-w-0">
          <AppWindow
            title="Scaff"
            toolbar={
              <span className="font-mono text-[11px] tabular-nums text-fg-subtle" aria-hidden>
                {step.n} / {String(COUNT).padStart(2, "0")}
              </span>
            }
          >
            <div className={SHOT_INSET}>
              <div className={`@container relative aspect-[12/7] overflow-hidden bg-surface-2 ${SHOT_INNER}`}>
                {STEPS.map((s, i) => {
                  const on = i === active;
                  if (i > reached + 1) return null;
                  return (
                    <motion.div
                      key={s.n}
                      aria-hidden={!on}
                      className="absolute inset-0"
                      initial={false}
                      animate={{
                        opacity: on ? 1 : 0,
                        scale: on || reduced ? 1 : 1.025,
                      }}
                      transition={{ duration: dur.slow, ease: ease.out }}
                    >
                      <Image
                        src={s.image}
                        alt={s.alt}
                        width={2880}
                        height={1680}
                        sizes={IMG_SIZES}
                        fetchPriority={on ? undefined : "low"}
                        className="h-full w-full object-cover object-top"
                      />
                    </motion.div>
                  );
                })}
                <AnimatePresence>
                  <motion.div
                    key={step.n}
                    className="pointer-events-none absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: dur.fast } }}
                    transition={{ duration: dur.med }}
                  >
                    <Overlay index={active} final={final} pulse={demoActive && !final} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </AppWindow>
          <p className="sr-only" aria-live="polite">
            Step {step.n}: {step.title}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile: stacked steps, overlays in their final state                */
/* ------------------------------------------------------------------ */

function StackedStory() {
  return (
    <ol className="mt-12 space-y-16 md:hidden">
      {STEPS.map((s, i) => (
        <li key={s.n}>
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.08em] text-fg-subtle">{s.n}</p>
            <h3 className="mt-2 text-balance font-serif text-[28px] font-normal leading-[1.1] tracking-[-0.015em] text-fg">
              {s.title}
            </h3>
            <p className="mt-3 text-pretty text-[15px] leading-relaxed text-fg-muted">{s.body}</p>
          </Reveal>
          <Reveal delay={0.08} className="mt-6">
            <StepWindow step={s} index={i} />
          </Reveal>
        </li>
      ))}
    </ol>
  );
}

function StepWindow({ step, index }: { step: Step; index: number }) {
  return (
    <AppWindow title="Scaff" className="rounded-[16px]">
      <div className={SHOT_INSET}>
        <div className={`@container relative aspect-[12/7] overflow-hidden bg-surface-2 ${SHOT_INNER}`}>
          <Image
            src={step.image}
            alt={step.alt}
            width={2880}
            height={1680}
            sizes={IMG_SIZES}
            className="h-full w-full object-cover object-top"
          />
          <div className="pointer-events-none absolute inset-0">
            <Overlay index={index} final pulse={false} />
          </div>
        </div>
      </div>
    </AppWindow>
  );
}

/* ------------------------------------------------------------------ */
/* Coded overlays: one per step, sized in em off the container width   */
/* ------------------------------------------------------------------ */

const overlayScale = { fontSize: "clamp(8px, 1.45cqw, 13px)" } as const;

function Overlay({ index, final, pulse }: { index: number; final: boolean; pulse: boolean }) {
  // NotePin always springs in from scale 0; "always" makes transforms instant so the
  // final state is static (opacity may still cross-fade). "user" honours the OS setting.
  return (
    <MotionConfig reducedMotion={final ? "always" : "user"}>
      <div aria-hidden className="absolute inset-0" style={overlayScale}>
        {index === 0 ? <TokenCard final={final} /> : null}
        {index === 1 ? <CircleNote final={final} /> : null}
        {index === 2 ? <ReviewPins final={final} /> : null}
        {index === 3 ? <PrCard final={final} pulse={pulse} /> : null}
      </div>
    </MotionConfig>
  );
}

const cardClass =
  "absolute rounded-[1.1em] border border-line-strong bg-surface/95 text-fg shadow-window backdrop-blur";

// 01: DESIGN.md token card slides in.
function TokenCard({ final }: { final: boolean }) {
  const swatches = [
    { name: "blue", cls: "bg-blue" },
    { name: "pink", cls: "bg-pink" },
    { name: "yellow", cls: "bg-yellow" },
    { name: "cream", cls: "bg-cream" },
  ];
  return (
    <motion.div
      className={`${cardClass} bottom-[8%] right-[4%] w-[17em] p-[1.1em]`}
      initial={final ? false : { opacity: 0, x: "1.6em", y: "0.4em" }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ ...spring.soft, delay: 0.1 }}
    >
      <div className="flex items-center gap-[0.5em] font-mono text-[0.95em] text-fg-muted">
        <svg viewBox="0 0 16 16" className="size-[1.1em]" fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M4 1.75h5.5L12.5 4.75v9.5h-8.5z" strokeLinejoin="round" />
          <path d="M9.25 1.75v3.25h3.25" strokeLinejoin="round" />
        </svg>
        DESIGN.md
        <span className="ml-auto rounded-full bg-mint/15 px-[0.6em] py-[0.15em] text-[0.85em] text-fg">synced</span>
      </div>
      <div className="mt-[0.9em] flex gap-[0.5em]">
        {swatches.map((s, i) => (
          <motion.div
            key={s.name}
            className="flex-1"
            initial={final ? false : { opacity: 0, y: "0.5em" }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: dur.slow,
              ease: ease.out,
              delay: 0.25 + i * 0.07,
            }}
          >
            <div className={`h-[2.4em] rounded-[0.6em] ring-1 ring-inset ring-fill-edge ${s.cls}`} />
            <p className="mt-[0.35em] font-mono text-[0.8em] text-fg-subtle">{s.name}</p>
          </motion.div>
        ))}
      </div>
      <div className="mt-[0.8em] flex items-baseline justify-between border-t border-line pt-[0.7em]">
        <span className="text-[0.95em] text-fg-muted">Type: Newsreader</span>
        <span className="font-serif text-[1.7em] italic leading-none">Aa</span>
      </div>
    </motion.div>
  );
}

// 02: a pink hand-drawn circle around a detail + the note that goes with it.
function CircleNote({ final }: { final: boolean }) {
  return (
    <>
      <svg
        viewBox="0 0 200 100"
        preserveAspectRatio="none"
        className="absolute left-[34%] top-[26%] h-[24%] w-[32%] overflow-visible text-pink"
        fill="none"
      >
        <motion.path
          d="M24 58 C 18 22, 92 8, 150 16 C 196 22, 204 66, 166 84 C 122 102, 36 96, 18 70 C 10 56, 30 40, 54 34"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={final ? false : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: { duration: 0.9, ease: ease.spatial, delay: 0.1 },
            opacity: { duration: 0.1, delay: 0.1 },
          }}
        />
      </svg>
      <motion.div
        className="absolute left-[63%] top-[16%]"
        initial={final ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: dur.fast, delay: 0.85 }}
      >
        <NotePin n={1} tone="you" text="Tighten this spacing" className="left-0 top-0" />
      </motion.div>
    </>
  );
}

// 03: reviewer pins pop in one after another, then "Fix with agent".
function ReviewPins({ final }: { final: boolean }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (final) return;
    const timers = [250, 750, 1300].map((ms, i) => window.setTimeout(() => setStage(i + 1), ms));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [final]);
  const shown = final ? 3 : stage;

  return (
    <>
      {shown >= 1 ? (
        <NotePin n="M" tone="you" text="Maya: Can the CTA sit higher?" className="left-[12%] top-[22%]" />
      ) : null}
      {shown >= 2 ? (
        <NotePin n="J" tone="you" text="Jon: Love the new type scale." className="left-[46%] top-[52%]" />
      ) : null}
      <AnimatePresence>
        {shown >= 3 ? (
          <motion.div
            className="absolute bottom-[7%] right-[4%] flex items-center gap-[0.6em] rounded-full border border-line-strong bg-surface/95 py-[0.45em] pl-[0.6em] pr-[1em] text-[1.05em] font-medium text-fg shadow-window backdrop-blur"
            initial={final ? false : { opacity: 0, y: "0.8em", scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={spring.snappy}
          >
            <span className="grid size-[1.7em] place-items-center rounded-full bg-blue text-white">
              <svg viewBox="0 0 16 16" className="size-[0.95em]" fill="currentColor">
                <path d="M8 1.5l1.4 3.6 3.6 1.4-3.6 1.4L8 11.5 6.6 7.9 3 6.5l3.6-1.4z" />
                <path d="M12.5 10.5l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z" />
              </svg>
            </span>
            Fix with agent
            <span className="font-mono text-[0.85em] text-fg-subtle">2 notes</span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

// 04: the pull request engineering receives.
function PrCard({ final, pulse }: { final: boolean; pulse: boolean }) {
  return (
    <motion.div
      className={`${cardClass} right-[4%] top-[10%] w-[23em] p-[1.2em]`}
      initial={final ? false : { opacity: 0, y: "1.4em", scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ ...spring.soft, delay: 0.1 }}
    >
      <div className="flex items-center gap-[0.6em]">
        <svg
          viewBox="0 0 16 16"
          className="size-[1.2em] shrink-0 text-fg-muted"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        >
          <circle cx="4" cy="3.5" r="1.75" />
          <circle cx="4" cy="12.5" r="1.75" />
          <circle cx="12" cy="12.5" r="1.75" />
          <path d="M4 5.25v5.5M12 10.75V6.5a2 2 0 0 0-2-2H7.5" strokeLinecap="round" />
          <path d="M9 3l-1.5 1.5L9 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="min-w-0 truncate text-[1.05em] font-semibold tracking-[-0.01em]">
          Draft PR #128 <span className="text-fg-subtle">·</span> Redesign hero
        </p>
      </div>
      <div className="mt-[0.7em] flex items-center gap-[1em] font-mono text-[0.9em]">
        <span>
          <span className="text-mint">+214</span> <span className="text-pink-ink">−87</span>
        </span>
        <span className="flex items-center gap-[0.45em] text-fg-muted">
          <span className={`size-[0.6em] rounded-full bg-mint text-mint ${pulse ? "animate-pulse-ring" : ""}`} />
          Checks passed
        </span>
      </div>
      <div className="mt-[0.9em] grid grid-cols-2 gap-[0.6em]">
        {(["Before", "After"] as const).map((label, i) => (
          <motion.div
            key={label}
            initial={final ? false : { opacity: 0, y: "0.5em" }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: dur.slow,
              ease: ease.out,
              delay: 0.3 + i * 0.1,
            }}
          >
            <MiniThumb after={i === 1} />
            <p className="mt-[0.35em] font-mono text-[0.8em] text-fg-subtle">{label}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function MiniThumb({ after }: { after: boolean }) {
  return (
    <div className="aspect-[16/10] overflow-hidden rounded-[0.55em] border border-line bg-ink p-[0.6em]">
      {after ? (
        <>
          <div className="h-[0.5em] w-[70%] rounded-full bg-fg" />
          <div className="mt-[0.3em] h-[0.5em] w-[45%] rounded-full bg-blue" />
          <div className="mt-[0.5em] h-[0.3em] w-[80%] rounded-full bg-line-strong" />
          <div className="mt-[0.6em] h-[0.9em] w-[38%] rounded-full bg-fg" />
        </>
      ) : (
        <>
          <div className="h-[0.4em] w-[55%] rounded-full bg-fg-subtle" />
          <div className="mt-[0.5em] h-[0.3em] w-[85%] rounded-full bg-line-strong" />
          <div className="mt-[0.3em] h-[0.3em] w-[75%] rounded-full bg-line-strong" />
          <div className="mt-[0.5em] h-[0.8em] w-[30%] rounded-[0.2em] bg-fg-subtle" />
        </>
      )}
    </div>
  );
}
