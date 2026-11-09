import type { Metadata } from "next";
import { PageShell } from "@/components/page/PageShell";
import { PageHero } from "@/components/page/PageHero";
import { CtaBand } from "@/components/page/CtaBand";
import { GhostButton } from "@/components/page/Buttons";
import { Prose, Toc } from "@/components/page/Prose";
import { securityPage } from "@/content/product";

const { hero, sections, policy } = securityPage;

export const metadata: Metadata = {
  title: "Security and privacy — Scaff",
  description: hero.body,
  alternates: { canonical: "/security" },
  openGraph: { title: "Security and privacy — Scaff", description: hero.body, url: "/security" },
};

export default function SecurityPage() {
  return (
    <PageShell>
      <PageHero eyebrow={hero.eyebrow} title={hero.title} body={hero.body} align="left">
        <GhostButton href={policy.href}>{policy.label}</GhostButton>
      </PageHero>
      <div className="px-4 pb-24 sm:px-6 sm:pb-32">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-16">
          <Prose sections={sections} />
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <Toc sections={sections} />
            </div>
          </aside>
        </div>
      </div>
      <CtaBand />
    </PageShell>
  );
}
