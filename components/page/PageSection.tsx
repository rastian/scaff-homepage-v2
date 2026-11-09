import { SectionHeading } from "@/components/ui/SectionHeading";

type Title = string | readonly [string, string];

// A homepage-rhythm section (py-24 / sm:py-32) with the shared serif heading.
export function PageSection({
  id,
  eyebrow,
  title,
  body,
  align = "center",
  tight = false,
  children,
}: {
  id: string;
  eyebrow?: string;
  title?: Title;
  body?: string;
  align?: "left" | "center";
  // Half the vertical padding, for sections that follow a hero or each other closely.
  tight?: boolean;
  children?: React.ReactNode;
}) {
  const [a, b] = title === undefined ? [undefined, undefined] : typeof title === "string" ? [title, undefined] : title;
  return (
    <section
      id={id}
      aria-labelledby={title ? `${id}-title` : undefined}
      className={`relative px-4 sm:px-6 ${tight ? "py-12 sm:py-16" : "py-24 sm:py-32"}`}
    >
      <div className="mx-auto max-w-6xl">
        {a ? <SectionHeading id={`${id}-title`} eyebrow={eyebrow} title={a} muted={b} body={body} align={align} /> : null}
        {children ? <div className={a ? "mt-14" : ""}>{children}</div> : null}
      </div>
    </section>
  );
}
