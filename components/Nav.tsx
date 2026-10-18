import Link from "next/link";
import { profile } from "@/content/profile";
import ThemeToggle from "./ThemeToggle";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/#story", label: "Story" },
  { href: "/#notes", label: "Notes" },
  { href: "/#toolkit", label: "Toolkit" },
  { href: "/#contact", label: "Contact" },
];

export default function Nav() {
  return (
    <header id="top" className="relative z-10">
      <a
        href="#main"
        className="specimen sr-only rounded bg-ink px-3 py-2 text-bg focus:not-sr-only focus:absolute focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-8"
      >
        <Link href="/" className="font-display text-xl font-semibold tracking-tight">
          N<span className="text-accent">.</span>C
          <span className="sr-only">{profile.name} — home</span>
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          <ul className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="rounded px-3 py-2 text-sm text-ink-2 transition-colors hover:text-ink"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <Link
            href="/resume/"
            className="rounded px-3 py-2 text-sm font-medium text-ink transition-colors hover:text-accent"
          >
            Resume ↗
          </Link>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
