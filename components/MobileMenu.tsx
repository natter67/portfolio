"use client";

import { useEffect, useState } from "react";

/** The nav links on small screens: a menu button and a sheet that drops down under the bar. */
export default function MobileMenu({ links }: { links: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(!open)}
        className="grid h-9 w-9 place-items-center rounded-full border border-line-strong text-ink transition-colors hover:border-ink-2"
      >
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          {open ? <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" /> : <path d="M2.5 5.5h11M2.5 10.5h11" />}
        </svg>
      </button>
      <div id="mobile-menu" hidden={!open} className="absolute inset-x-0 top-full border-b border-line bg-bg shadow-[0_24px_48px_-24px_rgb(0_0_0/0.8)]">
        <ul className="px-5 py-2">
          {links.map((l) => (
            <li key={l.href} className="border-b border-line last:border-b-0">
              <a href={l.href} onClick={() => setOpen(false)} className="flex items-center justify-between py-4 text-lg">
                {l.label}
                <span aria-hidden="true" className="text-ink-2">→</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
