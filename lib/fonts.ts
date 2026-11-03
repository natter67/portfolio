import { Big_Shoulders, Funnel_Sans, Martian_Mono, Schibsted_Grotesk } from "next/font/google";

// Big Shoulders (the name, as a wordmark — and the loader) — drawn for Chicago
// from its industrial signage — + Schibsted Grotesk (headings) + Funnel Sans
// (text) + Martian Mono (labels, datasheets).
export const displayA = Big_Shoulders({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--fa-display",
  display: "swap",
});
export const headingA = Schibsted_Grotesk({ subsets: ["latin"], variable: "--fa-heading", display: "swap" });
export const textA = Funnel_Sans({ subsets: ["latin"], variable: "--fa-text", display: "swap" });
// Preloaded: swapping it in late reflows the spec tables.
export const monoA = Martian_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--fa-mono",
  display: "swap",
});

export const fontVariables = [displayA, headingA, textA, monoA].map((f) => f.variable).join(" ");
