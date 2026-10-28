"use client";

import { useEffect } from "react";
import Lenis from "lenis";

let instance: Lenis | null = null;

// Scroll to an absolute page offset through Lenis when it is running, so a
// programmatic jump doesn't fight its inertia; native otherwise.
export function scrollToY(y: number, { immediate = false } = {}) {
  if (instance) instance.scrollTo(y, { immediate });
  else window.scrollTo({ top: y, behavior: immediate ? "auto" : "smooth" });
}

// Smooth scrolling, skipped entirely for reduced-motion users.
// Anchor links (#workflow etc.) are routed through Lenis so they glide too.
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.12, anchors: { offset: -72 } });
    instance = lenis;
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      instance = null;
    };
  }, []);

  return <>{children}</>;
}
