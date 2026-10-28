"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { nav } from "@/content/home";
import { DownloadButton, downloadHrefFor, usePlatform } from "@/components/ui/DownloadButton";
import { LogoMark } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { dur, ease, spring } from "@/components/motion/tokens";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";

const SHEET_ID = "mobile-nav-sheet";

// Which nav section is under the reading line (a thin band ~45% down the
// viewport). Null while the hero is on screen.
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join(",");

  useEffect(() => {
    const els = key
      .split(",")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (!els.length) return;

    const visible = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id);
          else visible.delete(e.target.id);
        }
        // Keep nav order so overlapping sections resolve predictably.
        const next = els.find((el) => visible.has(el.id))?.id ?? null;
        setActive(next);
      },
      { rootMargin: "-45% 0px -54% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [key]);

  return active;
}

// Shows the floating download pill once the hero CTA has scrolled above the
// viewport, and hides it again while the final CTA is on screen.
function useStickyCta() {
  const [heroPassed, setHeroPassed] = useState(false);
  const [finalVisible, setFinalVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero-cta");
    const final = document.getElementById("final-cta");
    const observers: IntersectionObserver[] = [];

    if (hero) {
      const io = new IntersectionObserver(([e]) => {
        setHeroPassed(!e.isIntersecting && e.boundingClientRect.top < 0);
      });
      io.observe(hero);
      observers.push(io);
    }
    if (final) {
      const io = new IntersectionObserver(([e]) => setFinalVisible(e.isIntersecting), {
        rootMargin: "0px 0px -10% 0px",
      });
      io.observe(final);
      observers.push(io);
    }
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return heroPassed && !finalVisible;
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 20 20" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
      <motion.path
        initial={false}
        animate={{ d: open ? "M5 5 L15 15" : "M3.5 7 L16.5 7" }}
        transition={{ duration: dur.med, ease: ease.out }}
      />
      <motion.path
        initial={false}
        animate={{ d: open ? "M5 15 L15 5" : "M3.5 13 L16.5 13" }}
        transition={{ duration: dur.med, ease: ease.out }}
      />
    </svg>
  );
}

export function Nav() {
  const reduced = useReducedMotionSafe();
  const ids = nav.links.map((l) => l.id);
  const active = useActiveSection(ids);
  const showSticky = useStickyCta();
  const downloadHref = downloadHrefFor(usePlatform());

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));
  useEffect(() => {
    const id = requestAnimationFrame(() => setScrolled(window.scrollY > 24));
    return () => cancelAnimationFrame(id);
  }, []);

  const closeMenu = useCallback((restoreFocus: boolean) => {
    setOpen(false);
    if (restoreFocus) requestAnimationFrame(() => menuButtonRef.current?.focus());
  }, []);

  // Mobile sheet: lock page scroll, make everything outside the header inert
  // (so screen readers can't wander behind the sheet), move focus in, Esc
  // closes, Tab cycles inside the header, and widening past md closes it.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    const header = headerRef.current;
    const outside = Array.from(header?.parentElement?.children ?? []).filter(
      (el): el is HTMLElement => el instanceof HTMLElement && el !== header && !el.inert,
    );
    outside.forEach((el) => (el.inert = true));

    const focusId = requestAnimationFrame(() => {
      sheetRef.current?.querySelector<HTMLElement>("a[href], button")?.focus();
    });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeMenu(true);
        return;
      }
      if (e.key !== "Tab" || !headerRef.current) return;
      const items = Array.from(
        headerRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
      ).filter((el) => el.getClientRects().length > 0);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const mq = window.matchMedia("(min-width: 768px)");
    const onMq = () => mq.matches && closeMenu(false);

    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      cancelAnimationFrame(focusId);
      root.style.overflow = prevOverflow;
      outside.forEach((el) => (el.inert = false));
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [open, closeMenu]);

  const solid = scrolled || open;

  return (
    <>
      <header
        ref={headerRef}
        className="fixed inset-x-0 top-0 z-40"
        // While the sheet is open, keep Lenis from scrolling the page behind it.
        data-lenis-prevent={open ? "" : undefined}
      >
        {/* Glass layer fades in after the first 24px of scroll */}
        <div
          aria-hidden
          className={`glass absolute inset-0 border-b transition-[opacity,border-color] duration-[var(--dur-med)] ease-out ${
            solid ? "border-line opacity-100" : "border-transparent opacity-0"
          }`}
        />
        <nav
          aria-label="Main"
          className={`relative mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 transition-[height] duration-[var(--dur-med)] ease-out sm:px-6 ${
            scrolled && !open ? "h-14" : "h-16 sm:h-[72px]"
          }`}
        >
          <div className="flex items-center">
            <a
              href="#top"
              aria-label="Scaff, back to top"
              className="-ml-1.5 flex h-11 items-center rounded-full px-1.5 transition-opacity duration-[var(--dur-fast)] hover:opacity-80 active:opacity-60"
            >
              <LogoMark className="size-8" />
            </a>
          </div>

          <ul className="hidden items-center md:flex">
            {nav.links.map((l) => {
              const isActive = active === l.id;
              return (
                <li key={l.id}>
                  <a
                    href={`#${l.id}`}
                    aria-current={isActive ? "location" : undefined}
                    className={`group relative flex h-11 items-center px-3 text-[13.5px] font-medium transition-colors duration-[var(--dur-fast)] lg:px-3.5 ${
                      isActive ? "text-fg" : "text-fg-muted hover:text-fg"
                    }`}
                  >
                    {isActive ? (
                      <motion.span
                        layoutId="nav-active-pill"
                        aria-hidden
                        className="absolute inset-x-0.5 inset-y-[7px] rounded-full bg-fg/[0.07]"
                        transition={reduced ? { duration: 0 } : spring.snappy}
                      />
                    ) : (
                      <span
                        aria-hidden
                        className="absolute inset-x-0.5 inset-y-[7px] rounded-full bg-fg/[0.04] opacity-0 transition-opacity duration-[var(--dur-fast)] group-hover:opacity-100 group-active:bg-fg/[0.08]"
                      />
                    )}
                    <span className="relative">{l.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="col-start-3 flex items-center justify-end gap-1 sm:gap-1.5">
            <ThemeToggle />
            <a
              href={nav.signInHref}
              className="hidden h-11 items-center rounded-full px-3.5 text-[13.5px] font-medium text-fg-muted transition-colors duration-[var(--dur-fast)] hover:bg-fg/5 hover:text-fg active:bg-fg/10 lg:inline-flex"
            >
              {nav.signIn}
            </a>
            <div className="hidden lg:block">
              <DownloadButton size="sm" showAlso={false} />
            </div>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => (open ? closeMenu(false) : setOpen(true))}
              aria-expanded={open}
              // The sheet only exists while open.
              aria-controls={open ? SHEET_ID : undefined}
              aria-label={open ? "Close menu" : "Open menu"}
              className="-mr-1.5 grid size-11 place-items-center rounded-full text-fg transition-colors duration-[var(--dur-fast)] hover:bg-fg/5 active:bg-fg/10 md:hidden"
            >
              <MenuIcon open={open} />
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {open ? (
            <motion.div
              ref={sheetRef}
              id={SHEET_ID}
              key="sheet"
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              data-lenis-prevent
              initial={{ opacity: 0, y: reduced ? 0 : -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduced ? 0 : -8 }}
              transition={{ duration: dur.med, ease: ease.out }}
              className="fixed inset-x-0 bottom-0 top-16 overflow-y-auto sm:top-[72px] overscroll-contain border-t border-line bg-ink px-4 pb-10 pt-4 sm:px-6 md:hidden"
            >
              <ul className="flex flex-col">
                {nav.links.map((l, i) => (
                  <motion.li
                    key={l.id}
                    initial={{ opacity: 0, y: reduced ? 0 : 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: dur.slow, ease: ease.out, delay: 0.03 * i }}
                  >
                    <a
                      href={`#${l.id}`}
                      onClick={() => closeMenu(false)}
                      aria-current={active === l.id ? "location" : undefined}
                      className="flex h-14 items-center justify-between border-b border-line font-serif text-[28px] font-normal tracking-[-0.02em] text-fg transition-colors duration-[var(--dur-fast)] hover:text-fg-muted active:text-fg-subtle"
                    >
                      {l.label}
                      {active === l.id ? <span aria-hidden className="size-2 rounded-full bg-accent" /> : null}
                    </a>
                  </motion.li>
                ))}
              </ul>
              <motion.div
                className="mt-8 flex flex-col items-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: dur.slow, delay: 0.15 }}
              >
                <DownloadButton size="lg" />
                <a
                  href={nav.signInHref}
                  className="inline-flex h-11 items-center rounded-full px-4 text-[15px] font-medium text-fg-muted transition-colors hover:bg-fg/5 hover:text-fg active:bg-fg/10"
                >
                  {nav.signIn}
                </a>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>

      {/* Sticky download pill. On phones it centers in the space left of the
          bottom-right pause button (right-5, 44px) so the two never overlap. */}
      <div className="pointer-events-none fixed inset-x-0 bottom-5 z-40 flex justify-center pl-4 pr-[76px] sm:px-[76px]">
        <AnimatePresence>
          {showSticky && !open ? (
            <motion.a
              key="sticky-cta"
              href={downloadHref}
              initial={{ opacity: 0, y: reduced ? 0 : 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduced ? 0 : 24 }}
              transition={reduced ? { duration: dur.fast } : spring.soft}
              className="group pointer-events-auto inline-flex h-12 items-center gap-2.5 whitespace-nowrap rounded-full border border-line-strong bg-fg pl-2 pr-4 text-[13.5px] font-medium text-ink shadow-[0_14px_36px_-12px_rgb(0_0_0/0.5)] transition-[transform,box-shadow] duration-[var(--dur-fast)] ease-out hover:-translate-y-px active:translate-y-0 active:scale-[0.98]"
            >
              <span className="grid size-8 place-items-center rounded-full bg-ink/10">
                <LogoMark className="size-6" />
              </span>
              <span>{nav.stickyCta}</span>
              <svg
                viewBox="0 0 16 16"
                className="size-3.5 transition-transform duration-[var(--dur-fast)] ease-out group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </motion.a>
          ) : null}
        </AnimatePresence>
      </div>
    </>
  );
}
