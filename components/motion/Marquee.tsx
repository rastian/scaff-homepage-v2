"use client";

import { usePlayback } from "./DemoPlayback";

// Infinite horizontal marquee. Content is duplicated once; the second copy is
// hidden from assistive tech. Pauses on hover and with the global pause
// button; static under reduced motion (the global reduced-motion rule stops it).
export function Marquee({
  children,
  duration = 40,
  className = "",
}: {
  children: React.ReactNode;
  duration?: number;
  className?: string;
}) {
  const { paused } = usePlayback();
  return (
    <div
      className={`group/mq relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)] ${className}`}
    >
      <div
        // Longhands only (a shorthand would reset play-state); the hover class
        // is !important so it beats the inline longhand.
        className="flex w-max gap-4 group-hover/mq:[animation-play-state:paused]!"
        style={{
          animationName: "marquee",
          animationDuration: `${duration}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          animationPlayState: paused ? "paused" : undefined,
        }}
      >
        <div className="flex shrink-0 gap-4">{children}</div>
        <div className="flex shrink-0 gap-4" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
