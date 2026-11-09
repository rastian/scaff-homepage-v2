import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page/PageShell";
import { Breadcrumbs } from "@/components/page/Breadcrumbs";
import { DocsNav } from "@/components/page/DocsNav";
import { Prose, Toc } from "@/components/page/Prose";
import { Arrow } from "@/components/page/Arrow";
import { docBySlug, docPages } from "@/content/docs";

export function generateStaticParams() {
  return docPages.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/docs/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = docBySlug(slug);
  if (!d) return {};
  const title = `${d.title} — Scaff Docs`;
  return { title, description: d.summary, alternates: { canonical: `/docs/${d.slug}` }, openGraph: { title, description: d.summary, url: `/docs/${d.slug}` } };
}

// Nav and Footer are shared by every doc and render outside Suspense; only
// the slug content waits on params.
export default function DocPage({ params }: PageProps<"/docs/[slug]">) {
  return (
    <PageShell>
      <Suspense fallback={<div className="min-h-svh" />}>
        <DocContent params={params} />
      </Suspense>
    </PageShell>
  );
}

async function DocContent({ params }: { params: PageProps<"/docs/[slug]">["params"] }) {
  const { slug } = await params;
  const doc = docBySlug(slug);
  if (!doc) notFound();

  const i = docPages.findIndex((d) => d.slug === slug);
  const prev = docPages[i - 1];
  const next = docPages[i + 1];

  return (
      <div className="px-4 pb-24 pt-24 sm:px-6 sm:pb-32 sm:pt-32">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[200px_minmax(0,1fr)_200px] lg:gap-14">
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <DocsNav current={slug} />
            </div>
          </aside>

          <article className="min-w-0">
            <Breadcrumbs items={[{ label: "Docs", href: "/docs" }, { label: doc.group }, { label: doc.title }]} />
            <h1 className="mt-3 text-balance font-serif text-[clamp(2.25rem,4.4vw,3.25rem)] font-normal leading-[1.06] tracking-[-0.02em] text-fg">
              {doc.title}
            </h1>
            <p className="mt-4 max-w-[60ch] text-pretty text-[17px] leading-relaxed text-fg-muted sm:text-[18px]">{doc.summary}</p>
            <div className="mt-12 border-t border-line pt-12">
              <Prose sections={doc.sections} />
            </div>

            <nav aria-label="Previous and next" className="mt-16 grid gap-3 border-t border-line pt-8 sm:grid-cols-2">
              {prev ? <Pager href={`/docs/${prev.slug}`} dir="Previous" title={prev.title} /> : <span className="hidden sm:block" />}
              {next ? <Pager href={`/docs/${next.slug}`} dir="Next" title={next.title} /> : null}
            </nav>
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <Toc sections={doc.sections} />
            </div>
          </aside>
        </div>
      </div>
  );
}

function Pager({ href, dir, title }: { href: string; dir: "Previous" | "Next"; title: string }) {
  const nextDir = dir === "Next";
  return (
    <Link
      href={href}
      className={`group flex min-h-20 flex-col justify-center rounded-2xl border border-line bg-surface px-5 py-4 transition-colors duration-[var(--dur-fast)] hover:border-line-strong ${nextDir ? "sm:col-start-2 sm:items-end sm:text-right" : ""}`}
    >
      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle">{dir}</span>
      <span className="mt-1 inline-flex items-center gap-1.5 text-[16px] font-medium text-fg">
        {nextDir ? null : <Arrow className="size-3.5 rotate-180 transition-transform duration-[var(--dur-fast)] group-hover:-translate-x-0.5" />}
        {title}
        {nextDir ? <Arrow className="size-3.5 transition-transform duration-[var(--dur-fast)] group-hover:translate-x-0.5" /> : null}
      </span>
    </Link>
  );
}
