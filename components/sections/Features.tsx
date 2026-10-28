"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { features } from "@/content/home";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpotlightCard } from "@/components/motion/SpotlightCard";
import { Reveal } from "@/components/motion/Reveal";
import { useDemoActive } from "@/components/motion/DemoPlayback";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { dur, ease, spring } from "@/components/motion/tokens";

type FeatureId = (typeof features.items)[number]["id"];
const item = (id: FeatureId) => features.items.find((f) => f.id === id)!;

export function Features() {
  return (
    <section id="features" aria-labelledby="features-title" className="relative px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="features-title"
          eyebrow={features.eyebrow}
          title={features.title[0]}
          muted={features.title[1]}
          body={features.body}
        />

        <ul className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
          <Tile id="audit" className="md:col-span-2 lg:col-span-4 lg:row-span-2" delay={0}>
            <AuditDemo />
          </Tile>
          <Tile id="devices" className="md:col-span-2 lg:col-span-2 lg:row-span-2" delay={0.06}>
            <DevicesDemo />
          </Tile>
          <Tile id="team" className="lg:col-span-3" delay={0}>
            <TeamDemo />
          </Tile>
          <Tile id="figma" className="lg:col-span-3" delay={0.06}>
            <FigmaDemo />
          </Tile>
          <Tile id="undo" className="lg:col-span-3" delay={0}>
            <UndoDemo />
          </Tile>
          <Tile id="ticket" className="lg:col-span-3" delay={0.06}>
            <TicketDemo />
          </Tile>
        </ul>
      </div>
    </section>
  );
}

/* ── Tile shell ─────────────────────────────────────────────── */

function Tile({
  id,
  className = "",
  delay,
  children,
}: {
  id: FeatureId;
  className?: string;
  delay: number;
  children: React.ReactNode;
}) {
  const f = item(id);
  return (
    <li className={`flex ${className}`}>
      <Reveal delay={delay} className="flex w-full">
        <SpotlightCard className="flex w-full flex-col">
          <div className="relative m-2 flex flex-1 flex-col overflow-hidden rounded-[18px] border border-line bg-surface">
            {children}
          </div>
          <div className="px-6 pb-6 pt-4">
            <h3 className="text-[17px] font-semibold leading-snug tracking-[-0.015em] text-fg">{f.title}</h3>
            <p className="mt-1.5 max-w-prose text-[15px] leading-relaxed text-fg-muted">{f.body}</p>
          </div>
        </SpotlightCard>
      </Reveal>
    </li>
  );
}

function DemoLabel({ children }: { children: React.ReactNode }) {
  return <p className="sr-only">{children}</p>;
}

function CheckIcon({ className = "size-3" }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" className={className} fill="none" aria-hidden>
      <path d="M2.5 6.3 4.9 8.6 9.5 3.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Audit ──────────────────────────────────────────────────── */

const auditors = item("audit").auditors ?? [];
const overall = Math.round(auditors.reduce((s, a) => s + a.score, 0) / Math.max(auditors.length, 1));
const RING_R = 42;
const RING_C = 2 * Math.PI * RING_R;

// One simple rule: every bar is blue, the lowest score is yellow ("needs work").
const lowestScore = Math.min(...auditors.map((a) => a.score));
function scoreBar(score: number) {
  return score === lowestScore && auditors.length > 1 ? "bg-yellow ring-1 ring-inset ring-fill-edge" : "bg-blue";
}

function useCountUp(target: number, start: boolean, reduced: boolean, delay = 0) {
  const mv = useMotionValue(0);
  useEffect(() => {
    if (reduced) {
      mv.set(target);
      return;
    }
    if (!start) return;
    const c = animate(mv, target, { duration: 1.4, delay, ease: ease.out });
    return () => c.stop();
  }, [start, reduced, target, delay, mv]);
  return mv;
}

function Counter({ value }: { value: MotionValue<number> }) {
  const rounded = useTransform(value, (v) => Math.round(v));
  return <motion.span className="tabular-nums">{rounded}</motion.span>;
}

function AuditDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduced = useReducedMotionSafe();
  const started = inView || reduced;
  const [done, setDone] = useState(false);
  const [sent, setSent] = useState<"idle" | "sending" | "sent">("idle");
  const sendRef = useRef<HTMLButtonElement>(null);
  const total = useCountUp(overall, inView, reduced, 0.35);
  const dashOffset = useTransform(total, (v) => RING_C * (1 - v / 100));
  const fixes = auditors.map((a) => Math.max(1, Math.round((100 - a.score) / 4)));
  const totalFixes = fixes.reduce((s, n) => s + n, 0);
  const ready = done || reduced;

  useEffect(() => {
    if (!inView || reduced) return;
    const t = window.setTimeout(() => setDone(true), 1800);
    return () => window.clearTimeout(t);
  }, [inView, reduced]);

  useEffect(() => {
    if (sent !== "sending") return;
    const t = window.setTimeout(() => setSent("sent"), 900);
    return () => window.clearTimeout(t);
  }, [sent]);

  return (
    <div ref={ref} className="flex flex-1 flex-col">
      <DemoLabel>
        Example design audit report. Overall score {overall} out of 100.{" "}
        {auditors.map((a) => `${a.label}: ${a.score}.`).join(" ")}
      </DemoLabel>

      {/* window bar */}
      <div aria-hidden className="flex h-10 items-center gap-2 border-b border-line bg-surface-2/60 px-4">
        <span className="font-mono text-[11px] text-fg-subtle">Design audit</span>
        <span className="hidden text-fg-subtle/60 sm:inline">·</span>
        <span className="hidden font-mono text-[11px] text-fg-subtle sm:inline">localhost:3000/pricing</span>
        <span className="ml-auto flex items-center gap-1.5 whitespace-nowrap text-[11px] font-medium">
          <span className={`relative size-1.5 rounded-full ${ready ? "bg-mint text-mint" : "animate-pulse-ring bg-blue text-accent"}`} />
          <span className={ready ? "text-fg-muted" : "text-accent"}>{ready ? "Report ready" : "Auditing"}</span>
        </span>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-6 p-5 sm:grid-cols-[1fr_auto] sm:gap-8 sm:p-7">
        <ul aria-hidden className="flex flex-col justify-center gap-4">
          {auditors.map((a, i) => (
            <AuditRow key={a.label} label={a.label} score={a.score} fixes={fixes[i]} index={i} started={started} reduced={reduced} />
          ))}
        </ul>

        <div className="flex flex-row items-center gap-5 border-t border-line pt-5 sm:flex-col sm:justify-center sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0">
          <div aria-hidden className="relative size-28 shrink-0 sm:size-36">
            <svg viewBox="0 0 100 100" className="size-full -rotate-90">
              <circle cx="50" cy="50" r={RING_R} fill="none" strokeWidth="7" className="stroke-surface-2" />
              <motion.circle
                cx="50"
                cy="50"
                r={RING_R}
                fill="none"
                strokeWidth="7"
                strokeLinecap="round"
                className="stroke-mint"
                strokeDasharray={RING_C}
                style={{ strokeDashoffset: dashOffset }}
              />
            </svg>
            <div className="absolute inset-0 grid place-content-center text-center">
              <span className="text-3xl font-semibold tracking-[-0.04em] text-fg sm:text-4xl">
                <Counter value={total} />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">Overall</span>
            </div>
          </div>

          <div className="flex min-w-0 flex-col gap-2 sm:items-center">
            <p aria-hidden className="text-[12px] text-fg-muted sm:text-center">
              <span className="font-medium text-fg">{totalFixes} fixes</span> suggested
            </p>
            <button
              type="button"
              ref={sendRef}
              disabled={!ready}
              aria-disabled={sent !== "idle" || undefined}
              onClick={() => {
                if (sent === "idle") setSent("sending");
              }}
              className={`inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full px-4 text-[13px] font-medium transition-[background-color,color,transform,opacity] duration-[var(--dur-fast)] active:scale-[0.97] disabled:cursor-default disabled:active:scale-100 aria-disabled:cursor-default aria-disabled:active:scale-100 ${
                sent === "sent"
                  ? "bg-mint/15 text-mint"
                  : sent === "sending"
                    ? "bg-surface-2 text-fg-muted"
                    : "bg-fg text-ink hover:bg-fg/85 disabled:opacity-40"
              }`}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={sent}
                  initial={{ opacity: 0, y: reduced ? 0 : 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reduced ? 0 : -6 }}
                  transition={{ duration: dur.fast }}
                  className="inline-flex items-center gap-2"
                >
                  {sent === "idle" && (
                    <>
                      <span aria-hidden className="size-1.5 rounded-full bg-blue" />
                      Send fixes to agent
                    </>
                  )}
                  {sent === "sending" && (
                    <>
                      <Spinner />
                      Sending
                    </>
                  )}
                  {sent === "sent" && (
                    <>
                      <CheckIcon className="size-3.5" />
                      Sent to agent
                    </>
                  )}
                </motion.span>
              </AnimatePresence>
            </button>
            {sent === "sent" ? (
              <button
                type="button"
                onClick={() => {
                  setSent("idle");
                  sendRef.current?.focus();
                }}
                className="min-h-11 rounded-full px-3 text-[12px] text-fg-subtle underline-offset-4 transition-colors duration-[var(--dur-fast)] hover:text-fg hover:underline active:text-fg"
              >
                Reset demo
              </button>
            ) : null}
            <p className="sr-only" role="status" aria-live="polite">
              {sent === "sending" ? "Sending fixes to the agent." : sent === "sent" ? `${totalFixes} fixes sent to the agent.` : ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AuditRow({
  label,
  score,
  fixes,
  index,
  started,
  reduced,
}: {
  label: string;
  score: number;
  fixes: number;
  index: number;
  started: boolean;
  reduced: boolean;
}) {
  const delay = 0.15 + index * 0.12;
  const value = useCountUp(score, started && !reduced, reduced, delay);
  return (
    <li className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2">
      <span className="flex items-center gap-2 text-[13px] font-medium text-fg">
        {label}
        <span className="rounded-full bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-fg-subtle">
          {fixes} {fixes === 1 ? "fix" : "fixes"}
        </span>
      </span>
      <span className="text-[13px] font-semibold text-fg">
        <Counter value={value} />
      </span>
      <span className="col-span-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
        <motion.span
          className={`block h-full origin-left rounded-full ${scoreBar(score)}`}
          initial={{ scaleX: reduced ? score / 100 : 0 }}
          animate={started ? { scaleX: score / 100 } : undefined}
          transition={reduced ? { duration: 0 } : { duration: 1.4, delay, ease: ease.out }}
        />
      </span>
    </li>
  );
}

function Spinner() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5 animate-spin" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
      <path d="M14 8a6 6 0 0 0-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* ── Devices ────────────────────────────────────────────────── */

// Max translate (as % of the page's own height) so the page bottom meets the screen bottom.
// screen h / w and page h / w ratios are fixed by the aspect boxes below.
const DEVICE = {
  laptop: { screen: 10 / 16, page: 1.5 },
  tablet: { screen: 4 / 3, page: 2.4 },
  phone: { screen: 19.5 / 9, page: 3.9 },
} as const;
type DeviceKind = keyof typeof DEVICE;
const maxShift = (k: DeviceKind) => ((DEVICE[k].page - DEVICE[k].screen) / DEVICE[k].page) * 100;

const SECTIONS = 3;

function DevicesDemo() {
  const reduced = useReducedMotionSafe();
  const { ref, active, hoverProps } = useDemoActive<HTMLDivElement>();
  const target = useMotionValue(0.18);
  const progress = useSpring(target, { stiffness: 120, damping: 24, mass: 0.6 });
  const [pointer, setPointer] = useState(false);
  const [section, setSection] = useState(0);
  const phase = useRef(0);

  useMotionValueEvent(progress, "change", (v) => {
    const s = Math.min(SECTIONS - 1, Math.floor(v * SECTIONS));
    setSection((prev) => (prev === s ? prev : s));
  });

  // Only schedule frames while the demo is running, so an offscreen or paused tile costs nothing.
  useEffect(() => {
    if (reduced || pointer || !active) return;
    let id = 0;
    let last = performance.now();
    const tick = (t: number) => {
      phase.current += (t - last) / 1000;
      last = t;
      // slow ease back and forth, 14s per round trip
      target.set(0.5 - 0.5 * Math.cos((phase.current / 14) * Math.PI * 2 + 0.88));
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [active, pointer, reduced, target]);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const y = (e.clientY - r.top) / r.height;
    target.set(Math.min(1, Math.max(0, (y - 0.12) / 0.76)));
  };

  return (
    <div
      ref={ref}
      onPointerEnter={(e) => {
        hoverProps.onPointerEnter(e);
        if (e.pointerType === "mouse") setPointer(true);
      }}
      onPointerLeave={() => {
        hoverProps.onPointerLeave();
        setPointer(false);
      }}
      onFocus={hoverProps.onFocus}
      onBlur={hoverProps.onBlur}
      onPointerMove={onMove}
      className="dot-grid relative flex flex-1 flex-col justify-center overflow-hidden bg-ink-2/40 px-5 py-8"
    >
      <DemoLabel>The same page previewed on a MacBook, an iPad, and an iPhone, scrolling in sync.</DemoLabel>
      <div aria-hidden className="mx-auto w-full max-w-[22rem]">
        {/* MacBook */}
        <div className="mx-auto w-[88%]">
          <div className="rounded-t-[10px] border border-line-strong bg-ink-2 p-[3.5%] pb-[2.5%]">
            <Screen kind="laptop" progress={progress} section={section} />
          </div>
          <div className="relative mx-[-7%] h-2.5 rounded-b-[10px] border border-t-0 border-line-strong bg-surface-2">
            <span className="absolute left-1/2 top-0 h-1 w-[16%] -translate-x-1/2 rounded-b-md bg-line-strong" />
          </div>
        </div>
        {/* iPad + iPhone */}
        <div className="mt-6 flex items-end justify-center gap-[7%]">
          <div className="w-[38%] rounded-[12px] border border-line-strong bg-ink-2 p-[4%]">
            <Screen kind="tablet" progress={progress} section={section} rounded="rounded-[6px]" />
          </div>
          <div className="w-[19%] rounded-[12px] border border-line-strong bg-ink-2 p-[6%]">
            <Screen kind="phone" progress={progress} section={section} rounded="rounded-[7px]" />
          </div>
        </div>
      </div>
      <p
        aria-hidden
        className="mx-auto mt-6 flex items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1 font-mono text-[10px] text-fg-subtle"
      >
        <span className="size-1.5 rounded-full bg-blue" />
        {pointer ? "Following your pointer" : "3 devices in sync"}
      </p>
    </div>
  );
}

function Screen({
  kind,
  progress,
  section,
  rounded = "rounded-[4px]",
}: {
  kind: DeviceKind;
  progress: MotionValue<number>;
  section: number;
  rounded?: string;
}) {
  const shift = maxShift(kind);
  const y = useTransform(progress, (v) => `${-v * shift}%`);
  const { screen, page } = DEVICE[kind];
  const cols = kind === "laptop" ? 3 : kind === "tablet" ? 2 : 1;
  return (
    <div className={`relative overflow-hidden bg-surface ${rounded}`} style={{ aspectRatio: `1 / ${screen}` }}>
      <motion.div className="absolute inset-x-0 top-0 flex flex-col gap-[3%] p-[6%]" style={{ y, aspectRatio: `1 / ${page}` }}>
        {/* nav */}
        <div className="flex shrink-0 items-center justify-between" style={{ height: "3%" }}>
          <span className="h-full w-[18%] rounded-sm bg-fg/70" />
          {kind === "phone" ? (
            <span className="h-full w-[12%] rounded-sm bg-fg/25" />
          ) : (
            <span className="flex h-full w-[42%] gap-[8%]">
              <span className="h-full flex-1 rounded-sm bg-fg/20" />
              <span className="h-full flex-1 rounded-sm bg-fg/20" />
              <span className="h-full flex-1 rounded-sm bg-fg/20" />
            </span>
          )}
        </div>
        {/* 0: hero */}
        <Block active={section === 0} grow={3}>
          <div className="flex h-full flex-col justify-center gap-[6%] px-[6%]">
            <span className="h-[12%] w-[78%] rounded-sm bg-fg/80" />
            <span className="h-[12%] w-[52%] rounded-sm bg-fg/35" />
            <span className="mt-[4%] h-[12%] w-[26%] min-w-[18%] rounded-full bg-blue" />
          </div>
        </Block>
        {/* 1: image */}
        <Block active={section === 1} grow={3} className="bg-blue/12">
          <div className="grid h-full place-items-center">
            <span className="h-[40%] w-[40%] rounded-full bg-blue/30" />
          </div>
        </Block>
        {/* 2: cards */}
        <Block active={section === 2} grow={kind === "phone" ? 7 : kind === "tablet" ? 4.5 : 3} transparent>
          <div className="grid h-full gap-[4%]" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
            {Array.from({ length: kind === "phone" ? 3 : kind === "tablet" ? 4 : 3 }).map((_, i) => (
              <span key={i} className="flex flex-col gap-[8%] rounded-[3px] bg-fg/[0.06] p-[8%]">
                <span className="h-[34%] rounded-[2px] bg-fg/10" />
                <span className="h-[8%] w-[70%] rounded-sm bg-fg/30" />
                <span className="h-[8%] w-[50%] rounded-sm bg-fg/15" />
              </span>
            ))}
          </div>
        </Block>
        <div className="shrink-0 rounded-sm bg-fg/[0.06]" style={{ flexGrow: 1 }} />
      </motion.div>
    </div>
  );
}

function Block({
  active,
  grow,
  className = "bg-surface-2",
  transparent,
  children,
}: {
  active: boolean;
  grow: number;
  className?: string;
  transparent?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`relative min-h-0 rounded-[3px] outline outline-1 transition-[outline-color] duration-[var(--dur-med)] ${
        transparent ? "" : className
      } ${active ? "outline-blue" : "outline-transparent"}`}
      style={{ flexGrow: grow, flexBasis: 0 }}
    >
      {children}
    </div>
  );
}

/* ── Team ───────────────────────────────────────────────────── */

const TEAM_W = 320;
const TEAM_H = 150;
const pct = (v: number, of: number) => `${(v / of) * 100}%`;

function TeamDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduced = useReducedMotionSafe();
  const go = inView || reduced;
  const draw = (delay: number) => ({
    initial: { pathLength: reduced ? 1 : 0 },
    animate: go ? { pathLength: 1 } : undefined,
    transition: { duration: reduced ? 0 : 0.9, delay: reduced ? 0 : delay, ease: ease.spatial },
  });
  const pop = (delay: number) => ({
    initial: { opacity: reduced ? 1 : 0, scale: reduced ? 1 : 0.6 },
    animate: go ? { opacity: 1, scale: 1 } : undefined,
    transition: reduced ? { duration: 0 } : { ...spring.snappy, delay },
  });

  return (
    <div ref={ref} className="dot-grid relative flex flex-1 items-center justify-center bg-ink-2/40 px-5 py-8">
      <DemoLabel>Two teammates&apos; branches merging into your chat, with 3 changes combined.</DemoLabel>
      <div aria-hidden className="relative w-full max-w-sm" style={{ aspectRatio: `${TEAM_W} / ${TEAM_H}` }}>
        <svg viewBox={`0 0 ${TEAM_W} ${TEAM_H}`} className="absolute inset-0 size-full overflow-visible" fill="none">
          <motion.path d="M34 34 C 120 34, 140 75, 210 75" strokeWidth="2.5" strokeLinecap="round" className="stroke-pink-ink" {...draw(0.1)} />
          <motion.path d="M34 116 C 120 116, 140 75, 210 75" strokeWidth="2.5" strokeLinecap="round" className="stroke-blue" {...draw(0.25)} />
          <motion.path d="M210 75 L 300 75" strokeWidth="2.5" strokeLinecap="round" className="stroke-accent" {...draw(0.95)} />
          {[
            { cx: 96, cy: 38, c: "fill-pink-ink", d: 0.45 },
            { cx: 96, cy: 112, c: "fill-blue", d: 0.6 },
            { cx: 150, cy: 64, c: "fill-pink-ink", d: 0.7 },
          ].map((p) => (
            <motion.circle key={`${p.cx}-${p.cy}`} cx={p.cx} cy={p.cy} r="4" className={`${p.c} stroke-surface`} strokeWidth="2" {...pop(p.d)} />
          ))}
          <motion.circle cx="210" cy="75" r="6.5" className="fill-surface stroke-accent" strokeWidth="2.5" {...pop(0.95)} />
        </svg>

        {[
          { x: 34, y: 34, initials: "MK", c: "bg-pink text-on-accent shadow-[inset_0_0_0_1px_var(--fill-edge)]" },
          { x: 34, y: 116, initials: "JL", c: "bg-blue text-white" },
        ].map((a) => (
          <span
            key={a.initials}
            className={`absolute grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-[11px] font-semibold ring-4 ring-surface ${a.c}`}
            style={{ left: pct(a.x, TEAM_W), top: pct(a.y, TEAM_H) }}
          >
            {a.initials}
          </span>
        ))}

        <motion.span
          className="absolute flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border border-line-strong bg-surface px-2.5 py-1 text-[11px] font-medium text-fg shadow-sm"
          style={{ left: pct(232, TEAM_W), top: pct(92, TEAM_H) }}
          initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 6 }}
          animate={go ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: dur.slow, delay: reduced ? 0 : 1.35, ease: ease.out }}
        >
          <span className="grid size-4 place-items-center rounded-full bg-blue text-white">
            <CheckIcon className="size-2.5" />
          </span>
          Combined 3 changes
        </motion.span>
        <span
          className="absolute -translate-y-[170%] whitespace-nowrap font-mono text-[10px] text-fg-subtle"
          style={{ left: pct(240, TEAM_W), top: pct(75, TEAM_H) }}
        >
          chat/your-work
        </span>
      </div>
    </div>
  );
}

/* ── Figma ──────────────────────────────────────────────────── */

const FIGMA_TARGETS = [
  { left: 8, top: 18, width: 50, height: 62, name: "Pricing card", size: "320 × 396" },
  { left: 64, top: 52, width: 28, height: 18, name: "Button / Primary", size: "176 × 44" },
] as const;

function FigmaDemo() {
  const reduced = useReducedMotionSafe();
  const { ref, active, hoverProps } = useDemoActive<HTMLDivElement>();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (!active || reduced) return;
    const t = window.setInterval(() => setI((n) => (n + 1) % FIGMA_TARGETS.length), 2800);
    return () => window.clearInterval(t);
  }, [active, reduced]);

  const sel = FIGMA_TARGETS[reduced ? 0 : i];
  const box = { left: `${sel.left}%`, top: `${sel.top}%`, width: `${sel.width}%`, height: `${sel.height}%` };

  return (
    <div ref={ref} {...hoverProps} className="dot-grid relative flex flex-1 flex-col bg-ink-2/40 px-5 pb-5 pt-6">
      <DemoLabel>A Figma selection being read by Scaff through the local MCP server.</DemoLabel>
      <div aria-hidden className="relative mx-auto aspect-[16/9] w-full max-w-sm">
        {/* objects */}
        <div
          className="absolute flex flex-col gap-[6%] rounded-lg border border-line bg-surface p-[4%] shadow-sm"
          style={{ left: "8%", top: "18%", width: "50%", height: "62%" }}
        >
          <span className="h-[10%] w-[40%] rounded-sm bg-fg/15" />
          <span className="h-[18%] w-[55%] rounded-sm bg-fg/70" />
          <span className="h-[8%] w-[80%] rounded-sm bg-fg/12" />
          <span className="h-[8%] w-[66%] rounded-sm bg-fg/12" />
          <span className="mt-auto h-[16%] w-full rounded-md bg-blue" />
        </div>
        <div
          className="absolute grid place-items-center rounded-full bg-fg text-[9px] font-medium text-ink"
          style={{ left: "64%", top: "52%", width: "28%", height: "18%" }}
        >
          Get started
        </div>
        <span className="absolute font-mono text-[9px] text-fg-subtle" style={{ left: "8%", top: "8%" }}>
          Frame 12
        </span>

        {/* selection */}
        <motion.div
          className="pointer-events-none absolute border-[1.5px] border-blue"
          initial={false}
          animate={box}
          transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 210, damping: 28 }}
        >
          {["-left-[4px] -top-[4px]", "-right-[4px] -top-[4px]", "-bottom-[4px] -left-[4px]", "-bottom-[4px] -right-[4px]"].map((p) => (
            <span key={p} className={`absolute size-[7px] border-[1.5px] border-blue bg-surface ${p}`} />
          ))}
          <span className="absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-[4px] bg-blue px-1.5 py-0.5 font-mono text-[9px] text-white">
            {sel.size}
          </span>
        </motion.div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 pt-5">
        <span className="flex min-w-0 items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-[11px] font-medium text-fg">
          <span aria-hidden className={`size-1.5 shrink-0 rounded-full bg-blue text-accent ${active && !reduced ? "animate-pulse-ring" : ""}`} />
          <span className="truncate">Reading selection via MCP</span>
        </span>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={sel.name}
            aria-hidden
            initial={{ opacity: 0, y: reduced ? 0 : 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduced ? 0 : -4 }}
            transition={{ duration: dur.med }}
            className="truncate font-mono text-[11px] text-fg-subtle"
          >
            {sel.name}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── Undo ───────────────────────────────────────────────────── */

const SAVES = [
  { reply: 1, label: "Tighter nav spacing", ago: "6m" },
  { reply: 2, label: "Serif headings from DESIGN.md", ago: "3m" },
  { reply: 3, label: "Softer hero palette", ago: "just now" },
] as const;

function UndoDemo() {
  const reduced = useReducedMotionSafe();
  const [count, setCount] = useState<number>(SAVES.length);
  const [status, setStatus] = useState("");
  const listId = useId();
  const undoRef = useRef<HTMLButtonElement>(null);
  const resetRef = useRef<HTMLButtonElement>(null);
  const pendingFocus = useRef<"undo" | "reset" | null>(null);
  const visible = SAVES.slice(0, count).reverse();

  const undo = () => {
    if (count === 0) return;
    const removed = SAVES[count - 1];
    setCount(count - 1);
    if (count - 1 === 0) pendingFocus.current = "reset";
    setStatus(`Undid “${removed.label}”. ${count - 1} ${count - 1 === 1 ? "save" : "saves"} left.`);
  };
  const redo = () => {
    if (count >= SAVES.length) return;
    const restored = SAVES[count];
    setCount(count + 1);
    if (count + 1 === SAVES.length) pendingFocus.current = "undo";
    setStatus(`Restored “${restored.label}”.`);
  };
  const reset = () => {
    setCount(SAVES.length);
    pendingFocus.current = "undo";
    setStatus("Demo reset.");
  };

  // Undo disables at zero, Redo and Reset unmount: hand focus to the next sensible control.
  useEffect(() => {
    const target = pendingFocus.current;
    if (!target) return;
    pendingFocus.current = null;
    (target === "undo" ? undoRef : resetRef).current?.focus();
  }, [count]);

  const btn =
    "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full px-4 text-[13px] font-medium transition-[background-color,color,transform,opacity] duration-[var(--dur-fast)] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100";

  return (
    <div className="relative flex flex-1 flex-col bg-ink-2/40 p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-[11px] text-fg-subtle">chat/soft-palette</span>
        <span className="font-mono text-[11px] text-fg-subtle">
          {count} / {SAVES.length} saved
        </span>
      </div>

      <ul id={listId} aria-label="Saved replies" className="relative flex min-h-[9.5rem] flex-col gap-2">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((s, i) => (
            <motion.li
              key={s.reply}
              layout={!reduced}
              initial={{ opacity: 0, y: reduced ? 0 : -14, scale: reduced ? 1 : 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: reduced ? 0 : -14, scale: reduced ? 1 : 0.96, transition: { duration: dur.med, ease: ease.in } }}
              transition={{ duration: dur.slow, ease: ease.out }}
              className={`flex items-center gap-2.5 rounded-xl border bg-surface px-3 py-2.5 ${
                i === 0 ? "border-line-strong shadow-sm" : "border-line"
              }`}
            >
              <span aria-hidden className="grid size-5 shrink-0 place-items-center rounded-full bg-mint/15 text-mint">
                <CheckIcon className="size-3" />
              </span>
              <span className="min-w-0 flex-1 truncate text-[13px] text-fg">
                <span className="text-fg-subtle">Reply {s.reply} · </span>
                {s.label}
              </span>
              <span className="shrink-0 font-mono text-[10px] text-fg-subtle">{s.ago}</span>
            </motion.li>
          ))}
          {count === 0 ? (
            <motion.li
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: dur.med }}
              className="flex flex-1 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-line-strong py-6 text-center text-[13px] text-fg-muted"
            >
              Back at the start of the chat.
              <button
                ref={resetRef}
                type="button"
                onClick={reset}
                className="min-h-11 rounded-full px-3 text-[12px] font-medium text-accent underline-offset-4 transition-opacity duration-[var(--dur-fast)] hover:underline active:opacity-70"
              >
                Reset demo
              </button>
            </motion.li>
          ) : null}
        </AnimatePresence>
      </ul>

      <div className="mt-4 flex items-center gap-2">
        <button
          ref={undoRef}
          type="button"
          onClick={undo}
          disabled={count === 0}
          aria-controls={listId}
          className={`${btn} border border-line-strong bg-surface text-fg hover:bg-surface-2`}
        >
          <svg viewBox="0 0 16 16" className="size-3.5" fill="none" aria-hidden>
            <path d="M5.5 4 2.5 7l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2.8 7h6.7a3.5 3.5 0 0 1 0 7H8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          Undo
        </button>
        <AnimatePresence initial={false}>
          {count < SAVES.length ? (
            <motion.button
              key="redo"
              type="button"
              onClick={redo}
              aria-controls={listId}
              initial={{ opacity: 0, x: reduced ? 0 : -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: reduced ? 0 : -6 }}
              transition={{ duration: dur.med, ease: ease.out }}
              className={`${btn} text-fg-muted hover:bg-surface-2 hover:text-fg`}
            >
              Redo
              <svg viewBox="0 0 16 16" className="size-3.5" fill="none" aria-hidden>
                <path d="M10.5 4l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M13.2 7H6.5a3.5 3.5 0 0 0 0 7H8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </motion.button>
          ) : null}
        </AnimatePresence>
        <span className="ml-auto hidden text-[11px] text-fg-subtle sm:inline">Saved after every reply</span>
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {status}
      </p>
    </div>
  );
}

/* ── Ticket ─────────────────────────────────────────────────── */

function TicketDemo() {
  const reduced = useReducedMotionSafe();
  const maskId = `ticket-arrow-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [hovered, setHovered] = useState(false);
  const [opened, setOpened] = useState(false);
  const on = hovered || opened;
  const move = reduced ? 0 : 1;

  return (
    <div
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      className="dot-grid relative flex flex-1 flex-col justify-center gap-4 bg-ink-2/40 p-5"
    >
      <div className="relative flex items-center gap-3">
        {/* issue */}
        <motion.div
          aria-hidden
          animate={{ x: on ? -4 * move : 0 }}
          transition={spring.soft}
          className="w-[62%] min-w-0 shrink-0 rounded-xl border border-line-strong bg-surface p-3.5 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <PriorityIcon />
            <span className="font-mono text-[11px] text-fg-subtle">SCF-142</span>
            <span className="ml-auto grid size-5 place-items-center rounded-full bg-pink text-[9px] font-semibold text-on-accent ring-1 ring-inset ring-fill-edge">MK</span>
          </div>
          <p className="mt-2 truncate text-[14px] font-medium tracking-[-0.01em] text-fg">Redesign pricing page</p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            <Chip className="bg-pink text-on-accent ring-1 ring-inset ring-fill-edge">Design</Chip>
            <Chip className="bg-blue/12 text-accent">Web</Chip>
            <Chip className="bg-surface-2 text-fg-muted">
              <span className="size-1.5 rounded-full border border-fg-subtle" />
              Todo
            </Chip>
          </div>
        </motion.div>

        {/* arrow */}
        <svg aria-hidden viewBox="0 0 40 12" className="w-[9%] shrink-0 overflow-visible" fill="none">
          <mask id={maskId} maskUnits="userSpaceOnUse" x="-2" y="0" width="44" height="12">
            <motion.path
              d="M1 6 H 36"
              stroke="white"
              strokeWidth="4"
              initial={false}
              animate={{ pathLength: on ? 1 : 0.35 }}
              transition={{ duration: reduced ? 0 : dur.slow, ease: ease.out }}
            />
          </mask>
          <path
            d="M1 6 H 36"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeDasharray="3 4"
            mask={`url(#${maskId})`}
            className={`transition-[stroke] duration-[var(--dur-med)] ${on ? "stroke-blue" : "stroke-line-strong"}`}
          />
          <motion.path
            d="M32 2 L37 6 L32 10"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-[stroke] duration-[var(--dur-med)] ${on ? "stroke-blue" : "stroke-line-strong"}`}
            initial={false}
            animate={{ opacity: on ? 1 : 0.5 }}
            transition={{ duration: reduced ? 0 : dur.med }}
          />
        </svg>

        {/* chat */}
        <div aria-hidden className="relative min-w-0 flex-1">
          <AnimatePresence mode="popLayout" initial={false}>
            {on ? (
              <motion.div
                key="chat"
                initial={{ opacity: 0, x: -8 * move, scale: reduced ? 1 : 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -8 * move, scale: reduced ? 1 : 0.96 }}
                transition={{ duration: dur.med, ease: ease.out }}
                className="rounded-xl border border-blue/40 bg-surface p-3 shadow-sm"
              >
                <span className="flex min-w-0 items-center gap-1.5 whitespace-nowrap text-[11px] font-medium text-mint">
                  <CheckIcon className="size-3 shrink-0" />
                  <span className="truncate">Chat opened</span>
                </span>
                <span className="mt-2 block h-1.5 w-[85%] rounded-full bg-fg/15" />
                <span className="mt-1.5 block h-1.5 w-[60%] rounded-full bg-fg/10" />
                <span className="mt-2.5 block truncate font-mono text-[9px] text-fg-subtle">SCF-142 attached</span>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: dur.fast }}
                className="grid h-[5.5rem] place-items-center rounded-xl border border-dashed border-line-strong text-[11px] text-fg-subtle"
              >
                New chat
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          // Fixed label + aria-pressed: "Start chat from SCF-142, pressed" means open.
          aria-pressed={opened}
          onClick={() => setOpened((o) => !o)}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong bg-surface px-4 text-[13px] font-medium text-fg transition-[background-color,border-color,transform] duration-[var(--dur-fast)] hover:bg-surface-2 active:scale-[0.97] aria-pressed:border-blue/50"
        >
          Start chat from SCF-142
        </button>
        <span className="hidden text-[11px] text-fg-subtle sm:inline">GitHub · GitLab · Linear · Jira</span>
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {opened ? "Chat opened with issue SCF-142, Redesign pricing page, attached." : ""}
      </p>
    </div>
  );
}

function Chip({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium ${className}`}>{children}</span>
  );
}

function PriorityIcon() {
  return (
    <svg viewBox="0 0 14 14" className="size-3.5 text-fg-muted" aria-hidden>
      <rect x="1.5" y="8" width="2.5" height="4.5" rx="0.8" fill="currentColor" />
      <rect x="5.75" y="5" width="2.5" height="7.5" rx="0.8" fill="currentColor" />
      <rect x="10" y="2" width="2.5" height="10.5" rx="0.8" fill="currentColor" opacity="0.3" />
    </svg>
  );
}
