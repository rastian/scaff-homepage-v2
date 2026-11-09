import Link from "next/link";

export type Crumb = { label: string; href?: string };

// Mono eyebrow-style trail. Sits where the eyebrow sits on homepage sections.
export function Breadcrumbs({ items, className = "" }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-x-2 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={c.label} className="flex items-center gap-2">
              {c.href && !last ? (
                <Link
                  href={c.href}
                  className="-mx-1 inline-flex min-h-11 items-center rounded px-1 transition-colors duration-[var(--dur-fast)] hover:text-fg"
                >
                  {c.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={`inline-flex min-h-11 items-center ${last ? "text-fg-muted" : ""}`}>
                  {c.label}
                </span>
              )}
              {!last ? (
                <span aria-hidden className="opacity-60">
                  /
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
