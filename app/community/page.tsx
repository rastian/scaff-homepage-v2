import type { Metadata } from "next";
import { PageShell } from "@/components/page/PageShell";
import { PageHero } from "@/components/page/PageHero";
import { PageSection } from "@/components/page/PageSection";
import { CardGrid } from "@/components/page/CardGrid";
import { CtaBand } from "@/components/page/CtaBand";
import { communityPage } from "@/content/community";

const { hero, channels, more } = communityPage;

export const metadata: Metadata = {
  title: "Community — Scaff",
  description: hero.body,
  alternates: { canonical: "/community" },
  openGraph: { title: "Community — Scaff", description: hero.body, url: "/community" },
};

export default function CommunityPage() {
  return (
    <PageShell>
      <PageHero eyebrow={hero.eyebrow} title={hero.title} body={hero.body} />
      <PageSection id="channels" tight eyebrow={channels.eyebrow} title={channels.title}>
        <CardGrid items={channels.items} />
      </PageSection>
      <PageSection id="keep-up" eyebrow={more.eyebrow} title={more.title}>
        <CardGrid items={more.items} />
      </PageSection>
      <CtaBand />
    </PageShell>
  );
}
