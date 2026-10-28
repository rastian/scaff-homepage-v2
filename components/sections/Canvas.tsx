import { canvas } from "@/content/home";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CanvasBoard } from "./CanvasBoard";

// ── Section ──────────────────────────────────────────────────────────────

// One icon per canvas.points entry, in order; a point without its own icon gets none.
const POINT_ICONS = [
  // Click into the real thing: pointer on a frame
  <svg key="live" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-[18px]">
    <rect x="2.75" y="3.75" width="14.5" height="10.5" rx="2" />
    <path d="M9.5 9.5 15 12l-2.4.6-.9 2.4Z" fill="currentColor" stroke="none" />
  </svg>,
  // Think around the frames: pen
  <svg key="draw" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-[18px]">
    <path d="M12.8 3.7a1.8 1.8 0 0 1 2.5 2.5L7 14.5l-3.3.8.8-3.3Z" />
    <path d="M3.5 17.5c2.5-1 4.5.8 7 0s3.5-1 6 0" />
  </svg>,
  // See what needs you: status dots
  <svg key="status" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="size-[18px]">
    <circle cx="5" cy="5.5" r="1.6" fill="currentColor" stroke="none" />
    <circle cx="5" cy="10" r="1.6" fill="currentColor" stroke="none" />
    <circle cx="5" cy="14.5" r="1.6" fill="currentColor" stroke="none" />
    <path d="M9 5.5h7M9 10h5M9 14.5h6" />
  </svg>,
];

export function Canvas() {
  return (
    <section id="canvas" aria-labelledby="canvas-heading" className="relative overflow-x-clip px-4 pb-24 pt-20 sm:px-6 sm:pb-32 sm:pt-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="canvas-heading"
          align="center"
          eyebrow={canvas.eyebrow}
          title={canvas.title}
          body={canvas.body}
        />
      </div>

      <div className="mx-auto mt-14 max-w-7xl sm:mt-16">
        <Reveal y={28}>
          <CanvasBoard />
        </Reveal>
      </div>

      <div className="mx-auto mt-16 max-w-6xl sm:mt-20">
        <ul className="grid gap-10 sm:grid-cols-3 sm:gap-8">
          {canvas.points.map((p, i) => (
            <li key={p.title}>
              <Reveal delay={i * 0.08}>
                <span
                  aria-hidden
                  className="grid size-9 place-items-center rounded-xl border border-line bg-surface-2 text-fg-muted"
                >
                  {POINT_ICONS[i]}
                </span>
                <h3 className="mt-4 text-[17px] font-semibold tracking-[-0.02em] text-fg">{p.title}</h3>
                <p className="mt-2 max-w-sm text-pretty text-[15px] leading-relaxed text-fg-muted">{p.body}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
