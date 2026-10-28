"use client";

import { useId, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { compare } from "@/content/home";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { dur, ease } from "@/components/motion/tokens";

type Row = (typeof compare.rows)[number];

const GRID = "grid grid-cols-[minmax(0,1fr)_4.5rem_5.5rem] sm:grid-cols-[minmax(0,1fr)_8rem_9rem]";

export function Compare() {
  const reduced = useReducedMotionSafe();
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { once: true, margin: "0px 0px -15% 0px" });
  const [open, setOpen] = useState(false);
  const extraId = useId();

  const first = compare.rows.slice(0, compare.collapsedCount);
  const rest = compare.rows.slice(compare.collapsedCount);
  const shown = reduced || inView;

  return (
    <section id="compare" aria-labelledby="compare-title" className="relative px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="compare-title"
          align="center"
          eyebrow={compare.eyebrow}
          title={compare.title[0]}
          muted={compare.title[1]}
          body={compare.body}
        />

        <div
          ref={cardRef}
          className="mx-auto mt-14 max-w-3xl overflow-hidden rounded-3xl border border-line-strong bg-surface shadow-window"
        >
          <div role="table" aria-label={compare.tableLabel} aria-rowcount={compare.rows.length + 1}>
            <div role="rowgroup">
              <div role="row" aria-rowindex={1} className={`${GRID} items-center bg-surface-2/60`}>
                <span role="columnheader" className="px-5 py-4 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle sm:px-7">
                  {compare.featureHeader}
                </span>
                <span
                  role="columnheader"
                  className="flex h-full items-center justify-center bg-blue/[0.06] px-2 py-4 text-[14px] font-semibold tracking-[-0.01em] text-fg"
                >
                  {compare.columns[0]}
                </span>
                <span role="columnheader" className="px-2 py-4 text-center text-[13px] font-medium text-fg-muted sm:text-[14px]">
                  {compare.columns[1]}
                </span>
              </div>
            </div>

            <div role="rowgroup">
              {first.map((r, i) => (
                <CompareRow key={r.label} row={r} index={i} visible={shown} delay={i * 0.06} reduced={reduced} />
              ))}
            </div>

            <motion.div
              id={extraId}
              role="rowgroup"
              initial={false}
              animate={{ height: open ? "auto" : 0 }}
              transition={{ duration: reduced ? 0 : dur.slow, ease: ease.spatial }}
              className="overflow-hidden"
              aria-hidden={!open}
              inert={!open}
            >
              {rest.map((r, i) => (
                <CompareRow
                  key={r.label}
                  row={r}
                  index={compare.collapsedCount + i}
                  visible={shown && open}
                  delay={0.08 + i * 0.06}
                  reduced={reduced}
                />
              ))}
            </motion.div>
          </div>

          <button
            type="button"
            aria-expanded={open}
            aria-controls={extraId}
            onClick={() => setOpen((o) => !o)}
            className="group/more flex min-h-13 w-full items-center justify-center gap-2 border-t border-line text-[14px] font-medium text-fg-muted transition-colors duration-[var(--dur-fast)] hover:bg-surface-2 hover:text-fg active:bg-ink-2 focus-visible:-outline-offset-2"
          >
            {open ? compare.showLess : compare.showAll(compare.rows.length)}
            <svg
              viewBox="0 0 12 12"
              className={`size-3 transition-transform duration-[var(--dur-med)] ${open ? "rotate-180" : ""}`}
              fill="none"
              aria-hidden
            >
              <path d="M3 4.5 6 7.5 9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

function CompareRow({
  row,
  index,
  visible,
  delay,
  reduced,
}: {
  row: Row;
  index: number;
  visible: boolean;
  delay: number;
  reduced: boolean;
}) {
  return (
    <motion.div
      role="row"
      aria-rowindex={index + 2}
      initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 8 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: reduced ? 1 : 0, y: reduced ? 0 : 8 }}
      transition={{ duration: reduced ? 0 : dur.slow, ease: ease.out, delay: visible && !reduced ? delay : 0 }}
      className={`${GRID} items-stretch border-t border-line transition-colors duration-[var(--dur-fast)] hover:bg-ink-2/50`}
    >
      <span role="rowheader" className="flex items-center px-5 py-4 text-[14px] leading-snug text-fg sm:px-7 sm:text-[15px]">
        {row.label}
      </span>
      <span role="cell" className="flex items-center justify-center bg-blue/[0.06] px-2">
        <Mark yes={row.scaff} strong />
      </span>
      <span role="cell" className="flex items-center justify-center px-2">
        <Mark yes={row.generic} />
      </span>
    </motion.div>
  );
}

function Mark({ yes, strong }: { yes: boolean; strong?: boolean }) {
  return (
    <>
      <span className="sr-only">{yes ? "Yes" : "No"}</span>
      {yes ? (
        <span
          aria-hidden
          className={`grid size-6 place-items-center rounded-full ${
            strong ? "bg-blue text-white" : "border border-line-strong text-fg-muted"
          }`}
        >
          <svg viewBox="0 0 12 12" className="size-3" fill="none">
            <path d="M2.5 6.3 4.9 8.6 9.5 3.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      ) : (
        <span aria-hidden className="h-0.5 w-3 rounded-full bg-fg-subtle/60" />
      )}
    </>
  );
}
