"use client";

import { motion, type MotionValue } from "motion/react";

export type CursorTone = "you" | "agent";

const toneClass: Record<CursorTone, string> = {
  you: "bg-pink text-on-accent ring-1 ring-fill-edge",
  agent: "bg-blue text-white",
};

const toneFill: Record<CursorTone, string> = {
  you: "var(--pink)",
  agent: "var(--blue)",
};

// A multiplayer-style cursor with a name tag. Position it with x/y motion
// values or plain numbers (px, relative to the positioned parent).
export function Cursor({
  tone,
  label,
  x,
  y,
  className = "",
}: {
  tone: CursorTone;
  label: string;
  x: MotionValue<number> | number;
  y: MotionValue<number> | number;
  className?: string;
}) {
  return (
    <motion.div
      aria-hidden
      className={`pointer-events-none absolute left-0 top-0 z-30 ${className}`}
      style={{ x, y }}
    >
      <svg width="20" height="22" viewBox="0 0 20 22" className="drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]">
        <path
          d="M2 1.5 L18 10.2 L10.6 11.8 L7.2 19.8 Z"
          fill={toneFill[tone]}
          stroke="white"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className={`ml-4 -mt-1 inline-block whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium leading-4 shadow-lg ${toneClass[tone]}`}
      >
        {label}
      </span>
    </motion.div>
  );
}
