import Link from "next/link";
import { Arrow, ExternalArrow, isExternal } from "./Arrow";

// Quiet pill link: the SecondaryDownload treatment, for "Read the docs" and friends.
export function GhostButton({ href, children }: { href: string; children: React.ReactNode }) {
  const cls =
    "group inline-flex h-13 items-center gap-2 rounded-full border border-line-strong px-6 text-[15px] font-medium text-fg transition-[background-color,transform] duration-[var(--dur-fast)] ease-out hover:bg-fg/5 active:scale-[0.98]";
  if (isExternal(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
        <ExternalArrow className="size-3.5 transition-transform duration-[var(--dur-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
      <Arrow className="size-3.5 transition-transform duration-[var(--dur-fast)] group-hover:translate-x-0.5" />
    </Link>
  );
}

// Primary pill link, the DownloadButton fill, for non-download actions.
export function SolidButton({ href, children }: { href: string; children: React.ReactNode }) {
  const external = isExternal(href);
  const cls =
    "group inline-flex h-13 items-center gap-2 rounded-full bg-fg px-7 text-[15px] font-medium text-ink shadow-[0_8px_24px_-8px_rgb(0_0_0/0.5)] transition-[transform,box-shadow] duration-[var(--dur-fast)] ease-out hover:-translate-y-px active:translate-y-0 active:scale-[0.98]";
  const icon = external ? <ExternalArrow className="size-3.5" /> : <Arrow className="size-3.5 transition-transform duration-[var(--dur-fast)] group-hover:translate-x-0.5" />;
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {children}
      {icon}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  ) : (
    <Link href={href} className={cls}>
      {children}
      {icon}
    </Link>
  );
}
