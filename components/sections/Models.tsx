"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { models } from "@/content/home";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { Marquee } from "@/components/motion/Marquee";
import { useDemoActive } from "@/components/motion/DemoPlayback";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { dur, ease, spring } from "@/components/motion/tokens";

export function Models() {
  return (
    <section id="models" aria-labelledby="models-title" className="relative px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
          <SectionHeading
            id="models-title"
            eyebrow={models.eyebrow}
            title={models.title[0]}
            muted={models.title[1]}
            body={models.body}
            align="left"
          />
          <Reveal delay={0.08}>
            <KeyPanel />
          </Reveal>
        </div>
      </div>

      <ProviderMarquee />
    </section>
  );
}

/* ── Settings → Models panel ───────────────────────────────── */

type Phase = "typing" | "ready" | "connecting" | "connected";
const KEY = models.keyDemo.placeholder;

function KeyPanel() {
  const reduced = useReducedMotionSafe();
  const { ref, active, hoverProps } = useDemoActive<HTMLDivElement>();
  const [typed, setTyped] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");

  // One scripted step per timeout, so pausing (offscreen / hover / global) freezes it in place.
  useEffect(() => {
    if (!active || reduced) return;
    let t: number;
    if (phase === "typing") {
      t = window.setTimeout(
        () => (typed < KEY.length ? setTyped(typed + 1) : setPhase("ready")),
        typed === 0 ? 700 : 45 + ((typed * 37) % 50),
      );
    } else if (phase === "ready") {
      t = window.setTimeout(() => setPhase("connecting"), 450);
    } else if (phase === "connecting") {
      t = window.setTimeout(() => setPhase("connected"), 1200);
    } else {
      t = window.setTimeout(() => {
        setTyped(0);
        setPhase("typing");
      }, 4200);
    }
    return () => window.clearTimeout(t);
  }, [active, reduced, phase, typed]);

  const shownPhase: Phase = reduced ? "connected" : phase;
  const shownKey = reduced ? KEY : KEY.slice(0, typed);
  const connected = shownPhase === "connected";
  const typing = shownPhase === "typing";

  return (
    <div
      ref={ref}
      {...hoverProps}
      className="overflow-hidden rounded-3xl border border-line-strong bg-surface shadow-window"
    >
      <p className="sr-only">
        Example: pasting an Anthropic API key into Settings, Models, and connecting it. The key stays on your computer.
      </p>

      {/* header */}
      <div aria-hidden className="flex h-11 items-center gap-3 border-b border-line bg-surface-2/70 px-4">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-line-strong" />
          <span className="size-2.5 rounded-full bg-line-strong" />
          <span className="size-2.5 rounded-full bg-line-strong" />
        </div>
        <span className="text-xs font-medium text-fg-muted">{models.keyDemo.label}</span>
      </div>

      <div className="grid sm:grid-cols-[9.5rem_minmax(0,1fr)]">
        {/* sidebar */}
        <nav aria-hidden className="hidden flex-col gap-0.5 border-r border-line bg-ink-2/50 p-3 sm:flex">
          {["General", "Models", "Design systems", "Privacy"].map((l) => (
            <span
              key={l}
              className={`rounded-lg px-2.5 py-1.5 text-[12px] ${
                l === "Models" ? "bg-surface font-medium text-fg shadow-sm" : "text-fg-subtle"
              }`}
            >
              {l}
            </span>
          ))}
        </nav>

        <div className="min-w-0 p-5 sm:p-6">
          {/* key row */}
          <div aria-hidden>
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
              <span className="flex items-center gap-2 text-[13px] font-medium text-fg">
                <Monogram name="Anthropic" />
                Anthropic API key
              </span>
              <span className="flex items-center gap-1 text-[11px] text-fg-subtle">
                <LockIcon />
                Stored on this computer
              </span>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <div
                className={`flex h-11 min-w-0 flex-1 items-center rounded-xl border bg-ink-2/60 px-3 font-mono text-[13px] transition-colors duration-[var(--dur-med)] ${
                  typing && typed > 0 ? "border-blue/60" : connected ? "border-mint/50" : "border-line-strong"
                }`}
              >
                <span className="truncate text-fg">{shownKey}</span>
                {typing ? <span className="ml-px h-4 w-px shrink-0 animate-pulse bg-fg" /> : null}
                {shownKey.length === 0 ? <span className="truncate text-fg-subtle">Paste an API key</span> : null}
              </div>

              <ConnectButton phase={shownPhase} reduced={reduced} />
            </div>
          </div>

          <div className="my-5 h-px bg-line" />

          <ProviderToggles anthropicConnected={connected} />
        </div>
      </div>
    </div>
  );
}

function ConnectButton({ phase, reduced }: { phase: Phase; reduced: boolean }) {
  const tone =
    phase === "connected"
      ? "bg-mint/15 text-mint"
      : phase === "connecting"
        ? "bg-surface-2 text-fg-muted"
        : phase === "ready"
          ? "bg-fg text-ink"
          : "bg-fg/80 text-ink";
  return (
    <motion.span
      layout={!reduced}
      transition={spring.snappy}
      className={`inline-flex h-11 shrink-0 items-center justify-center overflow-hidden rounded-xl px-4 text-[13px] font-medium transition-colors duration-[var(--dur-med)] ${tone}`}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={phase === "ready" ? "typing" : phase}
          initial={{ opacity: 0, y: reduced ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduced ? 0 : -8 }}
          transition={{ duration: dur.fast, ease: ease.out }}
          className="inline-flex items-center gap-2 whitespace-nowrap"
        >
          {phase === "connecting" ? (
            <>
              <svg viewBox="0 0 16 16" className="size-4 animate-spin" fill="none">
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
                <path d="M14 8a6 6 0 0 0-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="sr-only">Connecting</span>
            </>
          ) : phase === "connected" ? (
            <>
              <motion.svg viewBox="0 0 16 16" className="size-4" fill="none">
                <motion.path
                  d="M3.5 8.4 6.6 11.4 12.5 4.8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: reduced ? 1 : 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: dur.slow, ease: ease.out }}
                />
              </motion.svg>
              {models.keyDemo.connected}
            </>
          ) : (
            "Connect"
          )}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
}

const TOGGLE_ROWS = [
  { name: "Anthropic", sub: "API key" },
  { name: "OpenAI", sub: "Signed in with ChatGPT" },
  { name: "Ollama", sub: "Running on this computer" },
] as const;

function ProviderToggles({ anthropicConnected }: { anthropicConnected: boolean }) {
  // Anthropic starts off and switches on once its key connects (and off again when the demo loops),
  // until the user flips it themselves: after that the loop leaves their choice alone.
  const [on, setOn] = useState<boolean[]>([anthropicConnected, true, false]);
  const [touched, setTouched] = useState(false);
  const [prevConnected, setPrevConnected] = useState(anthropicConnected);
  if (prevConnected !== anthropicConnected) {
    setPrevConnected(anthropicConnected);
    if (!touched) setOn((prev) => [anthropicConnected, prev[1], prev[2]]);
  }
  return (
    <div>
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">Providers</p>
      <ul className="flex flex-col">
        {TOGGLE_ROWS.map((r, i) => {
          const status = i === 0 ? (anthropicConnected ? models.keyDemo.connected : models.keyDemo.notConnected) : r.sub;
          return (
            <li key={r.name} className="flex items-center gap-3 py-1">
              <Monogram name={r.name} />
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-medium text-fg">{r.name}</span>
                <span
                  className={`block truncate text-[11px] transition-colors duration-[var(--dur-med)] ${
                    i === 0 && anthropicConnected ? "text-mint" : "text-fg-subtle"
                  }`}
                >
                  {i === 0 ? <span aria-hidden>{status}</span> : status}
                </span>
              </span>
              <Switch
                label={`Use ${r.name} in chats`}
                checked={on[i]}
                onChange={(v) => {
                  if (i === 0) setTouched(true);
                  setOn((prev) => prev.map((p, j) => (j === i ? v : p)));
                }}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Switch({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className="group/sw -mr-2 grid size-11 shrink-0 place-items-center rounded-full"
    >
      <span
        className={`relative flex h-6 w-10 items-center rounded-full p-0.5 transition-colors duration-[var(--dur-med)] group-active/sw:scale-95 ${
          checked ? "bg-blue" : "bg-line-strong group-hover/sw:bg-fg-subtle/50"
        }`}
      >
        <motion.span
          className="size-5 rounded-full bg-white shadow-sm"
          animate={{ x: checked ? 16 : 0 }}
          transition={spring.snappy}
        />
      </span>
    </button>
  );
}

function Monogram({ name }: { name: string }) {
  return (
    <span
      aria-hidden
      className={`grid size-7 shrink-0 place-items-center rounded-full border border-line-strong bg-surface-2 text-[12px] font-semibold text-fg-muted`}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 12 12" className="size-3" fill="none" aria-hidden>
      <rect x="2.25" y="5.25" width="7.5" height="5.25" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4 5.25V3.9a2 2 0 0 1 4 0v1.35" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

/* ── Provider marquee ──────────────────────────────────────── */

function ProviderMarquee() {
  const { ref, active, hoverProps } = useDemoActive<HTMLDivElement>();
  return (
    <div className="mx-auto mt-20 max-w-7xl">
      <p className="mb-5 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle">Works with</p>
      <div ref={ref} {...hoverProps}>
        <Marquee duration={36} className={active ? "" : "[&>div]:[animation-play-state:paused]!"}>
          {models.providers.map((p) => (
            <span
              key={p}
              className="inline-flex h-12 shrink-0 items-center rounded-full border border-line bg-surface px-5 text-[14px] font-medium text-fg-muted"
            >
              {p}
            </span>
          ))}
        </Marquee>
      </div>
    </div>
  );
}
