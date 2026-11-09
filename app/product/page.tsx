import type { Metadata } from "next";
import { PageShell } from "@/components/page/PageShell";
import { PageHero } from "@/components/page/PageHero";
import { PageSection } from "@/components/page/PageSection";
import { CardGrid } from "@/components/page/CardGrid";
import { CtaBand } from "@/components/page/CtaBand";
import { GhostButton } from "@/components/page/Buttons";
import { DownloadButton } from "@/components/ui/DownloadButton";
import { featurePages, productPage } from "@/content/product";

const { hero, workflow, features, more } = productPage;

export const metadata: Metadata = {
  title: "Product — Scaff",
  description: hero.body,
  alternates: { canonical: "/product" },
  openGraph: { title: "Product — Scaff", description: hero.body, url: "/product" },
};

const toCard = (f: (typeof featurePages)[number], i?: number) => ({
  eyebrow: i === undefined ? undefined : `0${i + 1}`,
  title: f.title,
  body: f.card,
  href: `/features/${f.slug}`,
  image: f.image?.src,
  alt: f.image?.alt,
});

export default function ProductPage() {
  const flow = featurePages.filter((f) => f.group === "Workflow");
  const ship = featurePages.filter((f) => f.group === "Built to ship");
  return (
    <PageShell>
      <PageHero eyebrow={hero.eyebrow} title={hero.title} body={hero.body}>
        <DownloadButton size="lg" showAlso={false} />
        <GhostButton href="/docs/getting-started">Read the docs</GhostButton>
      </PageHero>

      <PageSection id="workflow" tight eyebrow={workflow.eyebrow} title={workflow.title} body={workflow.body}>
        <CardGrid items={flow.map(toCard)} columns={2} />
      </PageSection>

      <PageSection id="features" eyebrow={features.eyebrow} title={features.title} body={features.body}>
        {/* Text-only: one screenshot in a row of four would leave three cards hollow. */}
        <CardGrid items={ship.map((f) => ({ ...toCard(f), image: undefined }))} columns={4} />
      </PageSection>

      <PageSection id="more" tight eyebrow={more.eyebrow} title={more.title}>
        <CardGrid
          columns={4}
          items={[
            { title: "Pricing", body: "Free, with the model you already pay for.", href: "/pricing" },
            { title: "Compare", body: "Scaff next to a generic coding agent.", href: "/compare" },
            { title: "For teams", body: "Review links, team sync, and handoff.", href: "/teams" },
            { title: "Security", body: "What stays on your computer, and what doesn't.", href: "/security" },
          ]}
        />
      </PageSection>

      <CtaBand />
    </PageShell>
  );
}
