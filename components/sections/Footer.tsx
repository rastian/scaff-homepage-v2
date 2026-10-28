import { footer } from "@/content/home";
import { LogoMark } from "@/components/ui/Logo";

const isExternal = (href: string) => /^https?:\/\//.test(href);

export function Footer() {
  return (
    <footer className="relative px-4 pb-4 sm:px-6 sm:pb-6">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[28px] border border-line bg-surface">
        <div className="relative z-10 grid gap-12 px-6 pb-8 pt-12 sm:px-10 sm:pt-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div className="flex flex-col items-start gap-6">
            <a
              href="#main"
              aria-label="Scaff, back to top"
              className="-m-2 inline-flex min-h-11 items-center rounded-xl p-2 transition-opacity duration-[var(--dur-fast)] hover:opacity-80 active:opacity-60"
            >
              <LogoMark className="size-9" />
            </a>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
            {footer.columns.map((col) => (
              <div key={col.title}>
                <h2 className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle">{col.title}</h2>
                <ul className="mt-3">
                  {col.links.map((link) => {
                    const external = isExternal(link.href);
                    return (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          className="group -mx-1.5 inline-flex min-h-11 items-center gap-1 rounded-lg px-1.5 text-[15px] text-fg-muted transition-colors duration-[var(--dur-fast)] hover:text-fg active:opacity-70"
                        >
                          <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-px transition-[background-size] duration-[var(--dur-med)] ease-out group-hover:bg-[length:100%_1px] group-focus-visible:bg-[length:100%_1px]">
                            {link.label}
                          </span>
                          {external ? (
                            <svg
                              viewBox="0 0 16 16"
                              className="size-3 text-fg-subtle opacity-0 transition-[opacity,transform] duration-[var(--dur-fast)] ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 group-focus-visible:opacity-100"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              aria-hidden
                            >
                              <path d="M5 11 11 5M6 5h5v5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          ) : null}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>


        <div className="relative z-10 mx-6 flex flex-wrap items-center justify-between gap-3 border-t border-line py-5 text-xs text-fg-subtle sm:mx-10">
          <p>{footer.copyright}</p>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em]">{footer.madeIn}</p>
        </div>


        {/* Giant faint wordmark behind the bottom row, cut off by the card's bottom edge */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 block translate-y-[38%] select-none text-center text-[min(22vw,320px)] font-semibold leading-[0.82] tracking-[-0.06em] text-fg/[0.05]"
        >
          Scaff
        </span>
      </div>
    </footer>
  );
}
