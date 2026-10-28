import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Intent-style display serif for every headline. Optical sizing keeps the
// large hero sizes crisp; regular weight reads calm.
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
});

const title = "Scaff — Design on Your Real Product with AI, Not a Mockup";
const description =
  "AI that works in your codebase, follows your design system, and hands engineering a pull request your team has already reviewed.";

// The favicon comes from app/icon.svg (file convention).
export const metadata: Metadata = {
  metadataBase: new URL("https://scaff.design"),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "Scaff",
    images: [{ url: "/media/studio-tour-poster.jpg", width: 1920, height: 1120 }],
  },
  twitter: { card: "summary_large_image", site: "@scaffdesign_" },
};

// Toolbar colour per theme; the theme script below and ThemeToggle keep
// <meta name="theme-color"> in sync with the active theme.
const THEME_COLOR = { dark: "#161615", light: "#f7f4ef" };

export const viewport: Viewport = {
  themeColor: THEME_COLOR.dark,
};

// Runs while the HTML is parsed, before first paint, so a saved light theme
// never flashes dark. A plain inline script: next/script's beforeInteractive
// only runs once the client bundle has loaded.
const themeScript = `try{var t=localStorage.getItem("scaff-theme");if(t==="dark"||t==="light"){document.documentElement.dataset.theme=t;var c=t==="light"?${JSON.stringify(THEME_COLOR.light)}:${JSON.stringify(THEME_COLOR.dark)},m=document.querySelector('meta[name="theme-color"]');if(!m){m=document.createElement("meta");m.name="theme-color";document.head.prepend(m)}m.content=c}}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full overflow-x-clip">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
