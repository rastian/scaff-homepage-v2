import type { Metadata } from "next";
import { PageShell } from "@/components/page/PageShell";
import { PageHero } from "@/components/page/PageHero";
import { PageSection } from "@/components/page/PageSection";
import { CardGrid } from "@/components/page/CardGrid";
import { CtaBand } from "@/components/page/CtaBand";
import { DownloadButton } from "@/components/ui/DownloadButton";
import { Reveal } from "@/components/motion/Reveal";
import { pricingPage } from "@/content/product";
import { faq } from "@/content/home";

const { hero, plan, connect, providers } = pricingPage;

export const metadata: Metadata = {
  title: "Pricing — Scaff",
  description: hero.body,
  alternates: { canonical: "/pricing" },
  openGraph: { title: "Pricing — Scaff", description: hero.body, url: "/pricing" },
};

// FAQ entries that answer cost questions, reused verbatim from the homepage.
const costQuestions = faq.items.filter((i) => /free|models|keys/i.test(i.q));

export default function PricingPage() {
  return (
    <PageShell>
      <PageHero eyebrow={hero.eyebrow} title={hero.title} body={hero.body} />

      <section aria-labelledby="plan-name" className="px-4 sm:px-6">
        <Reveal className="mx-auto max-w-md overflow-hidden rounded-3xl border border-line-strong bg-surface shadow-window">
          <div className="border-b border-line px-7 pb-7 pt-8 text-center sm:px-9">
            <h2 id="plan-name" className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle">
              {plan.name}
            </h2>
            <p className="mt-4 flex items-baseline justify-center gap-2">
              <span className="font-serif text-[64px] leading-none tracking-[-0.03em] text-fg">{plan.price}</span>
              <span className="text-[15px] text-fg-muted">{plan.period}</span>
            </p>
          </div>
          <ul className="flex flex-col gap-3 px-7 py-7 sm:px-9">
            {plan.points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-[15px] leading-snug text-fg">
                <span aria-hidden className="mt-px grid size-5 shrink-0 place-items-center rounded-full bg-blue text-white">
                  <svg viewBox="0 0 12 12" className="size-2.5" fill="none">
                    <path d="M2.5 6.3 4.9 8.6 9.5 3.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {p}
              </li>
            ))}
          </ul>
          <div className="flex justify-center border-t border-line bg-surface-2/50 px-7 pb-6 pt-7">
            <DownloadButton size="lg" />
          </div>
        </Reveal>
      </section>

      <PageSection id="models" eyebrow={connect.eyebrow} title={connect.title} body={connect.body}>
        <CardGrid items={connect.ways} />
        <Reveal className="mt-12 text-center">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle">{providers.label}</h3>
          <ul className="mx-auto mt-5 flex max-w-3xl flex-wrap justify-center gap-2">
            {providers.items.map((p) => (
              <li key={p} className="inline-flex h-9 items-center rounded-full border border-line bg-surface px-4 text-[14px] text-fg-muted">
                {p}
              </li>
            ))}
          </ul>
        </Reveal>
      </PageSection>

      <PageSection id="questions" tight eyebrow="FAQ" title="Cost questions">
        <dl className="mx-auto flex max-w-3xl flex-col divide-y divide-line rounded-3xl border border-line bg-surface">
          {costQuestions.map((item) => (
            <div key={item.q} className="px-6 py-6 sm:px-8">
              <dt className="text-[17px] font-semibold tracking-[-0.01em] text-fg">{item.q}</dt>
              <dd className="mt-2 text-pretty text-[15px] leading-relaxed text-fg-muted">{item.a}</dd>
            </div>
          ))}
        </dl>
      </PageSection>

      <CtaBand title="Free today, free tomorrow" />
    </PageShell>
  );
}
