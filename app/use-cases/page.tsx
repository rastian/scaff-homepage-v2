import type { Metadata } from "next";
import { PageShell } from "@/components/page/PageShell";
import { PageHero } from "@/components/page/PageHero";
import { PageSection } from "@/components/page/PageSection";
import { CardGrid } from "@/components/page/CardGrid";
import { CtaBand } from "@/components/page/CtaBand";
import { useCasesPage } from "@/content/product";

const { hero, roles, tasks } = useCasesPage;

export const metadata: Metadata = {
  title: "Use cases — Scaff",
  description: hero.body,
  alternates: { canonical: "/use-cases" },
  openGraph: { title: "Use cases — Scaff", description: hero.body, url: "/use-cases" },
};

export default function UseCasesPage() {
  return (
    <PageShell>
      <PageHero eyebrow={hero.eyebrow} title={hero.title} body={hero.body} />
      <PageSection id="roles" tight eyebrow={roles.eyebrow} title={roles.title}>
        <CardGrid items={roles.items} />
      </PageSection>
      <PageSection id="tasks" eyebrow={tasks.eyebrow} title={tasks.title}>
        <CardGrid items={tasks.items} columns={4} />
      </PageSection>
      <CtaBand />
    </PageShell>
  );
}
