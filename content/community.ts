// Copy for /community and /discover.
import { discover } from "./home";

type TwoLines = readonly [string, string];

export const communityPage = {
  hero: {
    eyebrow: "Community",
    title: ["Made by designers,", "for designers."] as TwoLines,
    body: "Scaff is built in Berlin, in the open. Come say hi, share what you're making, and tell us what to build next.",
  },
  channels: {
    eyebrow: "Join in",
    title: "Where to find us",
    items: [
      { eyebrow: "Chat", title: "Discord", body: "Ask questions, share work in progress, and talk with the team.", href: "https://discord.gg/byk95jjhwk", cta: "Join the Discord" },
      { eyebrow: "Code", title: "GitHub", body: "Report bugs, follow development, and read the source.", href: "https://github.com/scaff-design/scaff", cta: "Open GitHub" },
      { eyebrow: "Updates", title: "X", body: "Release notes, previews, and things we like.", href: "https://x.com/scaffdesign_", cta: "Follow @scaffdesign_" },
    ],
  },
  more: {
    eyebrow: "Stay close",
    title: "Keep up",
    items: [
      { title: "Changelog", body: "Everything that shipped, release by release.", href: "https://scaff.design/changelog", cta: "Read the changelog" },
      { title: "Discover", body: "Design reads, open roles, and events, gathered inside Scaff.", href: "/discover", cta: "See Discover" },
      { title: "Docs", body: "Guides from first download to first pull request.", href: "/docs", cta: "Read the docs" },
    ],
  },
};

export const discoverPage = {
  hero: {
    eyebrow: "Discover",
    title: ["Scaff keeps you", "close to design."] as TwoLines,
    body: discover.body,
  },
  sections: discover.tabs.map((t) => ({
    id: t.id,
    title: t.label,
    body: t.body,
    image: t.image,
    alt: `Scaff's Discover window, ${t.label} tab`,
  })),
  note: "Discover lives inside the Scaff app and updates on its own.",
};
