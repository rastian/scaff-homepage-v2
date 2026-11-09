// Docs copy. Restates facts from content/home.ts only; deeper reference docs
// (troubleshooting, settings reference) need product input before they exist.
import type { ProseSection } from "@/components/page/Prose";
import { models, downloads } from "./home";

export type DocPage = {
  slug: string;
  group: "Start here" | "Guides";
  title: string;
  summary: string;
  sections: readonly ProseSection[];
};

export const docsIndex = {
  hero: {
    eyebrow: "Docs",
    title: ["Learn Scaff,", "one step at a time."] as readonly [string, string],
    body: "From the first download to your first reviewed pull request.",
  },
  help: {
    title: "Still stuck?",
    body: "Ask in Discord, or open an issue on GitHub.",
    links: [
      { label: "Discord", body: "Ask the team and other designers.", href: "https://discord.gg/byk95jjhwk" },
      { label: "GitHub issues", body: "Report a bug or request a feature.", href: "https://github.com/scaff-design/scaff/issues" },
    ],
  },
};

export const docPages: readonly DocPage[] = [
  {
    slug: "getting-started",
    group: "Start here",
    title: "Getting started",
    summary: "Install Scaff, connect a model, and open your first project.",
    sections: [
      {
        id: "requirements",
        heading: "System requirements",
        list: ["Mac with Apple silicon or Intel.", "64-bit Windows.", "Linux is not supported yet."],
        note: `Every installer is listed at ${downloads.all.replace("https://", "")}.`,
      },
      {
        id: "install",
        heading: "Install",
        steps: [
          "Download the installer for your computer.",
          "On Mac, drag Scaff into Applications. On Windows, run the installer.",
          "Open Scaff. There's no account to create.",
        ],
      },
      {
        id: "model",
        heading: "Connect a model",
        body: ["Open Settings → Models and paste a key, sign in with your Claude, ChatGPT, Cursor, or Copilot plan, or connect Ollama to run a model on your computer."],
      },
      {
        id: "project",
        heading: "Pick a project",
        body: [
          "Add the codebase you're designing, or start fresh with a task like Design a website.",
          "Scaff runs the project in its built-in Browser, so you can point at the live page and ask for changes. You don't need a terminal or git.",
        ],
      },
    ],
  },
  {
    slug: "models",
    group: "Start here",
    title: "Connect a model",
    summary: "Use a key, a plan you already pay for, or a free local model.",
    sections: [
      {
        id: "providers",
        heading: "Supported providers",
        list: models.providers,
      },
      {
        id: "how",
        heading: "Three ways to connect",
        list: [
          "Paste an API key in Settings → Models.",
          "Sign in with your Claude, ChatGPT, Cursor, or Copilot plan.",
          "Connect Ollama on your computer.",
        ],
      },
      {
        id: "cost",
        heading: "What it costs",
        body: ["Scaff is free and doesn't sell credits or mark up tokens. Your provider may charge for usage. Ollama runs locally at no cost."],
      },
      {
        id: "privacy",
        heading: "Where requests go",
        body: ["Your keys stay on the computer running Scaff, and requests go straight to the provider you chose, not to Scaff."],
      },
    ],
  },
  {
    slug: "design-systems",
    group: "Guides",
    title: "Set up a design system",
    summary: "Start from a preset, import tokens, or extract one from a site.",
    sections: [
      {
        id: "options",
        heading: "Ways to create one",
        list: [
          "Start from one of twelve presets.",
          "Build your own in the design system editor.",
          "Import DESIGN.md, DTCG tokens, or shadcn CSS.",
          "Ask a chat to extract one from your project or a website.",
        ],
      },
      {
        id: "attach",
        heading: "Attach it to a project",
        body: ["Scaff writes the system into the project as DESIGN.md and tokens. Attach it to a project and every Design chat follows it."],
      },
    ],
  },
  {
    slug: "review-and-handoff",
    group: "Guides",
    title: "Review and handoff",
    summary: "Share a review link, fix feedback with the agent, open a pull request.",
    sections: [
      {
        id: "share",
        heading: "Share a review link",
        steps: [
          "Share a live review link from any chat. It works for pages behind a sign-in too.",
          "Reviewers open it in their browser, type a name, and pin comments to real elements.",
          "Pick the comments you want and send them to the agent with Fix with agent.",
        ],
        note: "scaff.design keeps only the short link. The prototype is served from your computer, and its comments are kept there.",
      },
      {
        id: "audit",
        heading: "Audit before you hand off",
        body: ["Run the design audit: four AI auditors check UX flows, visual polish, accessibility, and content, and give you a scored report with fixes you can send to the agent."],
      },
      {
        id: "pr",
        heading: "Open a pull request",
        body: ["Turn the chat into a draft GitHub pull request or GitLab merge request. It includes the design rationale, before and after screenshots, the checks that ran, and the review trail."],
      },
    ],
  },
  {
    slug: "integrations",
    group: "Guides",
    title: "Integrations",
    summary: "Figma and Paper, issue trackers, and your team's branches.",
    sections: [
      {
        id: "figma",
        heading: "Figma and Paper",
        body: ["Design mode connects to the Figma desktop app through its local MCP server, so the agent can read the frames you have selected. Paper works the same way. Open the app and Scaff connects on its own."],
      },
      {
        id: "tickets",
        heading: "Issue trackers",
        body: ["Pick an issue from GitHub, GitLab, Linear, or Jira and Scaff opens a chat with it ready to go."],
      },
      {
        id: "team",
        heading: "Team changes",
        body: ["Bring your team's latest changes into a chat in one click, and the agent combines anything that clashes with your work."],
      },
    ],
  },
];

export const docBySlug = (slug: string) => docPages.find((d) => d.slug === slug);
export const docGroups = ["Start here", "Guides"] as const;
