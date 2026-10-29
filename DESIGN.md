---
name: Scaff Marketing
version: alpha
description: Warm near-black marketing site for a design-in-code product — Intent-style editorial serif over a living canvas of app demos.

colors:
  background: "#f7f4ef"
  on-background: "#14130f"
  surface: "#ffffff"
  on-surface: "#14130f"
  secondary: "#f4f1eb"
  on-secondary: "#14130f"
  primary: "#0a6cc2"
  on-primary: "#ffffff"
  accent: "#0962b0"
  on-accent: "#f4f1eb"
  ink-on-fill: "#161615"
  muted: "#f4f1eb"
  on-muted: "#5b5750"
  outline: "rgb(20 18 14 / 0.08)"
  outline-strong: "rgb(20 18 14 / 0.16)"
  cream: "#fbfaf7"
  sky: "#d6effd"
  pink: "#e04f98"
  pink-ink: "#b8256a"
  yellow: "#f5d547"
  mint: "#146c4b"
  fill-edge: "rgb(20 18 14 / 0.22)"
  grid-dot: "rgb(20 18 14 / 0.11)"
  claude-surface: "#faf9f5"
  on-claude: "#141413"
  claude-chip: "rgb(217 119 87 / 0.14)"

typography:
  display-hero:
    fontFamily: Newsreader
    fontSize: 4.5rem
    fontWeight: "500"
    lineHeight: 1.04
    letterSpacing: -0.02em
  display-section:
    fontFamily: Newsreader
    fontSize: 3.75rem
    fontWeight: "400"
    lineHeight: 1.04
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: "400"
    lineHeight: 1.625
  body-md:
    fontFamily: Geist
    fontSize: 17px
    fontWeight: "400"
    lineHeight: 1.625
  body-sm:
    fontFamily: Geist
    fontSize: 15px
    fontWeight: "500"
    lineHeight: 1.5
  label-nav:
    fontFamily: Geist
    fontSize: 13.5px
    fontWeight: "500"
    lineHeight: 1.4
  meta:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: "400"
    lineHeight: 1.625
  eyebrow:
    fontFamily: "Geist Mono"
    fontSize: 11px
    fontWeight: "400"
    lineHeight: 1.4
    letterSpacing: 0.14em
  mono-ui:
    fontFamily: "Geist Mono"
    fontSize: 11px
    fontWeight: "400"
    lineHeight: 1.4

rounded:
  sm: 8px
  DEFAULT: 12px
  lg: 16px
  xl: 20px
  window: 22px
  card: 24px
  full: 9999px

spacing:
  unit: 4px
  gutter: 16px
  gutter-lg: 24px
  section-x: 16px
  section-x-sm: 24px
  max-content: 1152px
  max-wide: 1280px
  dot-grid: 22px
  nav-height: 64px
  nav-height-compact: 56px
  focus-offset: 3px
  scroll-padding: 88px

components:
  button-primary:
    backgroundColor: "{colors.on-background}"
    textColor: "{colors.background}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.full}"
    height: 52px
    padding: 0 28px
    shadow: "0 8px 24px -8px rgb(0 0 0 / 0.5)"
  button-primary-hover:
    shadow: "0 14px 32px -10px rgb(0 0 0 / 0.55)"
  button-secondary:
    backgroundColor: transparent
    textColor: "{colors.on-muted}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.full}"
    height: 52px
    padding: 0 20px
  button-secondary-hover:
    backgroundColor: "color-mix(in srgb, {colors.on-background} 5%, transparent)"
    textColor: "{colors.on-background}"
  app-window:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.window}"
    border: "1px solid {colors.outline-strong}"
    shadow: "{shadows.window}"
  glass-header:
    backgroundColor: "color-mix(in srgb, {colors.background} 72%, transparent)"
    backdropFilter: blur(16px) saturate(140%)
    border: "1px solid {colors.outline}"
  section-heading:
    typography: "{typography.display-section}"
    textColor: "{colors.on-background}"
  note-pin-you:
    backgroundColor: "{colors.pink}"
    textColor: "{colors.ink-on-fill}"
    rounded: "{rounded.full}"
  note-pin-agent:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.full}"
  sticky-cta:
    backgroundColor: "{colors.on-background}"
    textColor: "{colors.background}"
    typography: "{typography.label-nav}"
    rounded: "{rounded.full}"
    border: "1px solid {colors.outline-strong}"
    shadow: "0 14px 36px -12px rgb(0 0 0 / 0.5)"
  spotlight-card:
    backgroundColor: "{colors.secondary}"
    rounded: "{rounded.card}"
    border: "1px solid {colors.outline}"

x-scaff:
  dark:
    colors:
      background: "#161615"
      on-background: "#f1eee6"
      surface: "#1f1f1d"
      on-surface: "#f1eee6"
      secondary: "#282826"
      on-secondary: "#f1eee6"
      accent: "#6cbbf7"
      on-accent: "#161615"
      ink-on-fill: "#161615"
      muted: "#282826"
      on-muted: "#a9a59c"
      outline: "rgb(255 255 255 / 0.08)"
      outline-strong: "rgb(255 255 255 / 0.15)"
      pink: "#ff8fc8"
      pink-ink: "#ff8fc8"
      mint: "#4fd1a5"
      fill-edge: "rgb(0 0 0 / 0)"
      grid-dot: "rgb(255 255 255 / 0.07)"
      claude-surface: "#262624"
      on-claude: "#faf9f5"
      claude-chip: "rgb(217 119 87 / 0.2)"
  shadows:
    window: "0 1px 0 rgb(255 255 255 / 0.06) inset, 0 40px 80px -32px rgb(0 0 0 / 0.7)"
    cta: "0 8px 24px -8px rgb(0 0 0 / 0.5)"
    cta-hover: "0 14px 32px -10px rgb(0 0 0 / 0.55)"
    sticky: "0 14px 36px -12px rgb(0 0 0 / 0.5)"
---

## Brand & Style

Scaff’s marketing site reads like **Intent’s product pages crossed with a Figma canvas**: warm editorial type on a near-black field, product demos framed as real desktop windows, and collaboration accents (pink pins, yellow stickies, mint success) that echo the in-app review flow. Dark is the default; light is the same system inverted to cream paper. Personality is calm and competent — never startup-neon, never corporate gray. **No orange anywhere** in the palette.

The sparkle-smile mark (`design-system/logo-candidates/mark.svg`) carries a cream→sky→blue gradient; do not flatten it to a single fill except in monochrome lockups.

## Colors

**Background (`background`)** is the page canvas — warm charcoal in dark mode, warm off-white in light. Body copy sits on it as **on-background** (cream-tinted white / near-black ink).

**Surface** and **secondary** step up one and two levels for cards, window chrome, and elevated panels. Depth is border-first; fills stay matte.

**Primary** is Scaff blue — fills only (agent pins, solid actions inside demos). Pair with **on-primary** white. **Accent** is the lighter blue for *text* highlights (hero brand word, links, focus rings, mobile nav active dot). **On-accent** is the paired wash behind accent foreground; **ink-on-fill** (`#161615`) is pin/sticky ink and matches `--on-accent` in CSS. Never swap accent and primary jobs.

**Pink**, **yellow**, and **mint** are semantic fills from the product UI: person vs agent vs done. Use **pink-ink** when pink must appear as text on light surfaces. **Yellow** is sticky-note / “waiting” only. **Mint** is success. Shapes that carry these fills use **fill-edge** as a hairline so they pass non-text contrast on light areas (stronger in light theme).

**Outline** and **outline-strong** are alpha hairlines — the main layering tool. **Muted** is a subtle warm surface wash (aligned with **secondary**); **on-muted** is secondary copy (`fg-muted`). Tertiary copy stays `#696560` light / `#938e85` dark on **background**, not on the muted fill.

**Claude** tokens (`claude-surface`, `on-claude`, `claude-chip`) are reserved for the Claude Startups badge; do not reuse elsewhere.

## Typography

Three voices: **Newsreader** for display (hero and section titles), **Geist** for UI and body, **Geist Mono** for eyebrows and faux URL bars.

Display tokens use clamp maxima (**4.5rem** hero, **3.75rem** section); CSS implements `clamp(2.4rem, 6vw, 4.5rem)` and `clamp(2.25rem, 4.6vw, 3.75rem)`. Headlines use regular or medium weight — never bold black. Tight **-0.02em** tracking and ~**1.04** line height keep large serif lines locked. Section titles split across two lines in the same color when it reads better; use italic Newsreader (**Accent**) at most once per heading for quiet emphasis.

Eyebrows are mono, **11px**, uppercase, wide tracking — the only all-caps pattern on the page.

Body copy runs **17–18px** with relaxed leading; meta lines under CTAs at **13px** in **on-muted**.

## Layout & Spacing

Content width centers on **max-content** (~1152px) for hero demos and **max-wide** (~1280px) for nav. Horizontal padding **section-x** / **section-x-sm** (16 → 24px). Vertical rhythm favors generous section padding (hero ~112px top, 96–128px bottom) and **88px** scroll-padding so fixed header and sticky pills do not cover focus targets.

The **dot-grid** utility tiles at **22px** — a faint design-canvas cue, usually masked radially so it fades at edges. Sections breathe; density lives inside AppWindow demos, not in marketing copy blocks.

## Elevation & Depth

Flat marketing surfaces; drama lives in **shadows.window** under product frames (inset top highlight + deep drop shadow). Primary download CTAs use **shadows.cta** with a lift on hover. Sticky download pill uses **shadows.sticky** plus **outline-strong** border.

**Glass-header** blurs the nav after 24px scroll — no heavy drop shadow on the bar itself. **Spotlight-card** adds a pointer-following blue radial wash inside the border; default state is border-only on **secondary** fill.

## Shapes

Pills (**rounded.full**) for every primary control, nav hit targets, and sticky CTA. **rounded.window** (22px) unifies all AppWindow demos. Feature cards use **rounded.card** (24px). Pin bubbles use **rounded.xl** with a clipped corner on the pin disc.

Traffic-light dots in window chrome use fixed system colors (#ff5f57, #febc2e, #28c840) — decorative only, not brand tokens.

Focus: **2px solid accent**, **focus-offset** 3px, on `:focus-visible` only.

## Components

**Download button** — cream-on-ink pill (inverted fg/bg roles), platform glyph, hover lift **-1px**, active scale **0.98**. Meta line below: perks, alternate installers, privacy link in underlined **on-muted**.

**App window** — shared chrome for every product screenshot/animation; toolbar **44px**, optional mono URL pill with mint “live” dot.

**Nav** — fixed, glass on scroll, compact height after scroll. Desktop links get a soft **fg/7%** pill for active state (layout animation). Mobile sheet: large serif link list, accent dot for current section.

**Note pins** — numbered discs; pink + **ink-on-fill** for “you”, **primary** + white for agent. Optional blurred **surface** speech bubble.

**Theme toggle** — icon-only **44×44** circle; persists via `data-theme` on `<html>`.

## Motion

CSS tokens: **150ms** fast, **250ms** med, **400ms** slow; easing **cubic-bezier(0.16, 1, 0.3, 1)**. Hero words **rise** inside overflow-hidden masks; sections **fade-up** 10px. Framer springs: snappy (420/34) for layout pills, soft (160/24) for sticky CTA. Respect **`prefers-reduced-motion`** — collapse to instant or opacity-only. Global **`data-paused`** freezes decorative loops for demo playback.

## Do's and Don'ts

- Do keep WCAG AA contrast on every accent on every surface; the codebase comments document checked pairs.
- Do use **accent** for text highlights and focus; use **primary** / inverted cream pills for solid marketing CTAs.
- Do frame product UI in **app-window** so demos feel like one app.
- Don't introduce orange, purple gradients, or generic glassmorphism outside the defined glass utility.
- Don't use heavy font weights on Newsreader headlines.
- Don't use pink or yellow as body text colors — use **pink-ink** on light backgrounds when text must read pink.

### Light theme (`data-theme="light"`)

**background** `#f7f4ef`, **surface** `#ffffff`, **secondary** `#f4f1eb`, **on-background** `#14130f`, **accent** `#0962b0`, deeper **pink** (`#e04f98`), **pink-ink** (`#b8256a`), **mint** (`#146c4b`), **outline** / **outline-strong** and **grid-dot** flipped to dark alpha, stronger **fill-edge**, warm **shadows.window** with layered ambient shadow. Primary blue and yellow fills stay shared across themes.
