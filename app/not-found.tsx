import { PageShell } from "@/components/page/PageShell";
import { PageHero } from "@/components/page/PageHero";
import { GhostButton, SolidButton } from "@/components/page/Buttons";

export default function NotFound() {
  return (
    <PageShell>
      <PageHero eyebrow="404" title={["This page isn't", "on the canvas."]} body="The link may be old, or the page moved. Try one of these instead.">
        <SolidButton href="/">Back to home</SolidButton>
        <GhostButton href="/docs">Read the docs</GhostButton>
      </PageHero>
    </PageShell>
  );
}
