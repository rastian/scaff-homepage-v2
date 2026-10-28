import { Reveal } from "@/components/motion/Reveal";

// Intent-style serif section heading: large, regular weight, one colour.
// `muted` (name kept for history) is the heading's second line: rendered as
// its own block in the same colour, so headings break where they read best.
export function SectionHeading({
  eyebrow,
  title,
  muted,
  body,
  align = "center",
  id,
  className = "",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  muted?: React.ReactNode;
  body?: React.ReactNode;
  align?: "left" | "center";
  id?: string;
  className?: string;
}) {
  const center = align === "center";
  return (
    <Reveal className={`${center ? "mx-auto text-center" : ""} max-w-3xl ${className}`}>
      {eyebrow ? (
        <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle">{eyebrow}</p>
      ) : null}
      <h2 id={id} className={headingClass}>
        {title}
        {muted ? <span className="block">{muted}</span> : null}
      </h2>
      {body ? (
        <p className={`mt-6 max-w-xl text-pretty text-[17px] leading-relaxed text-fg-muted ${center ? "mx-auto" : ""}`}>
          {body}
        </p>
      ) : null}
    </Reveal>
  );
}

const headingClass =
  "text-balance font-serif text-[clamp(2.25rem,4.6vw,3.75rem)] font-normal leading-[1.04] tracking-[-0.02em] text-fg";

// Quiet emphasis inside a serif heading: italic, same colour. Use at most once per section.
export function Accent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <em className={`font-serif italic ${className}`}>{children}</em>;
}
