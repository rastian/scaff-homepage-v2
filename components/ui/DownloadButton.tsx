"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";
import { downloads } from "@/content/home";
import { dur, ease } from "@/components/motion/tokens";

export type Platform = "macArm" | "macIntel" | "windows" | "other";

// Best guess at the visitor's platform. Browsers don't expose Apple silicon vs
// Intel reliably, so Macs default to Apple silicon and the other installers
// stay one click away in the "Also for" line. Phones, tablets, Linux and
// ChromeOS can't run Scaff, so they get the downloads page instead of an
// installer they can't open.
function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "macArm";
  const ua = navigator.userAgent;
  // iPadOS reports itself as a Mac; touch points give it away.
  const iPad = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;
  if (iPad || /iPhone|iPad|iPod|Android|CrOS|Linux/i.test(ua)) {
    return /Windows/i.test(ua) ? "windows" : "other";
  }
  if (/Windows/i.test(ua)) return "windows";
  return "macArm";
}

const noopSubscribe = () => () => {};

export function usePlatform(): Platform {
  return useSyncExternalStore(noopSubscribe, detectPlatform, () => "macArm" as Platform);
}

// Where a download link points for a platform: its installer, or the
// downloads page where Scaff can't run.
export function downloadHrefFor(platform: Platform): string {
  return platform === "other" ? downloads.all : downloads[platform].href;
}

function AppleGlyph() {
  return (
    <svg viewBox="0 0 14 17" className="size-[15px] -mt-0.5" fill="currentColor" aria-hidden>
      <path d="M11.6 9c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3-1.7-1.3-.1-2.5.8-3.2.8-.7 0-1.7-.8-2.8-.7C3 4.2 1.7 5 1 6.3c-1.5 2.6-.4 6.4 1.1 8.5.7 1 1.5 2.2 2.6 2.1 1-.04 1.4-.7 2.7-.7 1.2 0 1.6.7 2.7.6 1.1 0 1.8-1 2.5-2 .8-1.2 1.1-2.3 1.1-2.4 0 0-2.1-.8-2.1-3.4ZM9.6 2.8c.6-.7 1-1.7.9-2.8-.9 0-1.9.6-2.6 1.3-.5.6-1 1.7-.9 2.7 1 .1 2-.5 2.6-1.2Z" />
    </svg>
  );
}

function WindowsGlyph() {
  return (
    <svg viewBox="0 0 16 16" className="size-[14px]" fill="currentColor" aria-hidden>
      <path d="M0 2.3 6.5 1.4v6.2H0V2.3Zm7.3-1L16 0v7.6H7.3V1.3ZM0 8.4h6.5v6.2L0 13.7V8.4Zm7.3 0H16V16l-8.7-1.2V8.4Z" />
    </svg>
  );
}

// Primary download CTA.
// States: default → hover → active (pressed) → started ("Downloading…" for
// 4s, so the click has visible feedback even though the browser takes over).
export function DownloadButton({
  size = "lg",
  showAlso = true,
  exclude = [],
  className = "",
}: {
  size?: "sm" | "lg";
  showAlso?: boolean;
  // Installers already offered elsewhere (e.g. a secondary button) to leave out of the meta line.
  exclude?: Platform[];
  className?: string;
}) {
  const platform = usePlatform();
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    const t = setTimeout(() => setStarted(false), 4000);
    return () => clearTimeout(t);
  }, [started]);

  const big = size === "lg";
  const unsupported = platform === "other";
  const target = unsupported ? null : downloads[platform];
  const href = downloadHrefFor(platform);
  const label = target ? `Download for ${target.label}` : big ? "Get Scaff for Mac or Windows" : "Get Scaff";

  const onClick = (e: React.MouseEvent) => {
    // Cmd/Ctrl/middle clicks open elsewhere; only a plain click starts a download here.
    if (unsupported || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    setStarted(true);
  };

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <a
        href={href}
        onClick={onClick}
        // Fixed name, so swapping in the aria-hidden "Downloading…" state never empties it.
        aria-label={label}
        className={`group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full bg-fg font-medium text-ink shadow-[0_8px_24px_-8px_rgb(0_0_0/0.5)] transition-[transform,box-shadow,background-color] duration-[var(--dur-fast)] ease-out hover:-translate-y-px hover:shadow-[0_14px_32px_-10px_rgb(0_0_0/0.55)] active:translate-y-0 active:scale-[0.98] ${
          big ? "h-13 min-w-[15rem] px-7 text-[15px]" : "h-11 min-w-[10.5rem] px-4 text-sm"
        }`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {started ? (
            <motion.span
              key="started"
              aria-hidden
              className="flex items-center gap-2"
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -14, opacity: 0 }}
              transition={{ duration: dur.med, ease: ease.out }}
            >
              <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="m3 8.5 3.2 3L13 4.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {big ? "Downloading… check Downloads" : "Downloading…"}
            </motion.span>
          ) : (
            <motion.span
              key="idle"
              className="flex items-center gap-2.5"
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -14, opacity: 0 }}
              transition={{ duration: dur.med, ease: ease.out }}
            >
              {unsupported ? null : platform === "windows" ? <WindowsGlyph /> : <AppleGlyph />}
              <span>{label}</span>
            </motion.span>
          )}
        </AnimatePresence>
      </a>
      {/* Announced separately; the link keeps its aria-label throughout. */}
      <span role="status" className="sr-only">
        {started ? "Download started. Check your Downloads folder." : ""}
      </span>
      {showAlso ? <MetaLine platform={platform} exclude={exclude} /> : null}
    </div>
  );
}

const metaLink =
  "py-3 underline decoration-line-strong underline-offset-2 transition-colors duration-[var(--dur-fast)] hover:text-fg hover:decoration-fg";

function Dot() {
  return (
    <>
      <span aria-hidden className="px-1.5 opacity-60">
        ·
      </span>
      {/* Spoken separator, so screen readers don't run items together. */}
      <span className="sr-only">, </span>
    </>
  );
}

// One quiet line under a download button: the two reassurances that matter at
// the moment of clicking, the other installers, and the privacy link.
const installers = ["macArm", "macIntel", "windows"] as const;

function MetaLine({ platform, exclude }: { platform: Platform; exclude: Platform[] }) {
  const m = downloads.meta;
  const privacy = (
    <a href={downloads.privacy} className={metaLink}>
      {m.privacy}
    </a>
  );

  if (platform === "other") {
    return (
      <p className="text-center text-[13px] text-fg-subtle">
        {m.runsOn}
        <Dot />
        {privacy}
      </p>
    );
  }

  const others = installers.filter((p) => p !== platform && !exclude.includes(p));
  return (
    <p className="text-balance text-center text-[13px] leading-relaxed text-fg-subtle">
      {m.perks.map((perk) => (
        <span key={perk}>
          {perk}
          <Dot />
        </span>
      ))}
      {others.length ? (
        <>
          {m.alsoFor}{" "}
          {others.map((p, i) => (
            <span key={p}>
              {i > 0 ? (i === others.length - 1 ? ` ${m.and} ` : ", ") : null}
              <a href={downloads[p].href} className={metaLink}>
                {downloads[p].label}
              </a>
            </span>
          ))}
          <Dot />
        </>
      ) : null}
      {privacy}
    </p>
  );
}

// The other platform's installer as a quieter second button: Windows for Mac
// visitors, Mac for Windows visitors. Renders nothing where Scaff can't run.
export function counterpartOf(platform: Platform): (typeof installers)[number] | null {
  if (platform === "other") return null;
  return platform === "windows" ? "macArm" : "windows";
}

export function SecondaryDownload({ className = "" }: { className?: string }) {
  const platform = usePlatform();
  const alt = counterpartOf(platform);
  if (!alt) return null;
  const target = downloads[alt];
  return (
    <a
      href={target.href}
      className={`inline-flex h-13 items-center gap-2.5 rounded-full px-5 text-[15px] font-medium text-fg-muted transition-[background-color,color,transform] duration-[var(--dur-fast)] ease-out hover:bg-fg/5 hover:text-fg active:scale-[0.98] ${className}`}
    >
      {alt === "windows" ? <WindowsGlyph /> : <AppleGlyph />}
      Download for {target.label}
    </a>
  );
}
