// All homepage copy lives here so sections stay presentational.
// Copy is taken from scaff.design and lightly tightened.

// Section headings are two explicit lines: [first line, second line].
type TwoLines = readonly [string, string];

export const nav = {
  links: [
    { id: "workflow", label: "Workflow" },
    { id: "canvas", label: "Canvas" },
    { id: "features", label: "Features" },
    { id: "models", label: "Models" },
    { id: "discover", label: "Discover" },
    { id: "faq", label: "FAQ" },
  ],
  signIn: "Sign in",
  signInHref: "https://scaff.design",
  stickyCta: "Download Scaff — free",
};

export const downloads = {
  macArm: { label: "Mac", href: "https://scaff.design/api/download/mac?arch=arm64" },
  macIntel: { label: "Intel Mac", href: "https://scaff.design/api/download/mac?arch=x64" },
  windows: { label: "Windows", href: "https://scaff.design/api/download/windows" },
  privacy: "https://scaff.design/privacy",
  // The one line under every download button.
  meta: {
    perks: ["Free", "No account"],
    and: "and",
    alsoFor: "Also for",
    runsOn: "Runs on Mac and Windows",
    privacy: "Privacy",
  },
  all: "https://scaff.design/download",
};

export const hero = {
  badge: { label: "Claude Startups", tag: "Member", href: "https://claude.com/programs/startups" },
  titleA: "Design on your real product",
  titleBrand: "Scaff",
  titleB: "with Scaff. Not a mockup.",
  sub: "AI that works in your codebase, follows your design system, and hands engineering a pull request your team has already reviewed.",
  demo: {
    url: "localhost:3000",
    note: "Make this more editorial",
    reply: "Switched to the serif scale from DESIGN.md and checked desktop + mobile.",
  },
};

export const workflow = {
  eyebrow: "How Scaff works",
  title: ["From design system to pull request,", "on the real thing."] as TwoLines,
  steps: [
    {
      n: "01",
      title: "Start from your design system",
      body: "Pick a preset, build your own, or have a chat extract one from your codebase or a website. Scaff writes it into the project as DESIGN.md and tokens, and every Design chat follows it.",
      image: "/media/studio-design-system.jpg",
      alt: "Scaff design system editor showing color tokens and typography for Linen & Co",
    },
    {
      n: "02",
      title: "Show what you mean, see what it built",
      body: "Scaff runs your dev server in the built-in browser. Circle a detail or leave a note on the live page, and the agent screenshots its own changes on desktop and mobile before it hands them back.",
      image: "/media/studio-annotate.jpg",
      alt: "Annotating a live page inside Scaff's built-in browser",
    },
    {
      n: "03",
      title: "Review it on the real product",
      body: "Share a live link to the running prototype, even pages behind a sign-in. Reviewers pin comments to real elements without an account, and you send their feedback to the agent with Fix with agent.",
      image: "/media/review-page.jpg",
      alt: "A review link with comment pins on the running prototype",
    },
    {
      n: "04",
      title: "Hand engineering a pull request",
      body: "Turn a chat into a draft GitHub pull request or GitLab merge request with the design rationale, before and after screenshots, the checks that ran, and the review trail.",
      image: "/media/studio-handoff.jpg",
      alt: "A draft pull request with before and after screenshots",
    },
  ],
};

export const canvas = {
  eyebrow: "Canvas",
  title: "Every direction, side by side",
  body: "Each chat works on its own branch, and the project's canvas shows your latest five as frames. Compare them at desktop, tablet, or phone size without switching windows.",
  hint: "Drag to explore",
  frames: [
    { id: "a", branch: "chat/editorial-hero", title: "Editorial hero", status: "working" as const },
    { id: "b", branch: "chat/soft-palette", title: "Soft palette", status: "waiting" as const },
    { id: "c", branch: "chat/dense-pricing", title: "Dense pricing", status: "unread" as const },
    { id: "d", branch: "chat/bold-type", title: "Bold type", status: "done" as const },
    { id: "e", branch: "chat/mobile-nav", title: "Mobile nav", status: "done" as const },
  ],
  statusLabel: {
    working: "Working",
    waiting: "Waiting for you",
    unread: "New reply",
    done: "Up to date",
  },
  points: [
    { title: "Click into the real thing", body: "The frame you pick runs live from its branch. Scroll it, click it, and ask for a change right from the canvas." },
    { title: "Think around the frames", body: "Draw, write, and drop images next to your designs, then add what you drew to the chat." },
    { title: "See what needs you", body: "Each frame shows whether its chat is working, waiting for you, or has a reply you haven't read." },
  ],
};

export const features = {
  eyebrow: "Built to ship",
  title: ["Built to ship,", "not just to demo."] as TwoLines,
  body: "Quality checks, safety nets, and the design tools you already use, in one focused place on your computer.",
  items: [
    {
      id: "audit",
      title: "Audit it before anyone else sees it",
      body: "Four AI auditors walk your page for UX flows, visual polish, accessibility, and content, then hand you a scored report with fixes you can send to the agent.",
      auditors: [
        { label: "UX flows", score: 92 },
        { label: "Visual polish", score: 88 },
        { label: "Accessibility", score: 96 },
        { label: "Content", score: 84 },
      ],
    },
    {
      id: "devices",
      title: "Every screen size, in sync",
      body: "Preview your page on iPhone, iPad, and MacBook side by side. Scroll, click, and type once, and every device follows.",
    },
    {
      id: "team",
      title: "Keep up with your team",
      body: "Bring your team's latest changes into a chat in one click, and the agent combines anything that clashes with your work.",
    },
    {
      id: "figma",
      title: "Bring Figma and Paper along",
      body: "Keep Figma or Paper open and Design mode reads your selection through their local MCP servers.",
    },
    {
      id: "undo",
      title: "Experiment without losing work",
      body: "Each chat keeps its work on its own branch, Scaff saves after every reply, and Undo takes a chat back a step. No git needed.",
    },
    {
      id: "ticket",
      title: "Start from the ticket",
      body: "Pick an issue from GitHub, GitLab, Linear, or Jira and Scaff opens a chat with it ready to go.",
    },
  ],
};

export const models = {
  eyebrow: "Models",
  title: ["No credits.", "Use the AI you already pay for."] as TwoLines,
  body: "Scaff doesn't sell credits or mark up tokens. Paste a key, sign in with your Claude, ChatGPT, Cursor, or Copilot plan, or connect Ollama on your computer. Requests go to the provider you chose, not to us.",
  providers: ["Anthropic", "OpenAI", "OpenAI Codex", "OpenCode", "OpenRouter", "GitHub Copilot", "Cursor", "xAI", "Ollama"],
  keyDemo: { label: "Settings → Models", placeholder: "sk-ant-••••••••••••", connected: "Connected", notConnected: "Not connected" },
};

export const compare = {
  eyebrow: "Built for designers",
  title: ["Built for designers,", "not retrofitted."] as TwoLines,
  body: "Coding agents were built for engineers typing in a terminal. Scaff gives AI a designer's tools in one place.",
  tableLabel: "Scaff compared with a generic coding agent",
  featureHeader: "Feature",
  columns: ["Scaff", "Generic agent"],
  rows: [
    { label: "Design systems every chat follows", scaff: true, generic: false },
    { label: "Annotate the live page in a browser", scaff: true, generic: false },
    { label: "Compare directions side by side on a canvas", scaff: true, generic: false },
    { label: "Live review links with comment pins", scaff: true, generic: false },
    { label: "Draft pull requests with before and after shots", scaff: true, generic: false },
    { label: "Synced iPhone, iPad, and MacBook previews", scaff: true, generic: false },
    { label: "A design audit with accessibility checks", scaff: true, generic: false },
    { label: "A branch per chat, no git needed", scaff: true, generic: false },
    { label: "Bring your own AI model, local ones included", scaff: true, generic: true },
    { label: "Free, with no credits to buy", scaff: true, generic: false },
  ],
  collapsedCount: 5,
  showAll: (n: number) => `Show all ${n}`,
  showLess: "Show fewer",
};

export const getStarted = {
  eyebrow: "Get started",
  title: ["From download", "to first draft."] as TwoLines,
  body: "No account to create. Bring a model you already use, or a free local one, and the product you want to shape.",
  steps: [
    { n: "01", title: "Download and open", body: "Drag Scaff into Applications. It opens straight into Scaff.", bodyWindows: "Run the installer. It opens straight into Scaff.", link: { label: "Every installer and system requirements", href: "https://scaff.design/download" } },
    { n: "02", title: "Connect a model", body: "Paste a key in Settings → Models, sign in with your Claude, ChatGPT, Cursor, or Copilot plan, or connect Ollama." },
    { n: "03", title: "Pick a project", body: "Add the codebase you're designing, or start fresh with a task like Design a website." },
  ],
};

export const discover = {
  eyebrow: "Discover",
  title: ["Scaff keeps you", "close to design."] as TwoLines,
  windowTitle: "Discover",
  body: "Discover gathers the design world around your work: fresh reads and talks, open roles, and events worth showing up for.",
  tabs: [
    { id: "news", label: "What's New", body: "Articles, videos, and podcasts from design sources, with filters by source and kind.", image: "/media/studio-whats-new.jpg" },
    { id: "jobs", label: "Jobs", body: "Open design roles from teams that care about craft, filtered by level, location, and remote.", image: "/media/studio-jobs.jpg" },
    { id: "events", label: "Events", body: "Meetups, conferences, and talks worth showing up for, near you or online.", image: "/media/studio-events.jpg" },
  ],
};

export const faq = {
  eyebrow: "FAQ",
  title: ["Questions,", "answered."] as TwoLines,
  body: "The details that matter before you start designing with Scaff.",
  countLabel: "questions",
  items: [
    { q: "Do I need to know how to code?", a: "No. You describe what you want, and Design mode can show you a plan before it writes the code. Scaff runs your project in the built-in Browser and keeps your history on a branch for you, so you never need a terminal." },
    { q: "Can I try several design directions at once?", a: "Yes. Every chat works on its own branch, so directions never overwrite each other. The project's canvas shows your latest five chats side by side as frames at desktop, tablet, or phone size, and you can ask any of them for a change from there." },
    { q: "Is Scaff really free?", a: "Yes. Scaff is free for everyone, with no account, subscription, or credits. Connect the AI provider you already use, which may charge for usage, or run a local model with Ollama at no cost." },
    { q: "Which AI models can I use?", a: "Anthropic, OpenAI, OpenAI Codex, OpenCode, OpenRouter, GitHub Copilot, Cursor, xAI, and Ollama. Paste a key in Settings → Models, sign in with your Claude, ChatGPT, Cursor, or Copilot plan, or connect Ollama on your computer." },
    { q: "Where do my files and keys go?", a: "Your keys stay on the computer running Scaff. Scaff works in the folder you pick and sends your requests to the model provider you chose, not to us. It sends anonymous usage data and crash reports (never your files, prompts, or keys), which you can turn off in Settings › Privacy. When you share a review link, scaff.design keeps only the short link: the prototype is served from your computer, and its comments are kept there." },
    { q: "Does it work with Figma?", a: "Yes. Design mode connects to the Figma desktop app through its local MCP server, so the agent can read the frames you have selected. Paper works the same way. Open the app and Scaff connects on its own." },
    { q: "Can Scaff follow our design system?", a: "Yes. Start from one of twelve presets, build your own in the editor, import DESIGN.md, DTCG tokens, or shadcn CSS, or ask a chat to extract one from your project or a website. Attach it to a project and every Design chat follows it." },
    { q: "How do I get feedback from my team?", a: "Share a live review link from any chat. Reviewers open it in their browser, type a name, and pin comments to real elements of the running prototype. You send the comments you pick to the agent with Fix with agent, and the trail goes into the handoff pull request." },
    { q: "Is there a Windows or Linux version?", a: "Windows, yes. Scaff runs on Apple silicon and Intel Macs, and on 64-bit Windows. Linux is not supported yet." },
  ],
};

export const finalCta = {
  titleA: "Your product.",
  titleB: "Your design system.",
  titleC: "Your model.",
  sub: "Start designing with Scaff",
  pin: "Ship it",
  cursors: { you: "You", agent: "Scaff" },
};

export const footer = {
  columns: [
    { title: "Product", links: [{ label: "Workflow", href: "#workflow" }, { label: "Canvas", href: "#canvas" }, { label: "Features", href: "#features" }, { label: "Changelog", href: "https://scaff.design/changelog" }] },
    { title: "Community", links: [{ label: "GitHub", href: "https://github.com/scaff-design/scaff" }, { label: "Discord", href: "https://discord.gg/byk95jjhwk" }, { label: "X", href: "https://x.com/scaffdesign_" }] },
    { title: "Legal", links: [{ label: "Privacy", href: "https://scaff.design/privacy" }] },
  ],
  copyright: "© 2026 Scaff",
  madeIn: "Made in Berlin by designers, for designers.",
};
