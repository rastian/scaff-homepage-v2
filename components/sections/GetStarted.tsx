"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, type MotionValue } from "motion/react";
import { getStarted } from "@/content/home";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LogoMark } from "@/components/ui/Logo";
import { DownloadButton, usePlatform } from "@/components/ui/DownloadButton";
import { Reveal } from "@/components/motion/Reveal";
import { useDemoActive } from "@/components/motion/DemoPlayback";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { dur, ease, spring } from "@/components/motion/tokens";

// Where along the track (0..1) each step's circle sits, so it fills as the
// drawn line reaches it.
const THRESHOLDS = [0.04, 0.5, 0.96];

export function GetStarted() {
  const reduced = useReducedMotionSafe();
  const trackRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start 78%", "end 55%"] });
  const [reached, setReached] = useState(0);

  const update = (v: number) => setReached(THRESHOLDS.filter((t) => v >= t).length);
  useMotionValueEvent(scrollYProgress, "change", update);
  // Landing mid-page (anchor link, restored scroll) fires no change event, so
  // read the starting progress once after mount.
  useEffect(() => {
    const id = requestAnimationFrame(() => update(scrollYProgress.get()));
    return () => cancelAnimationFrame(id);
  }, [scrollYProgress]);

  // Reduced motion: the whole track is drawn and every step is filled.
  const filled = reduced ? THRESHOLDS.length : reached;

  return (
    <section id="get-started" aria-labelledby="get-started-title" className="relative px-4 sm:px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="get-started-title"
          eyebrow={getStarted.eyebrow}
          title={getStarted.title[0]}
          muted={getStarted.title[1]}
          body={getStarted.body}
          align="center"
        />

        <ol ref={trackRef} className="relative mt-16 grid gap-12 sm:mt-20 md:grid-cols-3 md:gap-8">
          {/* Track: vertical on mobile, horizontal from md. Drawn by scroll. */}
          <TrackLine progress={scrollYProgress} full={reduced} axis="y" />
          <TrackLine progress={scrollYProgress} full={reduced} axis="x" />

          {getStarted.steps.map((step, i) => (
            <Step key={step.n} index={i} step={step} filled={i < filled} />
          ))}
        </ol>

        <Reveal delay={0.1} className="mt-16 flex justify-center sm:mt-20">
          <DownloadButton size="lg" />
        </Reveal>
      </div>
    </section>
  );
}

function TrackLine({ progress, full, axis }: { progress: MotionValue<number>; full: boolean; axis: "x" | "y" }) {
  const horizontal = axis === "x";
  return (
    <div
      aria-hidden
      className={
        horizontal
          ? "pointer-events-none absolute left-[16.66%] right-[16.66%] top-7 hidden h-px bg-line-strong md:block"
          : "pointer-events-none absolute bottom-6 left-7 top-7 w-px bg-line-strong md:hidden"
      }
    >
      <motion.div
        className={`absolute inset-0 bg-blue ${horizontal ? "origin-left" : "origin-top"}`}
        style={horizontal ? { scaleX: full ? 1 : progress } : { scaleY: full ? 1 : progress }}
      />
    </div>
  );
}

type StepData = (typeof getStarted.steps)[number];

function Step({ index, step, filled }: { index: number; step: StepData; filled: boolean }) {
  const platform = usePlatform();
  const link = "link" in step ? step.link : undefined;
  const body = platform === "windows" && "bodyWindows" in step ? step.bodyWindows : step.body;
  return (
    <li className="relative grid grid-cols-[56px_minmax(0,1fr)] gap-x-5 md:flex md:flex-col md:items-center md:text-center">
      <span
        className={`relative z-10 grid size-14 place-items-center rounded-full border font-mono text-sm font-medium transition-[background-color,border-color,color,box-shadow] duration-[var(--dur-slow)] ease-out ${
          filled
            ? "border-blue bg-blue text-white shadow-[0_0_0_6px_var(--ink)]"
            : "border-line-strong bg-ink text-fg-subtle shadow-[0_0_0_6px_var(--ink)]"
        }`}
      >
        <span className="sr-only">Step </span>
        {step.n}
      </span>

      <Reveal delay={index * 0.08} className="min-w-0 md:mt-8 md:flex md:flex-col md:items-center">
        <StepVisual index={index} />
        <h3 className="mt-6 text-xl font-semibold tracking-[-0.02em] text-fg">{step.title}</h3>
        <p className="mt-2 max-w-xs text-pretty text-[15px] leading-relaxed text-fg-muted">{body}</p>
        {link ? (
          <a
            href={link.href}
            className="group -mx-2 mt-2 inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-fg underline decoration-line-strong underline-offset-4 transition-colors duration-[var(--dur-fast)] hover:decoration-fg active:opacity-70"
          >
            {link.label}
            <svg
              viewBox="0 0 16 16"
              className="size-3.5 transition-transform duration-[var(--dur-fast)] ease-out group-hover:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden
            >
              <path d="M3 8h9.5M8.5 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        ) : null}
      </Reveal>
    </li>
  );
}

const VISUAL_DESCRIPTIONS = [
  "Illustration: the Scaff icon being dragged into the Applications folder.",
  "Illustration: a model picker listing Claude, ChatGPT, Ollama and OpenRouter, with one selected.",
  "Illustration: a project card for linen-and-co running on localhost:3000.",
];

function StepVisual({ index }: { index: number }) {
  return (
    <div className="relative w-full max-w-[320px]">
      <span className="sr-only">{VISUAL_DESCRIPTIONS[index]}</span>
      <div
        aria-hidden
        className="@container relative h-40 w-full overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_18px_40px_-28px_rgb(0_0_0/0.45)]"
      >
        {index === 0 ? <InstallVisual /> : index === 1 ? <ModelVisual /> : <ProjectVisual />}
      </div>
    </div>
  );
}

// ── 01: dmg-style "drag Scaff → Applications" ─────────────────────────────
// Phases: 0 = icon waiting at source, 1 = dragged onto the folder,
// 2 = installed (folder confirms). Loops only while the demo is active.
function InstallVisual() {
  const reduced = useReducedMotionSafe();
  const { ref, active, hoverProps } = useDemoActive<HTMLDivElement>();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!active || reduced) return;
    const wait = phase === 0 ? 1100 : phase === 1 ? 1300 : 1600;
    const t = setTimeout(() => setPhase((p) => (p + 1) % 3), wait);
    return () => clearTimeout(t);
  }, [active, phase, reduced]);

  const p = reduced ? 2 : phase;
  const moving = p >= 1;

  return (
    <div ref={ref} {...hoverProps} className="dot-grid absolute inset-0">
      <span className="absolute left-3 top-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-fg-subtle">
        Scaff.dmg
      </span>

      {/* dashed guide between source and folder */}
      <svg className="absolute left-[30%] right-[30%] top-[52%] h-3 w-[40%] text-line-strong" viewBox="0 0 100 12" preserveAspectRatio="none">
        <path d="M2 6 H90 M84 1.5 L91 6 L84 10.5" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
      </svg>

      {/* Source slot outline (stays when the icon leaves) */}
      <div className="absolute left-[14%] top-[34%] size-12 rounded-xl border border-dashed border-line-strong" />

      {/* Applications folder */}
      <motion.div
        className="absolute right-[12%] top-[30%] flex flex-col items-center"
        animate={{ scale: p === 1 ? 1.08 : 1 }}
        transition={spring.snappy}
      >
        <svg viewBox="0 0 56 46" className="h-[46px] w-14">
          <path d="M3 9a4 4 0 0 1 4-4h13l5 5h24a4 4 0 0 1 4 4v25a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" fill="var(--sky)" stroke="var(--accent)" strokeWidth="1.2" />
          <path d="M3 16h50v23a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" fill="var(--accent)" opacity="0.85" />
          <path d="M22 26l6 6 6-6M28 20v12" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="mt-1 text-[10px] font-medium text-fg-muted">Applications</span>
        <motion.span
          className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-mint text-ink"
          initial={false}
          animate={{ scale: p === 2 ? 1 : 0, opacity: p === 2 ? 1 : 0 }}
          transition={spring.snappy}
        >
          <svg viewBox="0 0 16 16" className="size-3" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="m3.5 8.5 3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.span>
      </motion.div>

      {/* The Scaff icon + a small "You" pointer dragging it. Motion can't
          tween "14%" into a calc(), so the travel is split: the full-width
          track moves 74% of the box, the icon pulls back 52px (its width plus
          half the folder's), landing it on the folder. */}
      <motion.div
        className="absolute inset-x-0 top-[34%] h-12"
        initial={false}
        animate={{ x: moving ? "74%" : "0%" }}
        transition={p === 0 ? { duration: 0 } : { duration: 0.9, ease: ease.spatial }}
      >
        <motion.div
          className="absolute left-[14%] top-0 size-12"
          initial={false}
          animate={{
            x: moving ? -52 : 0,
            scale: p === 2 ? 0.4 : p === 1 ? 0.9 : 1,
            opacity: p === 2 ? 0 : 1,
            y: p === 1 ? -4 : 0,
          }}
          transition={
            p === 0
              ? { duration: dur.slow, ease: ease.out, x: { duration: 0 } }
              : { duration: p === 1 ? 0.9 : dur.slow, ease: ease.spatial }
          }
        >
          <LogoMark className="size-12 drop-shadow-[0_6px_10px_rgb(12_140_233/0.25)]" />
          <svg viewBox="0 0 20 22" className="absolute -bottom-3 -right-2 size-4">
            <path d="M2 1.5 L18 10.2 L10.6 11.8 L7.2 19.8 Z" fill="var(--pink)" stroke="white" strokeWidth="1.4" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </motion.div>

      <motion.span
        className="absolute bottom-2.5 left-3 font-mono text-[10px] text-fg-subtle"
        initial={false}
        animate={{ opacity: p === 2 ? 1 : 0.6 }}
      >
        {p === 2 ? "Installed" : "Drag to install"}
      </motion.span>
    </div>
  );
}

// ── 02: model picker ─────────────────────────────────────────────────────
const MODELS = [
  { name: "Claude", meta: "Plan" },
  { name: "ChatGPT", meta: "Plan" },
  { name: "Ollama", meta: "Local" },
  { name: "OpenRouter", meta: "Key" },
];

function ModelVisual() {
  const reduced = useReducedMotionSafe();
  const { ref, active, hoverProps } = useDemoActive<HTMLDivElement>();
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!active || reduced) return;
    const t = setTimeout(() => setSelected((s) => (s + 1) % MODELS.length), 2200);
    return () => clearTimeout(t);
  }, [active, selected, reduced]);

  const current = reduced ? 0 : selected;

  return (
    <div ref={ref} {...hoverProps} className="absolute inset-0 p-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-fg-subtle">Settings · Models</span>
        <span className="flex items-center gap-1 text-[10px] text-mint">
          <span className="size-1.5 rounded-full bg-mint" />
          Connected
        </span>
      </div>
      <div className="mt-2.5 grid grid-cols-2 gap-1.5">
        {MODELS.map((m, i) => {
          const on = i === current;
          return (
            <span
              key={m.name}
              className={`relative inline-flex h-7 min-w-0 items-center justify-between gap-1.5 rounded-full border px-2.5 text-xs font-medium transition-colors duration-[var(--dur-med)] ${
                on ? "border-accent text-accent" : "border-line text-fg-muted"
              }`}
            >
              {on ? (
                <motion.span
                  layoutId="getstarted-model-pill"
                  className="absolute inset-0 rounded-full bg-accent/10"
                  transition={reduced ? { duration: 0 } : spring.snappy}
                />
              ) : null}
              <span className="relative truncate">{m.name}</span>
              <span className={`relative hidden font-mono text-[9px] uppercase @[280px]:inline ${on ? "text-accent" : "text-fg-subtle"}`}>{m.meta}</span>
            </span>
          );
        })}
      </div>
      <div className="mt-2.5 flex h-7 items-center gap-2 rounded-lg border border-line bg-surface-2 px-2.5 font-mono text-[10px] text-fg-subtle">
        <span className="text-fg-muted">Active</span>
        <motion.span
          key={current}
          initial={reduced ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: dur.med, ease: ease.out }}
          className="text-fg"
        >
          {MODELS[current].name}
        </motion.span>
        <span className="ml-auto hidden truncate @[260px]:inline">Keys stay local</span>
      </div>
    </div>
  );
}

// ── 03: project card ─────────────────────────────────────────────────────
function ProjectVisual() {
  return (
    <div className="dot-grid absolute inset-0 grid place-items-center p-3">
      <div className="w-full max-w-[250px] rounded-xl border border-line-strong bg-surface p-3 shadow-[0_10px_24px_-16px_rgb(0_0_0/0.45)]">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-yellow text-on-accent ring-1 ring-fill-edge">
            <svg viewBox="0 0 16 16" className="size-4" fill="currentColor">
              <path d="M1.5 4a1.5 1.5 0 0 1 1.5-1.5h3.2l1.4 1.5H13A1.5 1.5 0 0 1 14.5 5.5v6.5A1.5 1.5 0 0 1 13 13.5H3A1.5 1.5 0 0 1 1.5 12Z" />
            </svg>
          </span>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-fg">linen-and-co</p>
            <p className="truncate font-mono text-[10px] text-fg-subtle">~/code/linen-and-co</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1.5">
          <span className="inline-flex h-6 min-w-0 items-center gap-1.5 rounded-md bg-mint/12 px-2 font-mono text-[10px] text-mint">
            <span className="relative size-1.5 rounded-full bg-mint text-mint animate-pulse-ring" />
            localhost:3000
          </span>
          <span className="hidden h-6 items-center rounded-md border border-line px-2 font-mono text-[10px] text-fg-muted @[280px]:inline-flex">
            main
          </span>
          <span className="ml-auto inline-flex h-6 shrink-0 items-center rounded-md bg-blue px-2 text-[10px] font-medium text-white">
            Open
          </span>
        </div>
      </div>
    </div>
  );
}
