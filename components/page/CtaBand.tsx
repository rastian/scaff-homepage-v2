import { DownloadButton } from "@/components/ui/DownloadButton";
import { Reveal } from "@/components/motion/Reveal";

// Closing download block for sub-pages: a quieter cousin of the homepage FinalCta.
export function CtaBand({
  title = "Start designing with Scaff",
  body = "Free, with no account. Runs on Mac and Windows.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section aria-labelledby="cta-band-title" className="px-4 pb-24 sm:px-6 sm:pb-32">
      <Reveal className="relative mx-auto max-w-6xl overflow-hidden rounded-[28px] border border-line bg-surface px-6 py-16 text-center sm:px-10 sm:py-20">
        <div aria-hidden className="dot-grid pointer-events-none absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_60%_80%_at_50%_100%,black,transparent)]" />
        <div className="relative">
          <h2 id="cta-band-title" className="text-balance font-serif text-[clamp(2rem,4.2vw,3.25rem)] font-normal leading-[1.06] tracking-[-0.02em] text-fg">
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-pretty text-[16px] leading-relaxed text-fg-muted">{body}</p>
          <div className="mt-9 flex justify-center">
            <DownloadButton size="lg" />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
