import type { Metadata } from "next";
import Image from "next/image";
import { PageShell } from "@/components/page/PageShell";
import { PageHero } from "@/components/page/PageHero";
import { PageSection } from "@/components/page/PageSection";
import { CardGrid } from "@/components/page/CardGrid";
import { CtaBand } from "@/components/page/CtaBand";
import { GhostButton } from "@/components/page/Buttons";
import { AppWindow } from "@/components/ui/AppWindow";
import { DownloadButton } from "@/components/ui/DownloadButton";
import { Reveal } from "@/components/motion/Reveal";
import { teamsPage } from "@/content/product";

const { hero, flow, features } = teamsPage;

export const metadata: Metadata = {
  title: "Scaff for teams",
  description: hero.body,
  alternates: { canonical: "/teams" },
  openGraph: { title: "Scaff for teams", description: hero.body, url: "/teams" },
};

export default function TeamsPage() {
  return (
    <PageShell>
      <PageHero eyebrow={hero.eyebrow} title={hero.title} body={hero.body}>
        <DownloadButton size="lg" showAlso={false} />
        <GhostButton href="/security">Security and privacy</GhostButton>
      </PageHero>

      <div className="px-4 sm:px-6">
        <Reveal className="mx-auto max-w-6xl">
          <AppWindow url="review link">
            <Image
              src="/media/review-page.jpg"
              alt="A review link with comment pins on the running prototype"
              width={2880}
              height={1680}
              sizes="(min-width: 1152px) 1152px, 100vw"
              loading="eager"
              className="h-auto w-full"
            />
          </AppWindow>
        </Reveal>
      </div>

      <PageSection id="flow" eyebrow={flow.eyebrow} title={flow.title}>
        <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {flow.steps.map((s, i) => (
            <li key={s.n} className="flex">
              <Reveal delay={i * 0.06} className="flex w-full flex-col rounded-3xl border border-line bg-surface p-6 sm:p-7">
                <span className="grid size-10 place-items-center rounded-full border border-line-strong font-mono text-[13px] text-fg">
                  <span className="sr-only">Step </span>
                  {s.n}
                </span>
                <h3 className="mt-6 text-xl font-semibold tracking-[-0.02em] text-fg">{s.title}</h3>
                <p className="mt-2 text-pretty text-[15px] leading-relaxed text-fg-muted">{s.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </PageSection>

      <PageSection id="team-features" tight eyebrow={features.eyebrow} title={features.title}>
        <CardGrid items={features.items} />
      </PageSection>

      <CtaBand />
    </PageShell>
  );
}
