"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { useReducedMotionSafe } from "./useReducedMotionSafe";

// Global play/pause for every looping demo on the page (WCAG 2.2.2: moving
// content that runs for more than 5s must be pausable). Reduced-motion users
// start paused.
type Ctx = { paused: boolean; setPaused: (p: boolean) => void };
const PlaybackContext = createContext<Ctx>({ paused: false, setPaused: () => {} });

export function DemoPlaybackProvider({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotionSafe();
  const [userPaused, setPaused] = useState<boolean | null>(null);
  const paused = userPaused ?? reduced;
  // Mirror onto <html data-paused> so CSS-only loops (pulse rings, spinners)
  // freeze too; see app/globals.css.
  useEffect(() => {
    const root = document.documentElement;
    if (paused) root.dataset.paused = "";
    else delete root.dataset.paused;
  }, [paused]);
  return <PlaybackContext.Provider value={{ paused, setPaused }}>{children}</PlaybackContext.Provider>;
}

export function usePlayback() {
  return useContext(PlaybackContext);
}

// True while a demo should be advancing: on screen, tab visible, not paused
// globally, not hovered (hovering a demo freezes it so people can read) and
// without keyboard focus inside it (so a loop never changes a control the
// user is operating). Spread hoverProps on the element that holds `ref`.
export function useDemoActive<T extends Element>() {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { margin: "-10% 0px -10% 0px" });
  const { paused } = usePlayback();
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onVis = () => setVisible(document.visibilityState === "visible");
    onVis(); // a page opened in a background tab starts hidden
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const hoverProps = {
    onPointerEnter: (e: React.PointerEvent) => e.pointerType === "mouse" && setHovered(true),
    onPointerLeave: () => setHovered(false),
    onFocus: () => setFocused(true),
    onBlur: (e: React.FocusEvent) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
    },
  };

  return { ref, active: inView && visible && !paused && !hovered && !focused, paused, hoverProps };
}

// Floating pause / play control, bottom-right, like hera.video.
export function PlaybackToggle() {
  const { paused, setPaused } = usePlayback();
  return (
    <button
      type="button"
      onClick={() => setPaused(!paused)}
      // Fixed label + aria-pressed: "Pause animations, pressed" means paused.
      aria-pressed={paused}
      aria-label="Pause animations"
      className="fixed bottom-5 right-5 z-50 grid size-11 place-items-center rounded-full border border-line-strong bg-surface text-fg shadow-lg transition-[transform,background-color] duration-[var(--dur-fast)] hover:bg-surface-2 active:scale-95"
    >
      {paused ? (
        <svg viewBox="0 0 16 16" className="size-4" fill="currentColor" aria-hidden>
          <path d="M4.5 2.8v10.4a.6.6 0 0 0 .9.5l8.2-5.2a.6.6 0 0 0 0-1L5.4 2.3a.6.6 0 0 0-.9.5Z" />
        </svg>
      ) : (
        <svg viewBox="0 0 16 16" className="size-4" fill="currentColor" aria-hidden>
          <rect x="3.5" y="2.5" width="3" height="11" rx="1" />
          <rect x="9.5" y="2.5" width="3" height="11" rx="1" />
        </svg>
      )}
    </button>
  );
}
