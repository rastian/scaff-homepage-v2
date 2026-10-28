"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { AnimatePresence, animate, motion, useMotionValue, useMotionValueEvent } from "motion/react";
import { canvas } from "@/content/home";
import { Cursor } from "@/components/motion/Cursor";
import { useDemoActive } from "@/components/motion/DemoPlayback";
import { NotePin } from "@/components/motion/NotePin";
import { dur, ease, spring } from "@/components/motion/tokens";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { AppWindow } from "@/components/ui/AppWindow";

// ── Types & layout constants ────────────────────────────────────────────

type Device = "desktop" | "tablet" | "phone";
type Status = (typeof canvas.frames)[number]["status"];
type FrameId = (typeof canvas.frames)[number]["id"];

const DEVICES: { id: Device; label: string }[] = [
  { id: "desktop", label: "Desktop" },
  { id: "tablet", label: "Tablet" },
  { id: "phone", label: "Phone" },
];

// Frame width per device: [regular, compact (< md)].
const FRAME_W: Record<Device, [number, number]> = {
  desktop: [360, 248],
  tablet: [260, 196],
  phone: [170, 136],
};
// Body height as a share of width.
const FRAME_RATIO: Record<Device, number> = { desktop: 10 / 16, tablet: 5 / 4, phone: 17 / 9 };

// A gentle arc: the outer frames sit lower than the middle one.
const ARC = [34, 10, 0, 10, 34];

// working = blue + pulse (added only while the demo is active), waiting =
// yellow, unread = accent, done = mint.
const STATUS_DOT: Record<Status, string> = {
  working: "bg-blue text-accent",
  waiting: "bg-yellow ring-1 ring-fill-edge",
  unread: "bg-accent",
  done: "bg-mint",
};

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

function useMedia(query: string) {
  const subscribe = useCallback(
    (cb: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

// ── Mini "Linen & Co" landing pages: one per direction ───────────────────
// Sized with container query units so each one scales with its frame, and
// reflows at narrow widths, so the device toggle changes layout, not just size.

// Each fake site has its own fixed palette (it is a product page, not the
// Scaff UI), so it reads the same in both themes. Warm-free palette: cream, ink,
// sky, blue, pink, yellow and mint only.
const tint = {
  sky: "bg-[color-mix(in_srgb,var(--sky)_80%,var(--cream))]",
  blue: "bg-[color-mix(in_srgb,var(--blue)_22%,var(--cream))]",
  pink: "bg-[color-mix(in_srgb,var(--pink)_30%,var(--cream))]",
  pinkSoft: "bg-[color-mix(in_srgb,var(--pink)_14%,var(--cream))]",
  yellow: "bg-[color-mix(in_srgb,var(--yellow)_45%,var(--cream))]",
  mint: "bg-[color-mix(in_srgb,var(--mint)_26%,var(--cream))]",
};

function Bar({ w, className = "" }: { w: string; className?: string }) {
  return <span className={`block h-[1.7cqw] min-h-[2px] rounded-full bg-current opacity-[0.14] ${className}`} style={{ width: w }} />;
}

function MiniNav({ serif = false }: { serif?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-[4.4cqw] leading-none ${serif ? "font-serif italic" : "font-semibold tracking-[-0.03em]"}`}>
        Linen &amp; Co
      </span>
      <span className="hidden items-center gap-[3cqw] @min-[230px]:flex">
        <Bar w="7cqw" />
        <Bar w="9cqw" />
        <Bar w="6cqw" />
        <span className="h-[5cqw] w-[11cqw] rounded-full bg-current opacity-85" />
      </span>
      <span className="flex flex-col gap-[1.2cqw] @min-[230px]:hidden">
        <span className="block h-[0.9cqw] min-h-px w-[6cqw] rounded-full bg-current" />
        <span className="block h-[0.9cqw] min-h-px w-[6cqw] rounded-full bg-current" />
      </span>
    </div>
  );
}

// a: cream + ink serif editorial
function EditorialPage() {
  return (
    <div className="absolute inset-0 flex flex-col bg-cream px-[6cqw] py-[5cqw] text-on-accent">
      <MiniNav serif />
      <div className="mt-[6cqw] border-t border-on-accent/15 pt-[5cqw] text-center">
        <p className="font-mono text-[2.6cqw] uppercase tracking-[0.2em] text-on-accent/60">Spring collection</p>
        <p className="mt-[2cqw] font-serif text-[10.5cqw] leading-[0.95] tracking-[-0.02em]">
          Linen, <em className="text-blue">slowly.</em>
        </p>
        <div className="mx-auto mt-[3cqw] flex w-[60%] flex-col items-center gap-[1.6cqw]">
          <Bar w="100%" />
          <Bar w="70%" />
        </div>
      </div>
      <div className="mt-auto grid grid-cols-2 gap-[2.4cqw] pt-[4cqw] @min-[230px]:grid-cols-3">
        <span className={`aspect-[3/4] rounded-[1.5cqw] ${tint.sky}`} />
        <span className={`aspect-[3/4] rounded-[1.5cqw] ${tint.pink}`} />
        <span className={`hidden aspect-[3/4] rounded-[1.5cqw] @min-[230px]:block ${tint.mint}`} />
      </div>
    </div>
  );
}

// b: soft pink
function SoftPage() {
  return (
    <div className={`absolute inset-0 flex flex-col px-[6cqw] py-[5cqw] text-on-accent ${tint.pinkSoft}`}>
      <MiniNav />
      <div className="mt-[7cqw] flex flex-1 flex-col gap-[5cqw] @min-[230px]:flex-row @min-[230px]:items-center">
        <div className="flex-1">
          <p className="text-[8.6cqw] font-semibold leading-[0.98] tracking-[-0.045em]">
            Made to <em className="font-serif font-normal italic tracking-[-0.02em]">soften</em> with you.
          </p>
          <div className="mt-[3cqw] flex flex-col gap-[1.6cqw]">
            <Bar w="90%" />
            <Bar w="60%" />
          </div>
          <span className="mt-[4cqw] inline-flex h-[6.4cqw] items-center rounded-full bg-on-accent px-[4cqw] text-[2.8cqw] font-medium text-cream">
            Shop bedding
          </span>
        </div>
        <div className="relative mx-auto aspect-square w-[62%] @min-[230px]:w-[36%]">
          <span className={`absolute inset-0 rounded-full ${tint.pink}`} />
          <span className={`absolute -bottom-[2cqw] -left-[3cqw] size-[40%] rounded-full ${tint.yellow}`} />
        </div>
      </div>
    </div>
  );
}

// c: sky + blue
function PricingPage() {
  const plans = [
    { name: "Sample", price: "€0" },
    { name: "Set", price: "€89" },
    { name: "Home", price: "€240" },
  ];
  return (
    <div className={`absolute inset-0 flex flex-col px-[5cqw] py-[5cqw] text-on-accent ${tint.sky}`}>
      <MiniNav />
      <p className="mt-[5cqw] text-[5.6cqw] font-semibold tracking-[-0.03em]">Pick your linen plan</p>
      <div className="mt-[3cqw] grid flex-1 grid-cols-1 gap-[2.4cqw] @min-[230px]:grid-cols-3">
        {plans.map((p, i) => (
          <div
            key={p.name}
            className={`flex flex-col rounded-[2cqw] border bg-cream p-[2.8cqw] ${i === 1 ? "border-blue" : "border-on-accent/10"}`}
          >
            <div className="flex items-baseline justify-between gap-[2cqw]">
              <span className="text-[2.8cqw] text-on-accent/65">{p.name}</span>
              <span className="text-[4.6cqw] font-semibold leading-none tracking-[-0.03em]">{p.price}</span>
            </div>
            <div className="mt-[2.4cqw] hidden flex-col gap-[1.4cqw] @min-[230px]:flex">
              <Bar w="100%" />
              <Bar w="80%" />
              <Bar w="90%" />
              <Bar w="55%" />
            </div>
            <span
              className={`mt-auto hidden h-[5cqw] rounded-[1.2cqw] @min-[230px]:block ${i === 1 ? "bg-blue" : "border border-on-accent/20"}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// d: deep ink with cream type
function BoldPage() {
  return (
    <div className="absolute inset-0 flex flex-col bg-on-accent px-[6cqw] py-[5cqw] text-cream">
      <MiniNav />
      <div className="mt-auto">
        <p className="text-[25cqw] font-black uppercase leading-[0.78] tracking-[-0.07em]">Linen</p>
        <p className="mt-[1.5cqw] font-serif text-[9cqw] italic leading-none tracking-[-0.02em] text-pink">&amp; Co.</p>
      </div>
      <div className="mt-[5cqw] flex items-end justify-between gap-[4cqw]">
        <div className="flex w-[45%] flex-col gap-[1.6cqw]">
          <Bar w="100%" />
          <Bar w="70%" />
        </div>
        <span className="h-[6cqw] w-[22cqw] rounded-none border-[0.5cqw] border-cream" />
      </div>
    </div>
  );
}

// e: cream page, ink drawer, soft yellow accent
function MobileNavPage() {
  const links = ["Bedding", "Bath", "Journal", "Stores"];
  return (
    <div className="absolute inset-0 bg-cream text-on-accent">
      {/* Page behind the menu */}
      <div className="absolute inset-0 flex flex-col px-[6cqw] py-[5cqw] opacity-60">
        <MiniNav />
        <p className="mt-[8cqw] text-[8cqw] font-semibold leading-none tracking-[-0.04em]">Sleep in linen.</p>
        <span className={`mt-[4cqw] flex-1 rounded-[2cqw] ${tint.yellow}`} />
      </div>
      <span className="absolute inset-0 bg-on-accent/25" />
      {/* Drawer: full screen on phones, side sheet when there is room */}
      <div className="absolute inset-y-0 right-0 flex w-full flex-col bg-on-accent px-[6cqw] py-[5cqw] text-cream @min-[230px]:w-[56%]">
        <div className="flex items-center justify-between">
          <span className="text-[4.4cqw] font-semibold tracking-[-0.03em] @min-[230px]:text-[3.6cqw]">Menu</span>
          <span className="relative size-[5cqw]">
            <span className="absolute left-0 top-1/2 h-[0.8cqw] min-h-px w-full rotate-45 rounded-full bg-cream" />
            <span className="absolute left-0 top-1/2 h-[0.8cqw] min-h-px w-full -rotate-45 rounded-full bg-cream" />
          </span>
        </div>
        <ul className="mt-[6cqw]">
          {links.map((l) => (
            <li
              key={l}
              className="border-b border-cream/15 py-[2.6cqw] text-[7cqw] font-semibold leading-none tracking-[-0.03em] @min-[230px]:text-[4.6cqw]"
            >
              {l}
            </li>
          ))}
        </ul>
        <span className="mt-auto inline-flex h-[8cqw] items-center justify-center rounded-full bg-yellow text-[3.6cqw] font-medium text-on-accent @min-[230px]:h-[6cqw] @min-[230px]:text-[2.6cqw]">
          Bag (2)
        </span>
      </div>
    </div>
  );
}

const PAGES: Record<FrameId, () => React.ReactNode> = {
  a: EditorialPage,
  b: SoftPage,
  c: PricingPage,
  d: BoldPage,
  e: MobileNavPage,
};

// ── Toolbar: device toggle ──────────────────────────────────────────────

function DeviceIcon({ device }: { device: Device }) {
  const common = {
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    className: "size-3.5 shrink-0",
    "aria-hidden": true,
  } as const;
  if (device === "desktop")
    return (
      <svg {...common}>
        <rect x="1.75" y="2.75" width="12.5" height="8.5" rx="1.5" />
        <path d="M5.5 13.75h5" strokeLinecap="round" />
      </svg>
    );
  if (device === "tablet")
    return (
      <svg {...common}>
        <rect x="3.25" y="1.75" width="9.5" height="12.5" rx="1.5" />
      </svg>
    );
  return (
    <svg {...common}>
      <rect x="4.75" y="1.75" width="6.5" height="12.5" rx="1.5" />
    </svg>
  );
}

function DeviceToggle({ value, onChange, reduced }: { value: Device; onChange: (d: Device) => void; reduced: boolean }) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    let next = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % DEVICES.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + DEVICES.length) % DEVICES.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = DEVICES.length - 1;
    if (next < 0) return;
    e.preventDefault();
    onChange(DEVICES[next].id);
    refs.current[next]?.focus();
  };

  return (
    <div role="radiogroup" aria-label="Preview size" className="relative -mr-1.5 flex h-11 shrink-0 items-center">
      <span aria-hidden className="absolute inset-x-0 top-1/2 h-8 -translate-y-1/2 rounded-full border border-line bg-ink/70" />
      {DEVICES.map((d, i) => {
        const checked = d.id === value;
        return (
          <button
            key={d.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={checked ? 0 : -1}
            onClick={() => onChange(d.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className="group relative flex h-11 min-w-11 items-center justify-center px-0.5 focus-visible:outline-offset-[-2px]"
          >
            <span
              className={`relative flex h-7 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium transition-[color,transform] duration-[var(--dur-fast)] group-active:scale-95 ${
                checked ? "text-fg" : "text-fg-subtle group-hover:text-fg-muted"
              }`}
            >
              {checked ? (
                <motion.span
                  layoutId="canvas-device-pill"
                  transition={reduced ? { duration: 0 } : spring.snappy}
                  className="absolute inset-0 rounded-full border border-line-strong bg-surface shadow-[0_1px_2px_rgb(0_0_0/0.08)]"
                />
              ) : null}
              <span className="relative flex items-center gap-1.5">
                <DeviceIcon device={d.id} />
                <span className="sr-only sm:not-sr-only">{d.label}</span>
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ── Frame ───────────────────────────────────────────────────────────────

function StatusBadge({
  status,
  showLabel,
  reduced,
  pulse,
}: {
  status: Status;
  showLabel: boolean;
  reduced: boolean;
  pulse: boolean;
}) {
  return (
    <span className="flex shrink-0 items-center gap-1.5">
      <span
        className={`size-1.5 rounded-full transition-colors duration-[var(--dur-med)] ${STATUS_DOT[status]} ${
          pulse && status === "working" ? "animate-pulse-ring" : ""
        }`}
      />
      {showLabel ? (
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={status}
            initial={{ opacity: 0, y: reduced ? 0 : 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduced ? 0 : -4 }}
            transition={{ duration: dur.med, ease: ease.out }}
            className="whitespace-nowrap text-[10.5px] font-medium text-fg-muted"
          >
            {canvas.statusLabel[status]}
          </motion.span>
        </AnimatePresence>
      ) : null}
    </span>
  );
}

function FrameChatInput({
  branch,
  sent,
  onSend,
  reduced,
}: {
  branch: string;
  sent: boolean;
  onSend: (text: string) => void;
  reduced: boolean;
}) {
  const [text, setText] = useState("");
  const inputId = `canvas-ask-${branch.replace(/\W+/g, "-")}`;
  return (
    <motion.form
      initial={{ opacity: 0, y: reduced ? 0 : -6, scale: reduced ? 1 : 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: reduced ? 0 : -6, scale: reduced ? 1 : 0.98 }}
      transition={{ duration: dur.med, ease: ease.out }}
      onSubmit={(e) => {
        e.preventDefault();
        if (!text.trim()) return;
        onSend(text.trim());
        setText("");
      }}
      className="absolute left-1/2 top-full z-20 mt-3 flex w-[min(100%+40px,300px)] min-w-[220px] -translate-x-1/2 items-center gap-1 rounded-full border border-line-strong bg-surface py-1 pl-4 pr-1 shadow-window"
    >
      <label htmlFor={inputId} className="sr-only">
        Ask {branch} for a change
      </label>
      <input
        id={inputId}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={sent ? "Sent. Scaff is on it…" : "Ask for a change…"}
        autoComplete="off"
        className="h-9 min-w-0 flex-1 bg-transparent text-[13px] text-fg outline-none placeholder:text-fg-subtle"
      />
      <button
        type="submit"
        disabled={!text.trim()}
        aria-label={`Send to ${branch}`}
        className="-m-1 grid size-11 shrink-0 place-items-center rounded-full transition-[opacity,transform] duration-[var(--dur-fast)] hover:opacity-85 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:active:scale-100"
      >
        {/* 36px visual inside a 44px hit area; -m-1 keeps the pill's layout unchanged. */}
        <span className="grid size-9 place-items-center rounded-full bg-fg text-ink">
          <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" />
          </svg>
        </span>
      </button>
    </motion.form>
  );
}

// ── Decorative "think around the frames" items ──────────────────────────

// On touch, only horizontal drags: a free drag sets touch-action: none and
// would swallow vertical page scrolls that start on a note.
const looseDrag = {
  dragMomentum: false,
  dragElastic: 0.08,
  whileDrag: { scale: 1.04, rotate: 0 },
} as const;

// ── Board ───────────────────────────────────────────────────────────────

// First point is the rest anchor (initial / reduced motion / paused): empty
// board space just under the pricing frame, clear of its labels, of the chat
// input under the selected frame and of the drag hint at every preview size
// (at 0.78 it sat on that input in Phone/Tablet mode).
const YOU_PATH: [number, number][] = [
  [0.56, 0.82],
  [0.56, 0.3],
  [0.42, 0.74],
  [0.72, 0.58],
];
const AGENT_PATH: [number, number][] = [
  [0.64, 0.38],
  [0.36, 0.34],
  [0.68, 0.7],
  [0.22, 0.52],
];

export function CanvasBoard() {
  const reduced = useReducedMotionSafe();
  const compact = useMedia("(max-width: 767px)");
  const coarse = useMedia("(pointer: coarse)");
  const { ref: demoRef, active, hoverProps } = useDemoActive<HTMLDivElement>();

  const [device, setDevice] = useState<Device>("desktop");
  const [selected, setSelected] = useState<FrameId | null>("d");
  const [status, setStatus] = useState<Record<FrameId, Status>>(
    () => Object.fromEntries(canvas.frames.map((f) => [f.id, f.status])) as Record<FrameId, Status>,
  );
  const [sentFor, setSentFor] = useState<FrameId | null>(null);
  const [hasPanned, setHasPanned] = useState(false);

  const viewportRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const frameRefs = useRef<Partial<Record<FrameId, HTMLDivElement | null>>>({});
  const movedRef = useRef(false);
  const timers = useRef<Partial<Record<FrameId, number>>>({});

  // Pan offset of the world, 0/0 = centred ("Fit").
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [bounds, setBounds] = useState({ x: 0, y: 0 });
  const boundsRef = useRef(bounds);
  const [vpSize, setVpSize] = useState({ w: 0, h: 0 });
  const [edge, setEdge] = useState({ left: false, right: false });

  // Measure how far the world overflows the viewport on each side.
  useEffect(() => {
    const vp = viewportRef.current;
    const world = worldRef.current;
    if (!vp || !world) return;
    const measure = () => {
      const b = {
        x: Math.max(0, Math.round((world.offsetWidth - vp.clientWidth) / 2)),
        y: Math.max(0, Math.round((world.offsetHeight - vp.clientHeight) / 2)),
      };
      boundsRef.current = b;
      setBounds((prev) => (prev.x === b.x && prev.y === b.y ? prev : b));
      setVpSize((prev) => (prev.w === vp.clientWidth && prev.h === vp.clientHeight ? prev : { w: vp.clientWidth, h: vp.clientHeight }));
      const cx = clamp(x.get(), -b.x, b.x);
      const cy = clamp(y.get(), -b.y, b.y);
      if (cx !== x.get()) x.set(cx);
      if (cy !== y.get()) y.set(cy);
      const left = cx < b.x - 1;
      const right = cx > -b.x + 1;
      setEdge((prev) => (prev.left === left && prev.right === right ? prev : { left, right }));
    };
    const ro = new ResizeObserver(measure);
    ro.observe(vp);
    ro.observe(world);
    return () => ro.disconnect();
  }, [x, y]);

  useMotionValueEvent(x, "change", (v) => {
    const b = boundsRef.current;
    const left = v < b.x - 1;
    const right = v > -b.x + 1;
    setEdge((prev) => (prev.left === left && prev.right === right ? prev : { left, right }));
  });

  useEffect(() => {
    const t = timers.current;
    return () => Object.values(t).forEach((id) => window.clearTimeout(id));
  }, []);

  const panTo = useCallback(
    (tx: number, ty: number) => {
      const b = boundsRef.current;
      const nx = clamp(tx, -b.x, b.x);
      const ny = clamp(ty, -b.y, b.y);
      if (reduced) {
        x.set(nx);
        y.set(ny);
      } else {
        animate(x, nx, spring.soft);
        animate(y, ny, spring.soft);
      }
    },
    [reduced, x, y],
  );

  // Bring a frame into view when it gets keyboard focus or is picked.
  const reveal = useCallback(
    (id: FrameId) => {
      const el = frameRefs.current[id];
      const vp = viewportRef.current;
      if (!el || !vp) return;
      const r = el.getBoundingClientRect();
      const v = vp.getBoundingClientRect();
      const pad = 24;
      const outside = r.left < v.left + pad || r.right > v.right - pad || r.top < v.top + pad || r.bottom > v.bottom - 72;
      if (!outside) return;
      panTo(x.get() + (v.left + v.width / 2 - (r.left + r.width / 2)), y.get() + (v.top + v.height / 2 - 30 - (r.top + r.height / 2)));
    },
    [panTo, x, y],
  );

  const step = Math.max(200, Math.round(vpSize.w * 0.55));
  const panBy = (dx: number) => {
    setHasPanned(true);
    panTo(x.get() + dx, y.get());
  };

  const select = (id: FrameId) => {
    setSelected(id);
    // Opening a frame with an unread reply marks it as read.
    setStatus((s) => (s[id] === "unread" ? { ...s, [id]: "done" } : s));
    reveal(id);
  };

  const send = (id: FrameId) => {
    setSentFor(id);
    setStatus((s) => ({ ...s, [id]: "working" }));
    // A second send restarts the reply timer instead of stacking another one.
    window.clearTimeout(timers.current[id]);
    timers.current[id] = window.setTimeout(() => {
      setStatus((s) => ({ ...s, [id]: "unread" }));
      setSentFor((cur) => (cur === id ? null : cur));
    }, 3200);
  };

  // Idle-wandering multiplayer cursors, in viewport coordinates.
  const youX = useMotionValue(0);
  const youY = useMotionValue(0);
  const agentX = useMotionValue(0);
  const agentY = useMotionValue(0);

  useEffect(() => {
    const { w, h } = vpSize;
    if (!w || !h) return;
    // Latest animation per motion value; a new move stops the one it replaces.
    const running = new Map<typeof youX, { stop: () => void }>();
    const place = (mx: typeof youX, my: typeof youY, p: [number, number], move: boolean) => {
      const tx = p[0] * w;
      const ty = p[1] * h;
      if (!move) {
        mx.set(tx);
        my.set(ty);
        return;
      }
      const t = { duration: 1.9, ease: ease.spatial };
      running.get(mx)?.stop();
      running.get(my)?.stop();
      running.set(mx, animate(mx, tx, t));
      running.set(my, animate(my, ty, t));
    };
    if (mxUnset(youX)) place(youX, youY, YOU_PATH[0], false);
    if (mxUnset(agentX)) place(agentX, agentY, AGENT_PATH[0], false);
    if (reduced) {
      place(youX, youY, YOU_PATH[0], false);
      place(agentX, agentY, AGENT_PATH[0], false);
      return;
    }
    if (!active) return;
    let i = 0;
    let j = 0;
    const a = window.setInterval(() => {
      i = (i + 1) % YOU_PATH.length;
      place(youX, youY, YOU_PATH[i], true);
    }, 2800);
    let b = 0;
    const lead = window.setTimeout(() => {
      b = window.setInterval(() => {
        j = (j + 1) % AGENT_PATH.length;
        place(agentX, agentY, AGENT_PATH[j], true);
      }, 3300);
    }, 1200);
    return () => {
      window.clearInterval(a);
      window.clearTimeout(lead);
      window.clearInterval(b);
      // Freeze in place the moment the demo goes inactive (hover, offscreen, pause).
      running.forEach((c) => c.stop());
    };
  }, [active, reduced, vpSize, youX, youY, agentX, agentY]);

  const widthFor = (d: Device) => FRAME_W[d][compact ? 1 : 0];
  const frameW = widthFor(device);
  const bodyH = Math.round(frameW * FRAME_RATIO[device]);
  const sizeTransition = reduced ? { duration: 0 } : spring.soft;
  const selectedFrame = canvas.frames.find((f) => f.id === selected);

  return (
    <div ref={demoRef} {...hoverProps}>
      <AppWindow
        title="Canvas · Linen & Co"
        toolbar={<DeviceToggle value={device} onChange={setDevice} reduced={reduced} />}
        bodyClassName="relative"
      >
        <p className="sr-only">
          Interactive demo of the Scaff canvas: five chat branches of the Linen &amp; Co landing page shown side by side as
          frames. Choose a preview size, pick a frame to open it live, or pan with the buttons below the board.
        </p>
        <div
          ref={viewportRef}
          className="relative h-[520px] overflow-clip bg-ink-2 md:h-[620px]"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              ref={worldRef}
              drag={coarse ? "x" : true}
              dragDirectionLock={coarse}
              dragConstraints={{ left: -bounds.x, right: bounds.x, top: -bounds.y, bottom: bounds.y }}
              dragElastic={0.06}
              dragTransition={{ power: 0.25, timeConstant: 220 }}
              onPointerDownCapture={() => {
                movedRef.current = false;
              }}
              onDragStart={() => {
                movedRef.current = true;
                setHasPanned(true);
              }}
              style={{ x, y }}
              className="dot-grid relative flex min-h-full min-w-full shrink-0 cursor-grab items-center justify-center px-[72px] py-[150px] active:cursor-grabbing md:px-[150px] md:py-[150px]"
            >
              {/* Frames */}
              <div className="relative z-20 flex items-center gap-9 md:gap-14">
                {canvas.frames.map((f, i) => {
                  const Page = PAGES[f.id];
                  const isSel = selected === f.id;
                  const st = status[f.id];
                  return (
                    <motion.div
                      key={f.id}
                      ref={(el) => {
                        frameRefs.current[f.id] = el;
                      }}
                      className="relative"
                      style={{ y: ARC[i] }}
                    >
                      <AnimatePresence>
                        {isSel ? (
                          <motion.span
                            aria-hidden
                            initial={{ opacity: 0, y: reduced ? 0 : 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: reduced ? 0 : 4 }}
                            transition={{ duration: dur.med, ease: ease.out }}
                            className="absolute -top-8 left-0 flex max-w-full items-center gap-1.5 whitespace-nowrap rounded-full bg-blue px-2.5 py-1 text-[11px] font-medium leading-none text-white shadow-sm"
                          >
                            <span className="size-1.5 rounded-full bg-white/90" />
                            <span className="truncate">Live from {f.branch}</span>
                          </motion.span>
                        ) : null}
                      </AnimatePresence>

                      <motion.div
                        initial={false}
                        animate={{ width: frameW }}
                        transition={sizeTransition}
                        className={`relative overflow-hidden rounded-[14px] border bg-surface transition-[box-shadow,border-color] duration-[var(--dur-med)] ${
                          isSel
                            ? "border-blue shadow-[0_0_0_3px_color-mix(in_srgb,var(--blue)_28%,transparent),0_24px_48px_-24px_rgb(0_0_0/0.35)]"
                            : "border-line-strong shadow-[0_18px_40px_-28px_rgb(0_0_0/0.35)] hover:border-fg-subtle"
                        }`}
                      >
                        <div className="flex h-8 items-center justify-between gap-2 border-b border-line bg-surface px-2.5">
                          <span className="min-w-0 truncate font-mono text-[10.5px] text-fg-muted">{f.branch}</span>
                          <StatusBadge status={st} showLabel={device === "desktop"} reduced={reduced} pulse={active && !reduced} />
                        </div>
                        <motion.div
                          aria-hidden
                          initial={false}
                          animate={{ height: bodyH }}
                          transition={sizeTransition}
                          className="@container relative overflow-hidden bg-surface-2"
                        >
                          <Page />
                        </motion.div>

                        {/* The whole frame is one button; the mini page is decoration. */}
                        <button
                          type="button"
                          aria-current={isSel ? "true" : undefined}
                          aria-label={`${f.title}, ${f.branch}, ${canvas.statusLabel[st]}`}
                          onClick={(e) => {
                            // Ignore the click that ends a pan, but never a keyboard
                            // activation (detail === 0), which can follow a drag.
                            if (movedRef.current && e.detail !== 0) return;
                            select(f.id);
                          }}
                          onFocus={(e) => {
                            if (e.currentTarget.matches(":focus-visible")) reveal(f.id);
                          }}
                          className="absolute inset-0 rounded-[13px] focus-visible:outline-offset-[-3px]"
                        />
                      </motion.div>

                      {f.id === "b" && !compact ? (
                        <NotePin n={1} tone="you" text="CTA could feel softer" open={!isSel && device === "desktop"} className="-right-4 -top-3" />
                      ) : null}

                      <AnimatePresence>
                        {isSel ? (
                          <FrameChatInput
                            key={f.id}
                            branch={f.branch}
                            sent={sentFor === f.id}
                            onSend={() => send(f.id)}
                            reduced={reduced}
                          />
                        ) : null}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>

              {/* Think around the frames: sticky note, arrow, dropped image */}
              <motion.div
                aria-hidden
                {...looseDrag}
                drag={coarse ? "x" : true}
                dragConstraints={worldRef}
                initial={{ rotate: -4 }}
                className="absolute left-[22%] top-[26px] z-10 w-[148px] cursor-grab rounded-[4px] bg-yellow px-3.5 ring-1 ring-fill-edge pb-4 pt-3 shadow-[0_14px_28px_-16px_rgb(0_0_0/0.4)] active:cursor-grabbing md:left-[25%] md:top-[30px]"
              >
                <span className="font-serif text-[21px] italic leading-6 text-on-accent">try a serif?</span>
                <span className="mt-1.5 block font-mono text-[10px] text-on-accent/70">You · 2m</span>
              </motion.div>

              <motion.div
                aria-hidden
                {...looseDrag}
                drag={coarse ? "x" : true}
                dragConstraints={worldRef}
                className="absolute left-[54%] top-[22px] z-10 cursor-grab text-pink-ink active:cursor-grabbing md:left-[52%] md:top-[24px]"
              >
                <span className="ml-14 block font-serif text-[19px] italic leading-none">this one</span>
                <svg width="96" height="96" viewBox="0 0 96 96" fill="none" className="-mt-1 -scale-x-100" aria-hidden>
                  <path d="M18 10c22 6 46 20 50 46 2 12-2 20-6 26" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                  <path d="M52 74l10 10 8-14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>

              <motion.div
                aria-hidden
                {...looseDrag}
                drag={coarse ? "x" : true}
                dragConstraints={worldRef}
                initial={{ rotate: 4 }}
                className="absolute bottom-[20px] left-[30%] z-10 w-[156px] cursor-grab rounded-xl border border-line-strong bg-surface p-1.5 shadow-[0_16px_32px_-18px_rgb(0_0_0/0.45)] active:cursor-grabbing md:left-[33%] md:w-[176px]"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-surface-2">
                  <Image
                    src="/media/studio-canvas-phones.jpg"
                    alt=""
                    width={2880}
                    height={1680}
                    sizes="180px"
                    draggable={false}
                    className="pointer-events-none size-full select-none object-cover object-[62%_40%]"
                  />
                </div>
                <span className="mt-1.5 block px-1 font-mono text-[10px] text-fg-subtle">mood.jpg</span>
              </motion.div>
            </motion.div>
          </div>

          {/* Multiplayer cursors */}
          <Cursor tone="you" label="You" x={youX} y={youY} />
          <Cursor tone="agent" label="Scaff" x={agentX} y={agentY} />

          {/* Presence */}
          <div aria-hidden className="pointer-events-none absolute right-3 top-3 z-30 flex items-center gap-2 rounded-full border border-line bg-surface/90 py-1 pl-1 pr-3 shadow-sm backdrop-blur">
            <span className="flex -space-x-1.5">
              <span className="grid size-6 place-items-center rounded-full bg-pink text-[10px] font-semibold text-on-accent outline outline-1 -outline-offset-1 outline-fill-edge ring-2 ring-surface">Y</span>
              <span className="grid size-6 place-items-center rounded-full bg-blue text-[10px] font-semibold text-white ring-2 ring-surface">S</span>
            </span>
            <span className="font-mono text-[10.5px] text-fg-muted">5 branches</span>
          </div>

          {/* Pan controls: the non-drag alternative */}
          <div className="absolute bottom-3 left-3 z-30 flex items-center gap-1 rounded-full border border-line bg-surface/90 p-0.5 shadow-sm backdrop-blur">
            <BoardButton label="Pan left" disabled={!edge.left} onClick={() => panBy(step)}>
              <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M10 3.5 5.5 8l4.5 4.5" />
              </svg>
            </BoardButton>
            <button
              type="button"
              onClick={() => {
                setHasPanned(true);
                panTo(0, 0);
              }}
              className="flex h-11 items-center gap-1.5 rounded-full px-3 text-xs font-medium text-fg-muted transition-[background-color,color,transform] duration-[var(--dur-fast)] hover:bg-surface-2 hover:text-fg active:scale-95"
            >
              <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M2.5 6V3.5a1 1 0 0 1 1-1H6M10 2.5h2.5a1 1 0 0 1 1 1V6M13.5 10v2.5a1 1 0 0 1-1 1H10M6 13.5H3.5a1 1 0 0 1-1-1V10" />
              </svg>
              Fit
            </button>
            <BoardButton label="Pan right" disabled={!edge.right} onClick={() => panBy(-step)}>
              <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M6 3.5 10.5 8 6 12.5" />
              </svg>
            </BoardButton>
          </div>

          {/* Drag hint, fades after the first pan */}
          <AnimatePresence>
            {!hasPanned ? (
              <motion.div
                aria-hidden
                initial={{ opacity: 0, y: reduced ? 0 : 6 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.6, duration: dur.slow, ease: ease.out } }}
                exit={{ opacity: 0, y: reduced ? 0 : 6, transition: { duration: dur.med } }}
                className="pointer-events-none absolute bottom-4 left-1/2 z-30 hidden -translate-x-1/2 items-center gap-2 rounded-full bg-fg px-3.5 py-2 text-xs font-medium text-ink shadow-lg sm:flex"
              >
                <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5.5 8V3.8a1 1 0 0 1 2 0V7.5m0-.5V2.8a1 1 0 0 1 2 0V7m0-.3V3.8a1 1 0 0 1 2 0v4.7c0 3-1.8 5-4.5 5-2 0-3-1-4.2-2.8L2.6 8.6a1 1 0 0 1 1.6-1.2l1.3 1.4" />
                </svg>
                {canvas.hint}
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* Mobile hint sits top-left so it doesn't collide with the controls */}
          <AnimatePresence>
            {!hasPanned ? (
              <motion.span
                aria-hidden
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: dur.med } }}
                className="pointer-events-none absolute left-3 top-3 z-30 rounded-full bg-fg px-3 py-1.5 text-[11px] font-medium text-ink sm:hidden"
              >
                {canvas.hint}
              </motion.span>
            ) : null}
          </AnimatePresence>

          <p aria-live="polite" className="sr-only">
            {selectedFrame ? `${selectedFrame.title} selected. Live from ${selectedFrame.branch}.` : ""}
            {sentFor ? " Change request sent." : ""}
          </p>
        </div>
      </AppWindow>
    </div>
  );
}

function mxUnset(v: { get: () => number }) {
  return v.get() === 0;
}

function BoardButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    // aria-disabled instead of disabled: a button that becomes disabled under
    // the keyboard drops focus to <body> when you reach the edge.
    <button
      type="button"
      aria-label={label}
      aria-disabled={disabled}
      onClick={() => {
        if (!disabled) onClick();
      }}
      className="grid size-11 place-items-center rounded-full text-fg-muted transition-[background-color,color,transform,opacity] duration-[var(--dur-fast)] hover:bg-surface-2 hover:text-fg active:scale-95 aria-disabled:cursor-not-allowed aria-disabled:opacity-35 aria-disabled:hover:bg-transparent aria-disabled:hover:text-fg-muted aria-disabled:active:scale-100"
    >
      {children}
    </button>
  );
}
