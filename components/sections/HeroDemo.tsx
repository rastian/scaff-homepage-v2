"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { hero } from "@/content/home";
import { Cursor } from "@/components/motion/Cursor";
import { NotePin } from "@/components/motion/NotePin";
import { useDemoActive } from "@/components/motion/DemoPlayback";
import { dur, ease, spring } from "@/components/motion/tokens";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { AppWindow } from "@/components/ui/AppWindow";
import { LogoMark } from "@/components/ui/Logo";

/* ── Script ───────────────────────────────────────────────────────
   One step index drives everything. Each entry is how long that step
   holds before advancing (ms). ~10s per loop.
   0 idle/reset · 1 "You" glides to heading · 2 circle drawn
   3 pin + chat message · 4 agent thinking · 5 reading DESIGN.md
   6 editing, "Scaff" cursor arrives · 7 heading morphs, desktop shot
   8 desktop checked, mobile shot · 9 mobile checked, reply streams
   10 hold */
const STEP_MS = [900, 950, 750, 750, 750, 650, 800, 850, 650, 1300, 2300];
const FINAL = STEP_MS.length - 1;

const TOOLS = ["Reading DESIGN.md", "Editing Hero.tsx", "Screenshot · desktop", "Screenshot · mobile"];
// Step at which each tool starts (it finishes one step later).
const TOOL_START = [5, 6, 7, 8];

type Box = { x: number; y: number; w: number; h: number };
type Layout = { pane: { w: number; h: number }; heading: Box; button: Box } | null;

// Position of `el` inside `ancestor` in layout pixels. offset* ignores CSS
// transforms, so the hero's scroll tilt never skews the cursor targets.
function boxWithin(el: HTMLElement, ancestor: HTMLElement): Box {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== ancestor) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
}

// Spins only while the demo is playing, so a global pause freezes it too.
function Spinner({ spinning }: { spinning: boolean }) {
  return (
    <svg viewBox="0 0 16 16" className={`size-3 text-accent ${spinning ? "animate-spin" : ""}`} fill="none" aria-hidden>
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
      <path d="M14 8a6 6 0 0 0-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function Tick({ className = "size-3 text-mint" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
      <path d="m3.5 8.5 3 2.8 6-6.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// The reply, streamed two characters every 26ms while `running`. Its own
// component so each tick re-renders only this text, not the layout-animated
// chat around it. Remounts (and restarts) each loop with the reply bubble.
function StreamedReply({ text, running, full }: { text: string; running: boolean; full: boolean }) {
  const [typed, setTyped] = useState(0);
  useEffect(() => {
    if (full || !running || typed >= text.length) return;
    const t = setTimeout(() => setTyped((n) => Math.min(text.length, n + 2)), 26);
    return () => clearTimeout(t);
  }, [full, running, typed, text.length]);
  const shown = full ? text.length : typed;
  return (
    <>
      {text.slice(0, shown)}
      {shown < text.length ? <span className="ml-px inline-block h-3 w-[5px] translate-y-0.5 bg-blue" /> : null}
    </>
  );
}

const itemIn = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
  transition: { duration: dur.med, ease: ease.out },
};

export function HeroDemo() {
  const reduced = useReducedMotionSafe();
  const { ref, active, paused, hoverProps } = useDemoActive<HTMLDivElement>();
  const [step, setStep] = useState(0);

  // Reduced motion, or paused before the loop ever started: show the end state.
  const isStatic = reduced || (paused && step === 0);
  const s = isStatic ? FINAL : step;

  // Timeout chain; only runs while the demo is on screen and not paused/hovered.
  useEffect(() => {
    if (!active || isStatic) return;
    const t = setTimeout(() => {
      setStep(step >= FINAL ? 0 : step + 1);
    }, STEP_MS[step]);
    return () => clearTimeout(t);
  }, [active, isStatic, step]);

  // The reply streams during step 9 (see StreamedReply).
  const reply = hero.demo.reply;

  // Measure the fake page so cursors and pins land correctly at any width.
  const paneRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLSpanElement>(null);
  const [layout, setLayout] = useState<Layout>(null);
  useLayoutEffect(() => {
    const pane = paneRef.current;
    const heading = headingRef.current;
    const button = buttonRef.current;
    if (!pane || !heading || !button) return;
    const measure = () =>
      setLayout({
        pane: { w: pane.offsetWidth, h: pane.offsetHeight },
        heading: boxWithin(heading, pane),
        button: boxWithin(button, pane),
      });
    const ro = new ResizeObserver(measure);
    ro.observe(pane);
    ro.observe(heading);
    return () => ro.disconnect();
  }, []);

  // Derived scene state
  const youOn = s >= 1;
  const circleOn = s >= 2 && s < 7;
  const pinOn = s >= 3;
  const thinking = s === 4;
  const morphed = s >= 7;
  const agentOn = s >= 6;
  const desktopOk = s >= 8;
  const mobileOk = s >= 9;
  const prReady = s >= FINAL;

  // Cursor targets (px within the preview pane)
  let you = { x: 0, y: 0 };
  let agent = { x: 0, y: 0 };
  let pin = { x: 0, y: 0 };
  if (layout) {
    const { pane, heading: h, button: b } = layout;
    const rest = { x: pane.w * 0.82, y: pane.h * 0.94 };
    const onHeading = { x: h.x + h.w * 0.66, y: h.y + h.h * 0.6 };
    // Once the note is sent, "You" steps aside into the whitespace right of
    // the heading (not onto the body copy), clamped inside the pane.
    const roomRight = pane.w - (h.x + h.w);
    const pinRight = roomRight > 250;
    const aside = {
      x: Math.min(h.x + h.w + 16, pane.w - 72),
      // When the pin's bubble sits right of the heading, stay clear below it.
      y: Math.min(Math.max(h.y + h.h * 0.4, pinRight ? h.y + 40 : 0), pane.h - 32),
    };
    you = !youOn ? rest : s >= 4 ? aside : onHeading;
    agent =
      s < 6
        ? { x: -24, y: pane.h * 0.45 }
        : s < 8
          ? { x: h.x + h.w * 0.28, y: h.y + h.h * 0.7 }
          : { x: b.x + b.w * 0.78, y: b.y + b.h * 0.62 };
    pin = pinRight ? { x: h.x + h.w - 4, y: h.y - 10 } : { x: h.x + 6, y: Math.max(8, h.y - 38) };
  }
  // Snap back silently on reset (after the fade), glide otherwise.
  const glide = (show: boolean) => ({
    x: show ? { duration: 0.85, ease: ease.spatial } : { duration: 0, delay: 0.3 },
    y: show ? { duration: 0.85, ease: ease.spatial } : { duration: 0, delay: 0.3 },
    opacity: { duration: dur.med },
  });

  const description = `Product demo: on a live website running at ${hero.demo.url}, you circle the heading and leave a comment, "${hero.demo.note}". Scaff reads the design system, edits Hero.tsx, switches the heading to a large serif, softens the page, and checks the result on desktop and mobile. Scaff replies: "${reply}"`;

  return (
    <MotionConfig reducedMotion="user">
      <div ref={ref} {...hoverProps} className="relative">
        <p className="sr-only">{description}</p>
        <div aria-hidden className="select-none">
          <AppWindow
            title="Scaff"
            url={hero.demo.url}
            toolbar={
              <div className="hidden items-center gap-2.5 sm:flex">
                <div className="flex -space-x-1.5">
                  <span className="size-5 rounded-full bg-pink outline-1 -outline-offset-1 outline-fill-edge ring-2 ring-surface" />
                  <span className="grid size-5 place-items-center rounded-full bg-surface ring-2 ring-surface">
                    <LogoMark className="size-5" />
                  </span>
                </div>
                <span
                  className={`inline-flex h-7 items-center gap-1.5 rounded-lg px-2.5 text-[11px] font-medium transition-colors duration-[var(--dur-slow)] ${
                    prReady ? "bg-mint/15 text-mint" : "bg-fg text-ink"
                  }`}
                >
                  {prReady ? <Tick className="size-3 text-mint" /> : null}
                  {prReady ? "PR ready" : "Create PR"}
                </span>
              </div>
            }
            bodyClassName="relative grid min-h-[360px] grid-cols-1 sm:aspect-[16/9.4] sm:min-h-0 sm:grid-cols-[34%_1fr] lg:grid-cols-[30%_1fr]"
          >
            {/* ── Chat panel ─────────────────────────────── */}
            <div className="hidden min-h-0 flex-col border-r border-line bg-surface-2/50 sm:flex">
              <div className="flex h-10 shrink-0 items-center gap-2 border-b border-line px-3.5">
                <span className="text-[12px] font-medium text-fg">Linen &amp; Co</span>
                <span className="inline-flex items-center gap-1 truncate rounded-md bg-fg/[0.05] px-1.5 py-0.5 font-mono text-[10px] text-fg-subtle">
                  <svg viewBox="0 0 16 16" className="size-2.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                    <circle cx="4.5" cy="3.5" r="1.6" />
                    <circle cx="4.5" cy="12.5" r="1.6" />
                    <circle cx="11.5" cy="5.5" r="1.6" />
                    <path d="M4.5 5.1v5.8M11.5 7.1c0 2.6-3.5 2.4-6.4 4" />
                  </svg>
                  <span className="truncate">scaff/editorial-hero</span>
                </span>
              </div>

              <div className="flex min-h-0 flex-1 flex-col justify-end gap-3 overflow-hidden p-3.5">
                <AnimatePresence initial={false} mode="popLayout">
                  {!pinOn ? (
                    <motion.p
                      key="empty"
                      {...itemIn}
                      className="mb-auto mt-auto text-center text-[11.5px] leading-relaxed text-fg-subtle"
                    >
                      Point at anything on your page
                      <br />
                      and say what to change.
                    </motion.p>
                  ) : null}

                  {pinOn ? (
                    <motion.div key="user" layout="position" {...itemIn} className="flex flex-col items-end gap-1">
                      <span className="flex items-center gap-1.5 text-[10.5px] font-medium text-fg-muted">
                        <span className="size-1.5 rounded-full bg-pink ring-1 ring-fill-edge" />
                        You
                      </span>
                      <div className="max-w-[92%] rounded-2xl rounded-br-md border border-pink/30 bg-pink/10 px-3 py-2 text-left text-[12px] leading-snug text-fg">
                        <span className="mb-1 flex items-center gap-1 font-mono text-[9.5px] text-fg-subtle">
                          <span className="grid size-3.5 place-items-center rounded-full rounded-bl-none bg-pink text-[8px] font-semibold text-on-accent ring-1 ring-fill-edge">
                            1
                          </span>
                          h1 · Hero.tsx
                        </span>
                        {hero.demo.note}
                      </div>
                    </motion.div>
                  ) : null}

                  {s >= 4 ? (
                    <motion.div key="agent" layout="position" {...itemIn} className="flex flex-col gap-2">
                      <span className="flex items-center gap-1.5 text-[10.5px] font-medium text-fg-muted">
                        <LogoMark className="size-3.5" />
                        Scaff
                        <span className="font-normal text-fg-subtle">· Claude</span>
                      </span>

                      {thinking ? (
                        <span className="flex h-5 items-center gap-1 pl-0.5">
                          {[0, 1, 2].map((i) => (
                            <motion.span
                              key={i}
                              className="size-1.5 rounded-full bg-fg-subtle"
                              animate={active ? { opacity: [0.3, 1, 0.3] } : { opacity: 0.6 }}
                              transition={
                                active ? { duration: 0.9, repeat: Infinity, delay: i * 0.15 } : { duration: dur.fast }
                              }
                            />
                          ))}
                        </span>
                      ) : null}

                      <div className="flex flex-col items-start gap-1">
                        <AnimatePresence initial={false}>
                          {TOOLS.map((label, i) =>
                            s >= TOOL_START[i] ? (
                              <motion.span
                                key={label}
                                layout="position"
                                initial={{ opacity: 0, x: -6 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: dur.med, ease: ease.out }}
                                className="inline-flex h-6 items-center gap-1.5 rounded-md border border-line bg-surface px-2 font-mono text-[10px] text-fg-muted"
                              >
                                {s > TOOL_START[i] ? <Tick /> : <Spinner spinning={active} />}
                                {label}
                              </motion.span>
                            ) : null,
                          )}
                        </AnimatePresence>
                      </div>

                      {s >= 9 ? (
                        <motion.p {...itemIn} className="text-[12px] leading-relaxed text-fg">
                          <StreamedReply text={reply} running={active && !isStatic} full={isStatic || step > 9} />
                        </motion.p>
                      ) : null}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>

              <div className="m-3 mt-0 shrink-0 rounded-xl border border-line-strong bg-surface p-2.5">
                <p className="text-[11px] text-fg-subtle">Ask Scaff to change anything…</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="rounded-md bg-fg/[0.05] px-1.5 py-0.5 font-mono text-[9.5px] text-fg-muted">
                    claude-sonnet
                  </span>
                  <span className="grid size-6 place-items-center rounded-full bg-fg text-ink">
                    <svg viewBox="0 0 16 16" className="size-3" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                      <path d="M8 13V3M4 7l4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>

            {/* ── Live browser pane: the customer's site ──── */}
            <div ref={paneRef} className="@container relative min-h-0 overflow-hidden bg-surface">
              {/* Soft cream/sky page tint fades in with the edit */}
              <div
                className={`absolute inset-0 bg-surface-2 transition-opacity duration-[var(--dur-slow)] ease-out ${
                  morphed ? "opacity-100" : "opacity-0"
                }`}
              />
              <div
                className={`absolute inset-0 bg-sky/[0.06] transition-opacity duration-[var(--dur-slow)] ease-out ${
                  morphed ? "opacity-100" : "opacity-0"
                }`}
              />

              <div className="relative flex h-full flex-col px-[6cqw] pb-[5cqw] pt-[3.2cqw] text-left">
                {/* Site nav */}
                <div className="flex items-center justify-between text-[clamp(10px,1.6cqw,13px)]">
                  <span
                    className={`text-[clamp(12px,2.1cqw,17px)] text-fg ${
                      morphed ? "font-serif font-normal tracking-[-0.01em]" : "font-sans font-semibold tracking-tight"
                    }`}
                  >
                    Linen &amp; Co
                  </span>
                  <span className="flex items-center gap-[2.6cqw] text-fg-muted">
                    <span className="hidden @[380px]:inline">Shop</span>
                    <span className="hidden @[380px]:inline">Journal</span>
                    <span className="hidden @[380px]:inline">About</span>
                    <span className="inline-flex items-center gap-1">
                      <svg viewBox="0 0 16 16" className="size-[1.1em]" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                        <path d="M3 5h10l-1 8H4L3 5Zm2.5 0a2.5 2.5 0 0 1 5 0" strokeLinejoin="round" />
                      </svg>
                      2
                    </span>
                  </span>
                </div>

                {/* Site hero */}
                <div className="mt-[7cqw] max-[639px]:mt-12">
                  <p className="font-mono text-[clamp(9px,1.25cqw,11px)] uppercase tracking-[0.14em] text-fg-subtle">
                    New · Spring bedding
                  </p>

                  <div className="relative mt-[1.6cqw] w-fit max-[639px]:mt-3">
                    {/* Both headings share one grid cell; the cell is sized by
                        the larger serif one, so the morph never shifts layout. */}
                    <div ref={headingRef} className="grid w-fit">
                      <motion.div
                        className="col-start-1 row-start-1 self-end font-sans text-[clamp(26px,5.3cqw,48px)] font-bold leading-[1.02] tracking-[-0.035em] text-fg"
                        initial={false}
                        animate={{ opacity: morphed ? 0 : 1, y: morphed ? -6 : 0, filter: morphed ? "blur(4px)" : "blur(0px)" }}
                        transition={{ duration: dur.slow, ease: ease.out }}
                      >
                        <span className="block">Quietly made</span>
                        <span className="block">linens</span>
                      </motion.div>
                      <motion.div
                        className="col-start-1 row-start-1 font-serif text-[clamp(32px,6.7cqw,62px)] font-normal leading-[1.0] tracking-[-0.02em] text-fg"
                        initial={false}
                        animate={{ opacity: morphed ? 1 : 0, y: morphed ? 0 : 6, filter: morphed ? "blur(0px)" : "blur(4px)" }}
                        transition={{ duration: dur.slow, ease: ease.out, delay: morphed ? 0.08 : 0 }}
                      >
                        <span className="block">Quietly made</span>
                        <span className="block">linens</span>
                      </motion.div>
                    </div>

                    {/* Hand-drawn circle around the heading */}
                    <svg
                      viewBox="0 0 300 100"
                      preserveAspectRatio="none"
                      className="pointer-events-none absolute -left-[9%] -top-[22%] h-[144%] w-[118%] overflow-visible"
                      fill="none"
                    >
                      <motion.path
                        d="M18 58 C10 26 70 6 160 8 C246 10 296 28 292 56 C288 86 214 98 140 95 C66 92 6 80 12 50 C15 36 34 24 62 17"
                        stroke="var(--pink)"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                        initial={false}
                        animate={{ pathLength: circleOn ? 1 : 0, opacity: circleOn ? 1 : 0 }}
                        transition={{
                          pathLength: { duration: circleOn ? 0.7 : 0, ease: ease.out, delay: circleOn ? 0 : 0.4 },
                          opacity: { duration: circleOn ? 0.1 : dur.slow },
                        }}
                      />
                    </svg>
                  </div>

                  <p className="mt-[2cqw] max-w-[44ch] text-[clamp(11px,1.55cqw,14px)] leading-relaxed text-fg-muted max-[639px]:mt-3">
                    Stonewashed European flax, cut and sewn in small batches.
                  </p>

                  <span
                    ref={buttonRef}
                    className={`mt-[2.6cqw] inline-flex h-[clamp(30px,4.6cqw,42px)] items-center px-[clamp(12px,2.4cqw,22px)] text-[clamp(11px,1.5cqw,13.5px)] font-medium transition-[border-radius,background-color,color] duration-[var(--dur-slow)] ease-out max-[639px]:mt-4 ${
                      morphed ? "rounded-full bg-blue text-white" : "rounded-[4px] bg-fg text-ink"
                    }`}
                  >
                    Shop the collection
                  </span>
                </div>

                {/* Products */}
                <div className="mt-auto grid grid-cols-2 gap-[2.4cqw] pt-[4cqw] max-[639px]:gap-3 max-[639px]:pt-8 sm:w-[78%]">
                  {[
                    { name: "Duvet cover", price: "€180", tone: "bg-sky/70" },
                    { name: "Pillow pair", price: "€64", tone: "bg-cream/75" },
                  ].map((p) => (
                    <div key={p.name}>
                      <div
                        className={`aspect-[16/9] rounded-[clamp(6px,1cqw,10px)] ring-1 ring-inset ring-fill-edge transition-[border-radius] duration-[var(--dur-slow)] ${p.tone} ${
                          morphed ? "rounded-[clamp(10px,1.8cqw,18px)]" : ""
                        }`}
                      />
                      <div className="mt-[1cqw] flex justify-between text-[clamp(10px,1.35cqw,12px)] max-[639px]:mt-1.5">
                        <span className="text-fg">{p.name}</span>
                        <span className="text-fg-subtle">{p.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comment pin */}
              {layout ? (
                <div className="pointer-events-none absolute z-20 w-64" style={{ left: pin.x, top: pin.y }}>
                  <AnimatePresence>
                    {pinOn ? <NotePin key="pin" n={1} tone="you" text={hero.demo.note} className="left-0 top-0" /> : null}
                  </AnimatePresence>
                </div>
              ) : null}

              {/* Verification chips */}
              <div className="absolute bottom-[4%] right-[4%] z-20 flex items-end gap-2">
                <AnimatePresence>
                  {desktopOk ? (
                    <motion.span
                      key="desktop"
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={spring.snappy}
                      className="inline-flex h-8 items-center gap-1.5 rounded-full border border-line-strong bg-surface/95 px-3 text-[11.5px] font-medium text-fg shadow-lg backdrop-blur"
                    >
                      <svg viewBox="0 0 16 16" className="size-3.5 text-fg-muted" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                        <rect x="1.5" y="2.5" width="13" height="9" rx="1.5" />
                        <path d="M5.5 14h5" strokeLinecap="round" />
                      </svg>
                      Desktop
                      <Tick className="size-3.5 text-mint" />
                    </motion.span>
                  ) : null}
                  {mobileOk ? (
                    <motion.span
                      key="mobile"
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={spring.snappy}
                      className="flex flex-col items-center gap-1.5 rounded-2xl border border-line-strong bg-surface/95 p-1.5 pb-2 shadow-lg backdrop-blur"
                    >
                      {/* Tiny phone showing the same, edited heading */}
                      <span className="relative block h-[86px] w-[46px] overflow-hidden rounded-[9px] border border-line-strong bg-surface-2">
                        <span className="absolute inset-0 bg-sky/[0.06]" />
                        <span className="relative mx-auto mt-1 block h-[3px] w-3 rounded-full bg-fg/15" />
                        <span className="relative mt-3 block px-1 font-serif text-[9px] font-normal leading-[0.95] text-fg">
                          Quietly made linens
                        </span>
                        <span className="relative ml-1 mt-1.5 block h-[7px] w-6 rounded-full bg-blue" />
                        <span className="relative mx-1 mt-2 grid grid-cols-2 gap-0.5">
                          <span className="aspect-square rounded-[2px] bg-sky/70 ring-1 ring-inset ring-fill-edge" />
                          <span className="aspect-square rounded-[2px] bg-cream/75 ring-1 ring-inset ring-fill-edge" />
                        </span>
                      </span>
                      <span className="flex items-center gap-1 text-[11px] font-medium text-fg">
                        Mobile
                        <Tick className="size-3 text-mint" />
                      </span>
                    </motion.span>
                  ) : null}
                </AnimatePresence>
              </div>

              {/* Cursors */}
              {layout ? (
                <>
                  <motion.div
                    className="absolute left-0 top-0 z-30"
                    initial={false}
                    animate={{ x: you.x, y: you.y, opacity: youOn ? 1 : 0 }}
                    transition={glide(youOn)}
                  >
                    <Cursor tone="you" label="You" x={0} y={0} />
                  </motion.div>
                  <motion.div
                    className="absolute left-0 top-0 z-30"
                    initial={false}
                    animate={{ x: agent.x, y: agent.y, opacity: agentOn ? 1 : 0 }}
                    transition={glide(agentOn)}
                  >
                    <Cursor tone="agent" label="Scaff" x={0} y={0} />
                  </motion.div>
                </>
              ) : null}
            </div>
          </AppWindow>
        </div>
      </div>
    </MotionConfig>
  );
}
