"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { faq } from "@/content/home";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { dur, ease } from "@/components/motion/tokens";

export function Faq() {
  const reduced = useReducedMotionSafe();
  // One open at a time; the first answer is open so the pattern is obvious.
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" aria-labelledby="faq-title" className="relative px-4 sm:px-6 py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading id="faq-title" eyebrow={faq.eyebrow} title={faq.title[0]} muted={faq.title[1]} body={faq.body} align="left" />
          <Reveal delay={0.1} className="mt-8 hidden font-mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle lg:block">
            {String(faq.items.length).padStart(2, "0")} {faq.countLabel}
          </Reveal>
        </div>

        <Reveal delay={0.06}>
          <ul className="border-b border-line">
            {faq.items.map((item, i) => {
              const isOpen = open === i;
              const btnId = `faq-q-${i}`;
              const panelId = `faq-a-${i}`;
              return (
                <li key={item.q} className="border-t border-line">
                  <h3>
                    <button
                      type="button"
                      id={btnId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="group -mx-3 flex min-h-16 w-[calc(100%+1.5rem)] items-center gap-4 rounded-xl px-3 py-4 text-left transition-colors duration-[var(--dur-fast)] hover:bg-fg/[0.03] active:bg-fg/[0.05]"
                    >
                      <span aria-hidden className="w-6 shrink-0 font-mono text-[11px] text-fg-subtle">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`flex-1 text-[17px] font-medium tracking-[-0.01em] transition-colors duration-[var(--dur-fast)] sm:text-lg ${
                          isOpen ? "text-fg" : "text-fg-muted group-hover:text-fg"
                        }`}
                      >
                        {item.q}
                      </span>
                      <PlusMinus open={isOpen} />
                    </button>
                  </h3>
                  {/* The wrapper stays mounted so aria-controls always points at
                      a real element; only its contents animate in and out. */}
                  <div
                    id={panelId}
                    role={isOpen ? "region" : undefined}
                    aria-labelledby={isOpen ? btnId : undefined}
                  >
                    <AnimatePresence initial={false}>
                      {isOpen ? (
                        <motion.div
                          key="panel"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            height: { duration: reduced ? 0 : dur.med, ease: ease.out },
                            opacity: { duration: dur.med, ease: ease.out },
                          }}
                          className="overflow-hidden"
                        >
                          <p className="max-w-2xl pb-6 pl-10 pr-4 text-pretty text-[15px] leading-relaxed text-fg-muted sm:pr-12">
                            {item.a}
                          </p>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

// Plus that morphs into a minus: the vertical bar rotates flat, and the
// whole glyph turns a quarter so the change reads as one motion.
function PlusMinus({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden
      className={`relative grid size-8 shrink-0 place-items-center rounded-full border transition-[background-color,border-color,color,transform] duration-[var(--dur-med)] ease-out ${
        open
          ? "rotate-180 border-accent bg-accent text-ink"
          : "border-line-strong text-fg-muted group-hover:border-accent group-hover:text-accent"
      }`}
    >
      <span className="absolute h-[1.5px] w-3 rounded-full bg-current" />
      <span
        className={`absolute h-3 w-[1.5px] rounded-full bg-current transition-transform duration-[var(--dur-med)] ease-out ${
          open ? "rotate-90 scale-y-0" : ""
        }`}
      />
    </span>
  );
}
