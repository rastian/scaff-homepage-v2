# Scaff homepage revamp

A prototype of the new [scaff.design](https://scaff.design) homepage: a single long page that shows the Scaff workflow (design system → live annotation → review → pull request) with live, looping product demos instead of static screenshots.

## Stack

- [Next.js 16](https://nextjs.org) (App Router) and React 19
- Tailwind CSS v4 (tokens in `app/globals.css`)
- [motion](https://motion.dev) (`motion/react`) for animation, [Lenis](https://lenis.darkroom.engineering) for smooth scrolling
- Geist / Geist Mono for UI, Newsreader for serif headlines (via `next/font`)

## Scripts

```bash
npm run dev        # dev server on http://localhost:3000
npm run build      # production build
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
```

## Structure

```
app/                  layout (fonts, metadata, theme script), page, globals.css, icon.svg
components/sections/  one file per homepage section (Hero, HowItWorks, Canvas, ...)
components/motion/    motion primitives: Reveal, WordReveal, Marquee, NotePin,
                      DemoPlayback (global pause + useDemoActive), tokens.ts
components/ui/        shared UI: SectionHeading, DownloadButton, AppWindow, ThemeToggle, ...
content/home.ts       every piece of homepage copy and every link
public/media/         product screenshots (studio-tour-poster.jpg is also the OG image)
```

## Conventions

- **Copy lives in `content/home.ts`.** Sections stay presentational; don't hardcode user-facing strings or URLs in components. Section headings are two explicit lines (`title: [line1, line2]`).
- **Motion tokens.** Durations, easings and springs come from `components/motion/tokens.ts` (JS) and the `--dur-*` / `--ease-out` custom properties (CSS). Don't invent one-off curves.
- **Every loop is pausable.** Any looping demo uses `useDemoActive()` from `DemoPlayback.tsx` and spreads its `hoverProps`, so it runs only when on screen, in a visible tab, not hovered or focused, and not stopped by the global pause button (WCAG 2.2.2). CSS loops freeze via `:root[data-paused]`.
- **Reduced motion.** Use `useReducedMotionSafe()` (hydration-safe) for branching logic; the page is wrapped in `<MotionConfig reducedMotion="user">` and a global CSS rule neutralises CSS animations. Reduced-motion users start paused.
- **Colour.** Accents are blue, pink, yellow and mint only, defined as tokens for both themes (dark default, light toggle). No orange anywhere, except the clay `#D97757` spark in the Claude Startups badge.
- **Contrast.** Text meets WCAG AA (4.5:1, or 3:1 for large text) on every surface in both themes; check any new token pairing before using it.

## Known follow-ups

- Switch to `LazyMotion` + `m` components to cut the motion bundle.
- Preload the Newsreader italic face used in headline accents.
- Replace the OG image (currently the studio tour poster) with a purpose-made one.
- Swap the Claude badge spark for the official Claude mark asset.
- Get legal sign-off on the shortened privacy line under the download buttons.
