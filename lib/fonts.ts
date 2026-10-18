import { Big_Shoulders, Funnel_Sans, Martian_Mono } from "next/font/google";

// Big Shoulders (headings) — drawn for Chicago from its industrial signage —
// + Funnel Sans (text) + Martian Mono (specimen labels, datasheets).
export const displayA = Big_Shoulders({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--fa-display",
  display: "swap",
});
export const textA = Funnel_Sans({ subsets: ["latin"], variable: "--fa-text", display: "swap" });
// Preloaded: swapping it in late reflows the spec tables.
export const monoA = Martian_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--fa-mono",
  display: "swap",
});

export const fontVariables = [displayA, textA, monoA].map((f) => f.variable).join(" ");
