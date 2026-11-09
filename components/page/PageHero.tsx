import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

type Title = string | readonly [string, string];

// Top of every sub-page: breadcrumb (or eyebrow), the page's one h1 in the
// homepage serif, a lede, and optional actions. Paints from server HTML with
// the same CSS fade-up the homepage hero uses.
export function PageHero({
  crumbs,
  eyebrow,
  title,
  body,
  align = "center",
  children,
}: {
  crumbs?: Crumb[];
  eyebrow?: string;
  title: Title;
  body?: string;
  align?: "left" | "center";
  children?: React.ReactNode;
}) {
  const center = align === "center";
  const [a, b] = typeof title === "string" ? [title, null] : title;
  return (
    <section className="relative overflow-x-clip px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-36">
      <div
        aria-hidden
        className="dot-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_55%_70%_at_50%_0%,black,transparent)]"
      />
      <div className={`relative mx-auto max-w-6xl ${center ? "text-center" : ""}`}>
        <div className={`animate-fade-up ${center ? "flex justify-center" : ""}`}>
          {crumbs ? (
            <Breadcrumbs items={crumbs} />
          ) : eyebrow ? (
            <p className="flex min-h-11 items-center font-mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle">{eyebrow}</p>
          ) : null}
        </div>
        <h1
          style={{ animationDelay: "0.05s" }}
          className={`animate-fade-up mt-4 max-w-4xl text-balance font-serif text-[clamp(2.5rem,5.6vw,4.25rem)] font-normal leading-[1.04] tracking-[-0.02em] text-fg ${center ? "mx-auto" : ""}`}
        >
          {a}
          {b ? <span className="block">{b}</span> : null}
        </h1>
        {body ? (
          <p
            style={{ animationDelay: "0.15s" }}
            className={`animate-fade-up mt-7 max-w-2xl text-pretty text-[17px] leading-relaxed text-fg-muted sm:text-[18px] ${center ? "mx-auto" : ""}`}
          >
            {body}
          </p>
        ) : null}
        {children ? (
          <div style={{ animationDelay: "0.25s" }} className={`animate-fade-up mt-10 flex flex-wrap gap-3 ${center ? "justify-center" : ""}`}>
            {children}
          </div>
        ) : null}
      </div>
    </section>
  );
}
