// Rounded desktop-app window chrome (traffic lights + optional title / url).
// Every product demo on the page sits in one of these so they read as one app.
export function AppWindow({
  children,
  title,
  url,
  className = "",
  bodyClassName = "",
  toolbar,
}: {
  children: React.ReactNode;
  title?: string;
  url?: string;
  className?: string;
  bodyClassName?: string;
  toolbar?: React.ReactNode;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[22px] border border-line-strong bg-surface shadow-window ${className}`}
    >
      <div className="flex h-11 items-center gap-3 border-b border-line bg-surface-2/70 px-4">
        <div className="flex gap-1.5" aria-hidden>
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
        </div>
        {title ? <span className="min-w-0 shrink truncate text-xs font-medium text-fg-muted">{title}</span> : null}
        {url ? (
          <span className="mx-auto flex h-7 min-w-0 max-w-xs flex-1 items-center justify-center gap-1.5 truncate rounded-lg bg-ink/70 px-3 font-mono text-[11px] text-fg-subtle">
            <span className="size-1.5 shrink-0 rounded-full bg-mint" aria-hidden />
            {url}
          </span>
        ) : (
          <span className="flex-1" />
        )}
        {toolbar}
      </div>
      <div className={bodyClassName}>{children}</div>
    </div>
  );
}
