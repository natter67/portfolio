import type { Metadata } from "next";
import "./globals.css";
import { fontVariables } from "@/lib/fonts";
import { grains } from "@/lib/grains";
import { profile } from "@/content/profile";
import Loader from "@/components/Loader";

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: { default: `${profile.name} — Materials Science & Engineering`, template: `%s — ${profile.name}` },
  description: profile.oneLiner,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    siteName: profile.name,
    title: `${profile.name} — Materials Science & Engineering`,
    description: profile.oneLiner,
    firstName: "Nathan",
    lastName: "Chan",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: `${profile.name} — Materials Science & Engineering at Illinois` }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
  icons: { icon: "/icon.svg", apple: "/apple-touch-icon.png" },
};

// Runs before first paint: restores the theme choice, and decides whether to
// show the loader (home page only, once per session, never with reduced motion).
const headScript = `(function(){var d=document.documentElement;
try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')d.dataset.theme=t}catch(e){}
try{if(location.pathname==='/'&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&!sessionStorage.getItem('etched'))d.setAttribute('data-loader','')}catch(e){}})()`;

// Grain field for the loader's etch step, computed at build time.
const loaderCells = grains(1600, 1000, 150, 5);

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: headScript }} />
      </head>
      <body className="min-h-screen">
        <Loader cells={loaderCells} />
        {children}
      </body>
    </html>
  );
}
