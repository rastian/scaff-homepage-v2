// Copy for /product, /features/[slug], /pricing, /compare, /use-cases, /teams
// and /security. Every claim here restates something already said on the
// homepage (content/home.ts); don't add product facts that aren't there.
import type { ProseSection } from "@/components/page/Prose";
import { models } from "./home";

type TwoLines = readonly [string, string];

/* ── Features ─────────────────────────────────────────────────── */

export type FeaturePage = {
  slug: string;
  group: "Workflow" | "Built to ship";
  title: string;
  card: string; // one line for cards
  hero: { title: TwoLines; body: string };
  image?: { src: string; alt: string };
  sections: readonly ProseSection[];
  related: readonly string[];
  docs?: { label: string; href: string };
};

export const featurePages: readonly FeaturePage[] = [
  {
    slug: "design-systems",
    group: "Workflow",
    title: "Design systems",
    card: "Pick a preset, build your own, or extract one. Every Design chat follows it.",
    hero: {
      title: ["A design system", "every chat follows."],
      body: "Scaff writes your design system into the project as DESIGN.md and tokens, so every Design chat starts from your type, colour, and spacing instead of guessing.",
    },
    image: { src: "/media/studio-design-system.jpg", alt: "Scaff design system editor showing color tokens and typography for Linen & Co" },
    sections: [
      {
        id: "start",
        heading: "Four ways to start",
        list: [
          "Start from one of twelve presets.",
          "Build your own in the design system editor.",
          "Import DESIGN.md, DTCG tokens, or shadcn CSS.",
          "Ask a chat to extract one from your project or from a website.",
        ],
      },
      {
        id: "in-the-project",
        heading: "It lives in your project",
        body: [
          "The system is written into the codebase as DESIGN.md and tokens, next to the code it describes. Attach it to a project and every Design chat follows it.",
        ],
      },
    ],
    related: ["live-browser", "canvas", "audit"],
    docs: { label: "Set up a design system", href: "/docs/design-systems" },
  },
  {
    slug: "live-browser",
    group: "Workflow",
    title: "Live annotation",
    card: "Circle a detail on the running page. The agent checks desktop and mobile before it replies.",
    hero: {
      title: ["Show what you mean,", "see what it built."],
      body: "Scaff runs your dev server in its built-in browser. Point at the real page, and the agent screenshots its own changes on desktop and mobile before it hands them back.",
    },
    image: { src: "/media/studio-annotate.jpg", alt: "Annotating a live page inside Scaff's built-in browser" },
    sections: [
      {
        id: "annotate",
        heading: "Annotate the live page",
        body: ["Circle a detail or leave a note right on the running page. The note goes to the agent with the element it points at, so you never have to describe where something is."],
      },
      {
        id: "plan",
        heading: "See the plan first",
        body: ["Design mode can show you a plan before it writes any code. Approve it, change it, or ask for another direction."],
      },
      {
        id: "no-terminal",
        heading: "No terminal needed",
        body: ["Scaff runs your project in the built-in Browser and keeps your history on a branch for you. You don't need to know how to code to work this way."],
      },
    ],
    related: ["devices", "canvas", "review-links"],
    docs: { label: "Get started", href: "/docs/getting-started" },
  },
  {
    slug: "review-links",
    group: "Workflow",
    title: "Review links",
    card: "Share the running prototype. Reviewers pin comments to real elements, no account needed.",
    hero: {
      title: ["Review it on", "the real product."],
      body: "Share a live link to the running prototype, even pages behind a sign-in. Reviewers pin comments to real elements, and you send their feedback to the agent.",
    },
    image: { src: "/media/review-page.jpg", alt: "A review link with comment pins on the running prototype" },
    sections: [
      {
        id: "how",
        heading: "How a review works",
        steps: [
          "Share a live review link from any chat.",
          "Reviewers open it in their browser, type a name, and pin comments to real elements.",
          "Pick the comments you want and send them to the agent with Fix with agent.",
          "The review trail goes into the handoff pull request.",
        ],
      },
      {
        id: "where",
        heading: "Where the review lives",
        body: ["scaff.design keeps only the short link. The prototype is served from your computer, and its comments are kept there."],
      },
    ],
    related: ["pull-requests", "live-browser", "integrations"],
    docs: { label: "Review and handoff", href: "/docs/review-and-handoff" },
  },
  {
    slug: "pull-requests",
    group: "Workflow",
    title: "Pull request handoff",
    card: "Turn a chat into a draft PR with rationale, before and after shots, and the review trail.",
    hero: {
      title: ["Hand engineering", "a pull request."],
      body: "Turn a chat into a draft GitHub pull request or GitLab merge request that engineering can review like any other.",
    },
    image: { src: "/media/studio-handoff.jpg", alt: "A draft pull request with before and after screenshots" },
    sections: [
      {
        id: "contents",
        heading: "What's in the pull request",
        list: ["The design rationale.", "Before and after screenshots.", "The checks that ran.", "The review trail from your review link."],
      },
      {
        id: "where",
        heading: "Where it goes",
        body: ["Scaff opens a draft GitHub pull request or GitLab merge request, so it lands in the review process your team already uses."],
      },
    ],
    related: ["review-links", "audit", "integrations"],
    docs: { label: "Review and handoff", href: "/docs/review-and-handoff" },
  },
  {
    slug: "canvas",
    group: "Built to ship",
    title: "Canvas and branches",
    card: "Every chat on its own branch, your latest five side by side. Undo any step.",
    hero: {
      title: ["Every direction,", "side by side."],
      body: "Each chat works on its own branch, and the project's canvas shows your latest five as frames. Compare them at desktop, tablet, or phone size without switching windows.",
    },
    image: { src: "/media/studio-canvas-phones.jpg", alt: "Scaff canvas showing several design directions as phone-sized frames" },
    sections: [
      {
        id: "frames",
        heading: "Click into the real thing",
        body: ["The frame you pick runs live from its branch. Scroll it, click it, and ask for a change right from the canvas."],
      },
      {
        id: "think",
        heading: "Think around the frames",
        body: ["Draw, write, and drop images next to your designs, then add what you drew to the chat."],
      },
      {
        id: "status",
        heading: "See what needs you",
        body: ["Each frame shows whether its chat is working, waiting for you, or has a reply you haven't read."],
      },
      {
        id: "undo",
        heading: "Experiment without losing work",
        body: ["Each chat keeps its work on its own branch, so directions never overwrite each other. Scaff saves after every reply, and Undo takes a chat back a step. No git needed."],
      },
    ],
    related: ["devices", "live-browser", "design-systems"],
  },
  {
    slug: "audit",
    group: "Built to ship",
    title: "Design audit",
    card: "Four AI auditors score UX flows, polish, accessibility, and content.",
    hero: {
      title: ["Audit it before", "anyone else sees it."],
      body: "Four AI auditors walk your page and hand you a scored report with fixes you can send straight to the agent.",
    },
    sections: [
      {
        id: "auditors",
        heading: "Four auditors",
        list: ["UX flows", "Visual polish", "Accessibility", "Content"],
      },
      {
        id: "report",
        heading: "A report you can act on",
        body: ["Each auditor scores the page and lists fixes. Send the ones you agree with to the agent and it makes the changes in the same chat."],
      },
    ],
    related: ["devices", "pull-requests", "design-systems"],
  },
  {
    slug: "devices",
    group: "Built to ship",
    title: "Synced device preview",
    card: "iPhone, iPad, and MacBook side by side. Scroll once, every device follows.",
    hero: {
      title: ["Every screen size,", "in sync."],
      body: "Preview your page on iPhone, iPad, and MacBook side by side. Scroll, click, and type once, and every device follows.",
    },
    sections: [
      {
        id: "sync",
        heading: "One interaction, three devices",
        body: ["Scrolling, clicking, and typing are mirrored across every preview, so you catch the layout that breaks on a phone while you're looking at the laptop."],
      },
      {
        id: "agent",
        heading: "The agent checks too",
        body: ["Before it hands back a change, the agent screenshots it on desktop and mobile, so a reply never arrives with an unchecked breakpoint."],
      },
    ],
    related: ["live-browser", "canvas", "audit"],
  },
  {
    slug: "integrations",
    group: "Built to ship",
    title: "Figma, tickets, and team sync",
    card: "Read your Figma or Paper selection, start from a ticket, pull in your team's changes.",
    hero: {
      title: ["Works with the tools", "you already use."],
      body: "Scaff reads your Figma or Paper selection, opens chats from your tickets, and keeps your branch up to date with your team.",
    },
    sections: [
      {
        id: "figma",
        heading: "Figma and Paper",
        body: ["Design mode connects to the Figma desktop app through its local MCP server, so the agent can read the frames you have selected. Paper works the same way. Open the app and Scaff connects on its own."],
      },
      {
        id: "tickets",
        heading: "Start from the ticket",
        body: ["Pick an issue from GitHub, GitLab, Linear, or Jira and Scaff opens a chat with it ready to go."],
      },
      {
        id: "team",
        heading: "Keep up with your team",
        body: ["Bring your team's latest changes into a chat in one click, and the agent combines anything that clashes with your work."],
      },
    ],
    related: ["review-links", "pull-requests", "design-systems"],
    docs: { label: "Integrations", href: "/docs/integrations" },
  },
];

export const featureBySlug = (slug: string) => featurePages.find((f) => f.slug === slug);

/* ── /product ─────────────────────────────────────────────────── */

export const productPage = {
  hero: {
    eyebrow: "Product",
    title: ["Design on your real product,", "not a mockup."] as TwoLines,
    body: "Scaff is a desktop app that puts AI to work in your codebase. It follows your design system, runs your product in a built-in browser, and hands engineering a pull request your team has already reviewed.",
  },
  workflow: {
    eyebrow: "The workflow",
    title: ["From design system", "to pull request."] as TwoLines,
    body: "Four steps, on the real thing, in one window.",
  },
  features: {
    eyebrow: "Built to ship",
    title: ["Quality checks", "and safety nets."] as TwoLines,
    body: "Everything that gets a change from a good idea to a mergeable one.",
  },
  more: {
    eyebrow: "Keep exploring",
    title: "Find your way in",
  },
};

/* ── /pricing ─────────────────────────────────────────────────── */

export const pricingPage = {
  hero: {
    eyebrow: "Pricing",
    title: ["Free.", "No credits to buy."] as TwoLines,
    body: "Scaff doesn't sell credits or mark up tokens. Bring the AI you already pay for, or run a free local model.",
  },
  plan: {
    name: "Scaff",
    price: "$0",
    period: "for everyone",
    points: ["No account", "No subscription", "No credits or token markup", "Every feature included", "Mac (Apple silicon and Intel) and 64-bit Windows"],
  },
  connect: {
    eyebrow: "Your model",
    title: ["Use the AI", "you already pay for."] as TwoLines,
    body: "Requests go to the provider you chose, not to us. Your provider may charge for usage; a local model with Ollama costs nothing.",
    ways: [
      { title: "Paste a key", body: "Add an API key in Settings → Models. You pay your provider directly, at their rates.", eyebrow: "API key" },
      { title: "Sign in with your plan", body: "Use the Claude, ChatGPT, Cursor, or Copilot plan you already have.", eyebrow: "Subscription" },
      { title: "Run it locally", body: "Connect Ollama on your computer and run a model at no cost.", eyebrow: "Free" },
    ],
  },
  providers: { label: "Supported providers", items: models.providers },
};

/* ── /compare ─────────────────────────────────────────────────── */

export const comparePage = {
  hero: {
    eyebrow: "Compare",
    title: ["Built for designers,", "not retrofitted."] as TwoLines,
    body: "Coding agents were built for engineers typing in a terminal. Scaff uses the same models and gives them a designer's tools.",
  },
  fit: {
    eyebrow: "Where it fits",
    title: ["Alongside the tools", "you already have."] as TwoLines,
    items: [
      { title: "Next to Figma", body: "Keep exploring in Figma. Scaff reads your selection through Figma's local MCP server and builds it on the real product.", href: "/features/integrations", cta: "Figma and Paper" },
      { title: "Next to your coding agent", body: "Scaff connects the same providers, including Cursor and Copilot plans, and adds a canvas, live annotation, and review links on top.", href: "/pricing", cta: "Bring your model" },
      { title: "Next to your engineers", body: "Changes arrive as a draft pull request with rationale, screenshots, and the review trail, in the repo they already work in.", href: "/features/pull-requests", cta: "Pull request handoff" },
    ],
  },
};

/* ── /use-cases ───────────────────────────────────────────────── */

export const useCasesPage = {
  hero: {
    eyebrow: "Use cases",
    title: ["One studio,", "many ways in."] as TwoLines,
    body: "Whether you design, build, or run the whole product yourself, Scaff meets you on the real thing.",
  },
  roles: {
    eyebrow: "By role",
    title: "Who uses Scaff",
    items: [
      {
        eyebrow: "Product designers",
        title: "Design without a handoff gap",
        body: "Work on the shipped product instead of a copy of it. No terminal, no git, and a pull request at the end.",
        points: ["Annotate the live page", "Compare directions on the canvas", "Get sign-off with a review link"],
        href: "/features/live-browser",
        cta: "Live annotation",
      },
      {
        eyebrow: "Design engineers",
        title: "Keep the system honest",
        body: "Put DESIGN.md and tokens in the repo, let every chat follow them, and audit the result before review.",
        points: ["Import DTCG tokens or shadcn CSS", "Four-auditor design audit", "Draft PRs with before and after"],
        href: "/features/design-systems",
        cta: "Design systems",
      },
      {
        eyebrow: "Founders and small teams",
        title: "Ship polish without a design team",
        body: "Start from a preset and a ticket, try five directions, and merge the one that works.",
        points: ["Twelve design system presets", "Start a chat from a ticket", "Free, with your own model"],
        href: "/pricing",
        cta: "Pricing",
      },
    ],
  },
  tasks: {
    eyebrow: "By task",
    title: "What people do with it",
    items: [
      { title: "Redesign a page from a ticket", body: "Pick the issue from GitHub, GitLab, Linear, or Jira and the chat opens with it ready.", href: "/features/integrations" },
      { title: "Explore several directions", body: "Run a chat per idea and compare the latest five side by side at any size.", href: "/features/canvas" },
      { title: "Extract a system from a live site", body: "Ask a chat to pull a design system from your project or any website.", href: "/features/design-systems" },
      { title: "Get stakeholder sign-off", body: "Share the running prototype. Reviewers comment without an account.", href: "/features/review-links" },
    ],
  },
};

/* ── /teams ───────────────────────────────────────────────────── */

export const teamsPage = {
  hero: {
    eyebrow: "For teams",
    title: ["Review on the real product,", "together."] as TwoLines,
    body: "Scaff keeps design, review, and handoff in one trail, so the pull request engineering gets has already been reviewed.",
  },
  flow: {
    eyebrow: "The review loop",
    title: ["From link", "to merge."] as TwoLines,
    steps: [
      { n: "01", title: "Share a live link", body: "Any chat becomes a review link to the running prototype, even pages behind a sign-in." },
      { n: "02", title: "Pin comments", body: "Reviewers type a name and pin comments to real elements. No account needed." },
      { n: "03", title: "Fix with agent", body: "Send the comments you pick to the agent and it makes the changes in the same chat." },
      { n: "04", title: "Hand off the PR", body: "The draft pull request carries the rationale, screenshots, checks, and review trail." },
    ],
  },
  features: {
    eyebrow: "Team features",
    title: "Built for more than one person",
    items: [
      { title: "Team sync", body: "Bring teammates' latest changes into a chat in one click; the agent combines anything that clashes.", href: "/features/integrations" },
      { title: "Shared design system", body: "DESIGN.md and tokens live in the repo, so everyone's chats follow the same system.", href: "/features/design-systems" },
      { title: "Tickets to chats", body: "Start work from GitHub, GitLab, Linear, or Jira issues.", href: "/features/integrations" },
    ],
  },
};

/* ── /security ────────────────────────────────────────────────── */

export const securityPage = {
  hero: {
    eyebrow: "Security and privacy",
    title: ["Your files stay", "on your computer."] as TwoLines,
    body: "Scaff runs on your machine, works in the folder you pick, and sends requests to the model provider you chose, not to us.",
  },
  sections: [
    {
      id: "keys",
      heading: "Your keys",
      body: ["Your keys stay on the computer running Scaff. Nothing you paste into Settings → Models is sent to Scaff."],
    },
    {
      id: "files",
      heading: "Your files",
      body: ["Scaff works in the folder you pick and sends your requests to the model provider you chose, not to us."],
    },
    {
      id: "local",
      heading: "Fully local, if you want",
      body: ["Connect Ollama to run a model on your own computer, at no cost."],
    },
    {
      id: "review-links",
      heading: "Review links",
      body: ["When you share a review link, scaff.design keeps only the short link. The prototype is served from your computer, and its comments are kept there."],
    },
    {
      id: "telemetry",
      heading: "Usage data and crash reports",
      body: ["Scaff sends anonymous usage data and crash reports, never your files, prompts, or keys. You can turn this off in Settings › Privacy."],
    },
  ] satisfies ProseSection[],
  policy: { label: "Read the privacy policy", href: "https://scaff.design/privacy" },
};
