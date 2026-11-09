import Link from "next/link";
import { docGroups, docPages } from "@/content/docs";

// Left rail for /docs/[slug]: every doc, grouped, current one marked.
export function DocsNav({ current }: { current: string }) {
  return (
    <nav aria-label="Docs">
      {docGroups.map((g) => (
        <div key={g} className="mb-8 last:mb-0">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle">{g}</p>
          <ul className="mt-2">
            {docPages
              .filter((d) => d.group === g)
              .map((d) => {
                const on = d.slug === current;
                return (
                  <li key={d.slug}>
                    <Link
                      href={`/docs/${d.slug}`}
                      aria-current={on ? "page" : undefined}
                      className={`-mx-3 flex min-h-10 items-center rounded-xl px-3 text-[14px] transition-colors duration-[var(--dur-fast)] ${
                        on ? "bg-fg/[0.07] font-medium text-fg" : "text-fg-muted hover:bg-fg/[0.04] hover:text-fg"
                      }`}
                    >
                      {d.title}
                    </Link>
                  </li>
                );
              })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
