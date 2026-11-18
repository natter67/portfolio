import Link from "next/link";
import { profile } from "@/content/profile";
import MobileMenu from "./MobileMenu";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/#story", label: "Story" },
  { href: "/#skills", label: "Skills" },
  { href: "/#contact", label: "Contact" },
];

export default function Nav() {
  return (
    <header
      id="top"
      className="sticky top-0 z-50 border-b border-line/70 bg-bg/75 backdrop-blur-xl backdrop-saturate-150"
    >
      <a
        href="#main"
        className="specimen sr-only rounded bg-ink px-3 py-2 text-bg focus:not-sr-only focus:absolute focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8"
      >
        <Link href="/" aria-label={`${profile.name} — home`} className="group flex items-center gap-3">
          <span className="font-wordmark text-2xl leading-none">
            N<span className="text-melon">.</span>C
          </span>
          <span className="hidden h-4 w-px bg-line-strong sm:block" />
          <span className="hidden text-sm text-ink-2 transition-colors group-hover:text-ink sm:block">
            {profile.name}
          </span>
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          <ul className="hidden items-center md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="rounded-full px-3.5 py-2 text-sm text-ink-2 transition-colors hover:bg-ink/5 hover:text-ink"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <Link
            href="/resume/"
            className="ml-2 rounded-full bg-ink px-4 py-2 text-sm font-medium text-bg transition-colors hover:bg-ink/85"
          >
            Resume
          </Link>
          <MobileMenu links={links} />
        </div>
      </nav>
      <span aria-hidden="true" className="scroll-progress absolute inset-x-0 -bottom-px h-px bg-accent-fill" />
    </header>
  );
}
