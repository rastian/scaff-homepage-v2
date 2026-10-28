"use client";

import { AnimatePresence, motion } from "motion/react";
import { spring } from "./tokens";

// A numbered comment pin with an optional speech bubble, like a review pin
// on a live page. Pink = a person's note, blue = the agent's reply.
export function NotePin({
  n,
  text,
  open = true,
  tone = "you",
  side = "right",
  className = "",
}: {
  n: number | string;
  text?: string;
  open?: boolean;
  tone?: "you" | "agent";
  side?: "right" | "left";
  className?: string;
}) {
  const pin = tone === "you" ? "bg-pink text-on-accent" : "bg-blue text-white";
  return (
    <motion.div
      className={`absolute z-20 flex items-start gap-2 ${side === "left" ? "flex-row-reverse" : ""} ${className}`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={spring.snappy}
    >
      <span
        className={`grid size-6 shrink-0 place-items-center rounded-full rounded-bl-none text-[11px] font-semibold shadow-lg ring-2 ring-white/80 ${pin}`}
      >
        {n}
      </span>
      <AnimatePresence>
        {open && text ? (
          <motion.span
            initial={{ opacity: 0, y: 4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="max-w-56 rounded-xl border border-line-strong bg-surface/95 px-3 py-2 text-xs leading-snug text-fg shadow-2xl backdrop-blur"
          >
            {text}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
