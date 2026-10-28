"use client";

import { useRef } from "react";

// Card whose border and surface light up under the pointer.
// Pure CSS variables, so it costs nothing when the pointer is elsewhere.
export function SpotlightCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      className={`group/spot relative isolate overflow-hidden rounded-3xl border border-line bg-ink-2 transition-colors duration-[var(--dur-med)] hover:border-line-strong ${className}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-[var(--dur-slow)] group-hover/spot:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), color-mix(in srgb, var(--blue) 14%, transparent), transparent 60%)",
        }}
      />
      {children}
    </div>
  );
}
