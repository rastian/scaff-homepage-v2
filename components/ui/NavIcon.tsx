// 16px line icons for the main nav. Same drawing rules as the other inline
// icons on the site: 16-unit viewBox, currentColor, round caps and joins.
const paths: Record<string, React.ReactNode> = {
  // Two nodes joined by a path: design system → pull request.
  workflow: (
    <>
      <circle cx="4" cy="4" r="1.75" />
      <circle cx="12" cy="12" r="1.75" />
      <path d="M5.75 4H9a2.5 2.5 0 0 1 2.5 2.5v.5M10.25 12H7a2.5 2.5 0 0 1-2.5-2.5V9" />
    </>
  ),
  // Bento grid, after the Features tile layout.
  features: (
    <>
      <rect x="2" y="2" width="5" height="5" rx="1.25" />
      <rect x="9" y="2" width="5" height="5" rx="1.25" />
      <rect x="2" y="9" width="5" height="5" rx="1.25" />
      <rect x="9" y="9" width="5" height="5" rx="1.25" />
    </>
  ),
  // AI sparkle.
  models: (
    <>
      <path d="M7 2.5 8.2 5.8 11.5 7 8.2 8.2 7 11.5 5.8 8.2 2.5 7 5.8 5.8Z" />
      <path d="M12.25 10.5v3M10.75 12h3" />
    </>
  ),
  faq: (
    <>
      <circle cx="8" cy="8" r="6" />
      <path d="M6.25 6.25a1.75 1.75 0 1 1 2.4 1.62c-.4.17-.65.55-.65.98v.4" />
      <circle cx="8" cy="11.25" r="0.6" fill="currentColor" stroke="none" />
    </>
  ),
  // Price tag.
  pricing: (
    <>
      <path d="M2.5 3.25v3.6a1 1 0 0 0 .3.7l5.7 5.7a1 1 0 0 0 1.4 0l3.15-3.15a1 1 0 0 0 0-1.4L7.35 3a1 1 0 0 0-.7-.3H3.05a.55.55 0 0 0-.55.55Z" />
      <circle cx="5.25" cy="5.5" r="0.75" fill="currentColor" stroke="none" />
    </>
  ),
  // Document, as used for DESIGN.md in the Workflow demo.
  docs: (
    <>
      <path d="M4 1.75h5.5L12.5 4.75v9.5h-8.5z" />
      <path d="M9.25 1.75v3.25h3.25M6 8.5h4M6 11h3" />
    </>
  ),
};

export function NavIcon({ id, className = "size-4" }: { id: string; className?: string }) {
  const p = paths[id];
  if (!p) return null;
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {p}
    </svg>
  );
}
