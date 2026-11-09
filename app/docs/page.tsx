import type { Metadata } from "next";
import { PageShell } from "@/components/page/PageShell";
import { PageHero } from "@/components/page/PageHero";
import { PageSection } from "@/components/page/PageSection";
import { CardGrid } from "@/components/page/CardGrid";
import { docGroups, docPages, docsIndex } from "@/content/docs";

const { hero, help } = docsIndex;

export const metadata: Metadata = {
  title: "Docs — Scaff",
  description: hero.body,
  alternates: { canonical: "/docs" },
  openGraph: { title: "Docs — Scaff", description: hero.body, url: "/docs" },
};

export default function DocsIndexPage() {
  return (
    <PageShell>
      <PageHero eyebrow={hero.eyebrow} title={hero.title} body={hero.body} />
      {docGroups.map((g, i) => (
        <PageSection key={g} id={g.toLowerCase().replace(/\s+/g, "-")} tight={i === 0} title={g} align="left">
          <CardGrid
            columns={3}
            items={docPages.filter((d) => d.group === g).map((d) => ({ title: d.title, body: d.summary, href: `/docs/${d.slug}`, cta: "Read" }))}
          />
        </PageSection>
      ))}
      <PageSection id="help" tight title={help.title} body={help.body} align="left">
        <CardGrid
          columns={2}
          items={help.links.map((l) => ({ title: l.label, body: l.body, href: l.href, cta: "Open" }))}
        />
      </PageSection>
    </PageShell>
  );
}
