"use client";

import { useSyncExternalStore } from "react";

type Mode = "auto" | "light" | "dark";
const NEXT: Record<Mode, Mode> = { auto: "light", light: "dark", dark: "auto" };

// The source of truth is <html data-theme>, set before paint by the head script.
function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}
const getMode = (): Mode => {
  const t = document.documentElement.dataset.theme;
  return t === "light" || t === "dark" ? t : "auto";
};

export default function ThemeToggle() {
  const mode = useSyncExternalStore(subscribe, getMode, () => "auto" as Mode);

  function cycle() {
    const next = NEXT[mode];
    const root = document.documentElement;
    if (next === "auto") delete root.dataset.theme;
    else root.dataset.theme = next;
    try {
      if (next === "auto") localStorage.removeItem("theme");
      else localStorage.setItem("theme", next);
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={cycle}
      className="specimen border border-line px-3 py-1.5 text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
      aria-label={`Theme: ${mode}. Switch to ${NEXT[mode]}.`}
    >
      Theme: {mode}
    </button>
  );
}
