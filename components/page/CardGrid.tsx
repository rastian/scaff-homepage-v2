import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { Arrow, ExternalArrow, isExternal } from "./Arrow";

export type Card = {
  title: string;
  body: string;
  href?: string;
  eyebrow?: string;
  points?: readonly string[];
  image?: string;
  alt?: string;
  cta?: string;
};

const cols = { 2: "md:grid-cols-2", 3: "md:grid-cols-2 lg:grid-cols-3", 4: "md:grid-cols-2 lg:grid-cols-4" } as const;

// Surface cards in the homepage's rounded-3xl / border-line language. A card
// with an href is one link (whole card is the target, title is its name).
export function CardGrid({ items, columns = 3 }: { items: readonly Card[]; columns?: keyof typeof cols }) {
  return (
    <ul className={`grid grid-cols-1 gap-4 ${cols[columns]}`}>
      {items.map((c, i) => (
        <li key={c.title} className="flex">
          <Reveal delay={(i % columns) * 0.06} className="flex w-full">
            <CardBody card={c} />
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

function CardBody({ card: c }: { card: Card }) {
  const linked = !!c.href;
  const external = c.href ? isExternal(c.href) : false;
  const inner = (
    <>
      {c.image ? (
        <div className="relative -mx-6 -mt-6 mb-6 aspect-[12/7] overflow-hidden border-b border-line bg-surface-2 sm:-mx-7 sm:-mt-7">
          <Image src={c.image} alt={c.alt ?? ""} fill sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw" className="object-cover object-top" />
        </div>
      ) : null}
      {c.eyebrow ? <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle">{c.eyebrow}</p> : null}
      <h3 className={`${c.eyebrow ? "mt-3" : ""} text-xl font-semibold tracking-[-0.02em] text-fg`}>{c.title}</h3>
      <p className="mt-2 text-pretty text-[15px] leading-relaxed text-fg-muted">{c.body}</p>
      {c.points?.length ? (
        <ul className="mt-5 flex flex-col gap-2 border-t border-line pt-5">
          {c.points.map((p) => (
            <li key={p} className="flex gap-2.5 text-[14px] leading-snug text-fg-muted">
              <span aria-hidden className="mt-[7px] size-1.5 shrink-0 rounded-full bg-accent" />
              {p}
            </li>
          ))}
        </ul>
      ) : null}
      {linked ? (
        <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-medium text-fg">
          {c.cta ?? "Learn more"}
          {external ? (
            <ExternalArrow className="size-3.5 transition-transform duration-[var(--dur-fast)] ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          ) : (
            <Arrow className="size-3.5 transition-transform duration-[var(--dur-fast)] ease-out group-hover:translate-x-0.5" />
          )}
        </span>
      ) : null}
    </>
  );

  const base = "group flex w-full flex-col overflow-hidden rounded-3xl border border-line bg-surface p-6 sm:p-7";
  if (!c.href) return <div className={base}>{inner}</div>;
  const interactive = `${base} transition-[border-color,background-color,transform] duration-[var(--dur-fast)] ease-out hover:-translate-y-0.5 hover:border-line-strong active:translate-y-0 active:scale-[0.99]`;
  return external ? (
    <a href={c.href} target="_blank" rel="noopener noreferrer" className={interactive}>
      {inner}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  ) : (
    <Link href={c.href} className={interactive}>
      {inner}
    </Link>
  );
}
