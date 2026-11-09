export type ProseSection = {
  id: string;
  heading: string;
  body?: readonly string[];
  steps?: readonly string[];
  list?: readonly string[];
  note?: string;
};

// Long-form text for docs, feature details, security, and pricing. 65ch
// measure, 16/17px body, h2s anchored for the "On this page" list.
export function Prose({ sections }: { sections: readonly ProseSection[] }) {
  return (
    <div className="flex flex-col gap-14">
      {sections.map((s) => (
        <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="max-w-[65ch] scroll-mt-28">
          <h2 id={`${s.id}-h`} className="font-serif text-[clamp(1.6rem,2.6vw,2rem)] font-normal leading-[1.15] tracking-[-0.015em] text-fg">
            {s.heading}
          </h2>
          {s.body?.map((p) => (
            <p key={p} className="mt-4 text-pretty text-[16px] leading-[1.7] text-fg-muted sm:text-[17px]">
              {p}
            </p>
          ))}
          {s.steps?.length ? (
            <ol className="mt-6 flex flex-col gap-3">
              {s.steps.map((step, i) => (
                <li key={step} className="grid grid-cols-[2rem_minmax(0,1fr)] items-baseline gap-3 text-[16px] leading-[1.6] text-fg-muted">
                  <span className="grid size-7 translate-y-[-1px] place-items-center rounded-full border border-line-strong font-mono text-[12px] text-fg">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          ) : null}
          {s.list?.length ? (
            <ul className="mt-5 flex flex-col gap-2.5">
              {s.list.map((item) => (
                <li key={item} className="flex gap-3 text-[16px] leading-[1.6] text-fg-muted">
                  <span aria-hidden className="mt-[10px] size-1.5 shrink-0 rounded-full bg-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : null}
          {s.note ? (
            <p className="mt-6 rounded-2xl border border-line bg-surface px-5 py-4 text-[15px] leading-relaxed text-fg-muted">
              <span className="mr-2 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">Note</span>
              {s.note}
            </p>
          ) : null}
        </section>
      ))}
    </div>
  );
}

// "On this page" list for the docs / detail sidebar.
export function Toc({ sections, label = "On this page" }: { sections: readonly ProseSection[]; label?: string }) {
  return (
    <nav aria-label={label}>
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle">{label}</p>
      <ul className="mt-3 border-l border-line">
        {sections.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className="-ml-px flex min-h-10 items-center border-l border-transparent pl-4 text-[14px] text-fg-muted transition-colors duration-[var(--dur-fast)] hover:border-fg-subtle hover:text-fg"
            >
              {s.heading}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
