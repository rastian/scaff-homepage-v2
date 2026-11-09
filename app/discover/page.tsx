import type { Metadata } from "next";
import Image from "next/image";
import { PageShell } from "@/components/page/PageShell";
import { PageHero } from "@/components/page/PageHero";
import { CtaBand } from "@/components/page/CtaBand";
import { AppWindow } from "@/components/ui/AppWindow";
import { Reveal } from "@/components/motion/Reveal";
import { discoverPage } from "@/content/community";

const { hero, sections, note } = discoverPage;

export const metadata: Metadata = {
  title: "Discover — Scaff",
  description: hero.body,
  alternates: { canonical: "/discover" },
  openGraph: { title: "Discover — Scaff", description: hero.body, url: "/discover" },
};

export default function DiscoverPage() {
  return (
    <PageShell>
      <PageHero eyebrow={hero.eyebrow} title={hero.title} body={hero.body}>
        <nav aria-label="Discover sections" className="flex flex-wrap justify-center gap-1 rounded-full border border-line bg-surface-2 p-1">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="inline-flex min-h-11 items-center rounded-full px-5 text-sm font-medium text-fg-muted transition-colors duration-[var(--dur-fast)] hover:bg-surface hover:text-fg"
            >
              {s.title}
            </a>
          ))}
        </nav>
      </PageHero>

      <div className="flex flex-col gap-24 px-4 pb-24 sm:gap-32 sm:px-6 sm:pb-32">
        {sections.map((s, i) => (
          <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="scroll-mt-24">
            {/* Alternate sides; the screenshot always gets the 8fr column. */}
            <div
              className={`mx-auto grid max-w-6xl items-center gap-10 lg:gap-14 ${
                i % 2 ? "lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)]" : "lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]"
              }`}
            >
              <Reveal className={i % 2 ? "lg:order-2" : ""}>
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle">0{i + 1}</p>
                <h2 id={`${s.id}-title`} className="mt-4 font-serif text-[clamp(2rem,3.6vw,2.75rem)] font-normal leading-[1.06] tracking-[-0.02em] text-fg">
                  {s.title}
                </h2>
                <p className="mt-4 max-w-sm text-pretty text-[17px] leading-relaxed text-fg-muted">{s.body}</p>
              </Reveal>
              <Reveal delay={0.06}>
                <AppWindow title="Discover">
                  <Image src={s.image} alt={s.alt} width={2880} height={1680} sizes="(min-width: 1024px) 760px, 100vw" loading={i === 0 ? "eager" : "lazy"} className="h-auto w-full" />
                </AppWindow>
              </Reveal>
            </div>
          </section>
        ))}
      </div>

      <CtaBand body={note} />
    </PageShell>
  );
}
