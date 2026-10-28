"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

// The theme lives on <html data-theme>; an inline script in the layout sets it
// before paint from localStorage, so this just reads and writes that attribute.
function subscribe(onChange: () => void) {
  const mo = new MutationObserver(onChange);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}
// Dark is the default; only an explicit "light" means light.
const getTheme = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");

function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  // Keep the mobile browser toolbar in step with the page (the layout script sets it on load).
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "light" ? "#f7f4ef" : "#161615");
  // Storage can be unavailable in private windows.
  try {
    localStorage.setItem("scaff-theme", theme);
  } catch {}
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "dark" as Theme);
  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      className="grid size-11 place-items-center rounded-full text-fg-muted transition-colors duration-[var(--dur-fast)] hover:bg-fg/5 hover:text-fg"
    >
      {dark ? (
        <svg viewBox="0 0 20 20" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <circle cx="10" cy="10" r="3.6" />
          <path d="M10 1.8v2M10 16.2v2M1.8 10h2M16.2 10h2M4.2 4.2l1.4 1.4M14.4 14.4l1.4 1.4M4.2 15.8l1.4-1.4M14.4 5.6l1.4-1.4" strokeLinecap="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 20 20" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <path d="M16.5 12.2A7 7 0 0 1 7.8 3.5a7 7 0 1 0 8.7 8.7Z" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}
