import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page/PageShell";
import { PageHero } from "@/components/page/PageHero";
import { PageSection } from "@/components/page/PageSection";
import { CardGrid } from "@/components/page/CardGrid";
import { CtaBand } from "@/components/page/CtaBand";
import { GhostButton } from "@/components/page/Buttons";
import { Prose } from "@/components/page/Prose";
import { AppWindow } from "@/components/ui/AppWindow";
import { DownloadButton } from "@/components/ui/DownloadButton";
import { Reveal } from "@/components/motion/Reveal";
import { featureBySlug, featurePages } from "@/content/product";

export function generateStaticParams() {
  return featurePages.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: PageProps<"/features/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const f = featureBySlug(slug);
  if (!f) return {};
  const title = `${f.title} — Scaff`;
  return {
    title,
    description: f.hero.body,
    alternates: { canonical: `/features/${f.slug}` },
    openGraph: { title, description: f.hero.body, url: `/features/${f.slug}`, ...(f.image ? { images: [{ url: f.image.src, width: 2880, height: 1680 }] } : {}) },
  };
}

// Nav, Footer and the closing CTA are the same for every feature, so they
// render outside Suspense (the shared shell); only slug content waits on params.
export default function FeaturePage({ params }: PageProps<"/features/[slug]">) {
  return (
    <PageShell>
      <Suspense fallback={<div className="min-h-svh" />}>
        <FeatureContent params={params} />
      </Suspense>
      <CtaBand />
    </PageShell>
  );
}

async function FeatureContent({ params }: { params: PageProps<"/features/[slug]">["params"] }) {
  const { slug } = await params;
  const f = featureBySlug(slug);
  if (!f) notFound();

  const related = f.related.map(featureBySlug).filter((r) => r !== undefined);

  return (
    <>
      <PageHero
        crumbs={[
          { label: "Product", href: "/product" },
          { label: f.group, href: f.group === "Workflow" ? "/product#workflow" : "/product#features" },
          { label: f.title },
        ]}
        title={f.hero.title}
        body={f.hero.body}
      >
        <DownloadButton size="lg" showAlso={false} />
        {f.docs ? <GhostButton href={f.docs.href}>{f.docs.label}</GhostButton> : null}
      </PageHero>

      {f.image ? (
        <div className="px-4 sm:px-6">
          <Reveal className="mx-auto max-w-6xl">
            <AppWindow title="Scaff">
              <Image src={f.image.src} alt={f.image.alt} width={2880} height={1680} sizes="(min-width: 1152px) 1152px, 100vw" loading="eager" className="h-auto w-full" />
            </AppWindow>
          </Reveal>
        </div>
      ) : null}

      <section aria-label="Details" className="px-4 py-24 sm:px-6 sm:py-32">
        <div className="mx-auto max-w-3xl">
          <Prose sections={f.sections} />
        </div>
      </section>

      <PageSection id="related" tight eyebrow="Related" title="Keep exploring">
        <CardGrid items={related.map((r) => ({ title: r.title, body: r.card, href: `/features/${r.slug}` }))} />
      </PageSection>
    </>
  );
}
