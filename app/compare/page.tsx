import type { Metadata } from "next";
import { PageShell } from "@/components/page/PageShell";
import { PageHero } from "@/components/page/PageHero";
import { PageSection } from "@/components/page/PageSection";
import { CardGrid } from "@/components/page/CardGrid";
import { CtaBand } from "@/components/page/CtaBand";
import { Compare } from "@/components/sections/Compare";
import { comparePage } from "@/content/product";

const { hero, fit } = comparePage;

export const metadata: Metadata = {
  title: "Scaff compared with coding agents — Scaff",
  description: hero.body,
  alternates: { canonical: "/compare" },
  openGraph: { title: "Scaff compared with coding agents", description: hero.body, url: "/compare" },
};

export default function ComparePage() {
  return (
    <PageShell>
      <PageHero eyebrow={hero.eyebrow} title={hero.title} body={hero.body} />
      <Compare heading={false} defaultOpen />
      <PageSection id="fit" eyebrow={fit.eyebrow} title={fit.title}>
        <CardGrid items={fit.items} />
      </PageSection>
      <CtaBand />
    </PageShell>
  );
}
