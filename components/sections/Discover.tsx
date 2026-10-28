"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { discover } from "@/content/home";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AppWindow } from "@/components/ui/AppWindow";
import { Reveal } from "@/components/motion/Reveal";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { dur, ease, spring } from "@/components/motion/tokens";

const tabId = (id: string) => `discover-tab-${id}`;
const PANEL_ID = "discover-panel";

export function Discover() {
  const reduced = useReducedMotionSafe();
  const [index, setIndex] = useState(0);
  // Tabs whose screenshot is mounted: the active one, any shown before (so the
  // cross-fade out still has its image), and any the reader hovers or focuses.
  const [loaded, setLoaded] = useState<ReadonlySet<number>>(() => new Set([0]));
  const preload = (i: number) => setLoaded((s) => (s.has(i) ? s : new Set(s).add(i)));
  if (!loaded.has(index)) preload(index);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tabs = discover.tabs;
  const current = tabs[index];

  // Automatic activation: arrow keys move focus and select, per WAI-ARIA tabs.
  const select = (next: number) => {
    const i = (next + tabs.length) % tabs.length;
    setIndex(i);
    tabRefs.current[i]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const keys: Record<string, () => void> = {
      ArrowRight: () => select(index + 1),
      ArrowLeft: () => select(index - 1),
      Home: () => select(0),
      End: () => select(tabs.length - 1),
    };
    const fn = keys[e.key];
    if (fn) {
      e.preventDefault();
      fn();
    }
  };

  return (
    <section
      id="discover"
      aria-labelledby="discover-title"
      className="relative px-4 sm:px-6 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="discover-title"
          eyebrow={discover.eyebrow}
          title={discover.title[0]}
          muted={discover.title[1]}
          body={discover.body}
          align="center"
        />

        <Reveal delay={0.08} className="mt-12 flex justify-center">
          <div
            role="tablist"
            aria-label="Discover sections"
            onKeyDown={onKeyDown}
            className="inline-flex max-w-full gap-1 overflow-x-auto rounded-full border border-line bg-surface-2 p-1 [scrollbar-width:none]"
          >
            {tabs.map((t, i) => {
              const on = i === index;
              return (
                <button
                  key={t.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={tabId(t.id)}
                  aria-selected={on}
                  aria-controls={PANEL_ID}
                  tabIndex={on ? 0 : -1}
                  onClick={() => setIndex(i)}
                  onPointerEnter={() => preload(i)}
                  onFocus={() => preload(i)}
                  className={`relative min-h-11 shrink-0 whitespace-nowrap rounded-full px-4 text-sm font-medium transition-colors duration-[var(--dur-fast)] active:scale-[0.98] sm:px-5 ${
                    on ? "text-fg" : "text-fg-muted hover:text-fg"
                  }`}
                >
                  {on ? (
                    <motion.span
                      layoutId="discover-pill"
                      aria-hidden
                      className="absolute inset-0 rounded-full border border-line-strong bg-surface shadow-[0_2px_8px_-2px_rgb(0_0_0/0.25)]"
                      transition={reduced ? { duration: 0 } : spring.snappy}
                    />
                  ) : null}
                  <span className="relative">{t.label}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <div
          role="tabpanel"
          id={PANEL_ID}
          aria-labelledby={tabId(current.id)}
          tabIndex={0}
          className="mt-8 rounded-[24px] focus-visible:outline-offset-4"
        >
          <div className="mx-auto flex min-h-[5rem] max-w-xl sm:min-h-[3.5rem] items-start justify-center text-center">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={current.id}
                initial={{ opacity: 0, y: reduced ? 0 : 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduced ? 0 : -6 }}
                transition={{ duration: dur.med / 2, ease: ease.out }}
                className="text-pretty text-[15px] leading-relaxed text-fg-muted"
              >
                {current.body}
              </motion.p>
            </AnimatePresence>
          </div>

          <Reveal delay={0.12} className="mx-auto mt-8 max-w-7xl">
            <AppWindow
              title={discover.windowTitle}
              toolbar={
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={current.id}
                    aria-hidden
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: dur.fast }}
                    className="hidden font-mono text-[11px] text-fg-subtle sm:inline"
                  >
                    {current.label}
                  </motion.span>
                </AnimatePresence>
              }
            >
              {/* Screenshots stay mounted and stacked once loaded, so switching
                  tabs is a true cross-fade with no layout shift. Unvisited tabs
                  mount on hover/focus, so they are usually ready before the click. */}
              {/* Dark inset so the screenshots sit framed in the light theme too. */}
              <div className="bg-[#1b1b1a] p-1.5">
                <div className="relative aspect-[12/7] w-full overflow-hidden rounded-xl bg-[#1b1b1a]">
                  {tabs.map((t, i) => {
                    const on = i === index;
                    if (!loaded.has(i)) return null;
                    return (
                      <motion.div
                        key={t.id}
                        className="absolute inset-0"
                        initial={false}
                        animate={{
                          opacity: on ? 1 : 0,
                          scale: on || reduced ? 1 : 1.01,
                        }}
                        transition={{ duration: dur.med, ease: ease.out }}
                        aria-hidden={!on}
                      >
                        <Image
                          src={t.image}
                          alt={
                            on ? `Scaff Discover, ${t.label}: ${t.body}` : ""
                          }
                          width={2880}
                          height={1680}
                          sizes="(min-width: 1280px) 1216px, (min-width: 640px) calc(100vw - 48px), calc(100vw - 32px)"
                          fetchPriority={on ? undefined : "low"}
                          className="h-full w-full object-cover object-top"
                        />
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </AppWindow>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
