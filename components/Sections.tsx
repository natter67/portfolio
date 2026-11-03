import { profile, updated } from "@/content/profile";
import { getPhoto, stripPhotoIds } from "@/content/photos";
import GrainTexture from "./GrainTexture";
import { Pearlite } from "./Microstructure";
import Picture from "./Picture";
import PhotoStrip from "./PhotoStrip";
import SectionLabel from "./SectionLabel";
import Signature from "./Signature";
import FlightMap from "./FlightMap";
import Link from "next/link";
import { notes } from "@/content/notes";

// Shared section styles for the home page.
export const wrap = "mx-auto max-w-7xl px-5 sm:px-8";
export const h2 = "reveal font-display mt-5 text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.02] tracking-[-0.035em]";
export const lead = "mt-5 max-w-2xl text-lg leading-relaxed text-ink-2";
/** A raised, rounded band that sets a section apart from the midnight page. */
const panel = "mx-2 rounded-[2rem] border border-line bg-surface sm:mx-4";

export function Strip({ n }: { n: string }) {
  const photos = stripPhotoIds.map((id) => getPhoto(id)!);
  return (
    <section aria-labelledby="strip-title" className="py-20 sm:py-24">
      <div className={wrap}>
        <SectionLabel n={n}>Off the clock</SectionLabel>
        <h2 id="strip-title" className={h2}>
          Outside the lab
        </h2>
      </div>
      <div className="mt-10">
        <PhotoStrip>
          {photos.map((p) => (
            <figure key={p.id} className="shrink-0 snap-start">
              <div
                className="overflow-hidden rounded-2xl bg-surface [--strip-h:18rem] sm:[--strip-h:24rem]"
                style={{
                  aspectRatio: `${p.width} / ${p.height}`,
                  width: `min(80vw, calc(var(--strip-h) * ${(p.width / p.height).toFixed(4)}))`,
                }}
              >
                <Picture
                  photo={p}
                  // Tiles are a fixed height (h-72 → 288px, sm:h-96 → 384px), so width follows the aspect ratio.
                  sizes={`(min-width: 640px) ${Math.round((384 * p.width) / p.height)}px, ${Math.round((288 * p.width) / p.height)}px`}
                  className="pointer-events-none select-none"
                />
              </div>
              <figcaption
                className="mt-3 text-sm text-ink-2"
                style={{ maxWidth: `min(80vw, calc(var(--strip-h) * ${(p.width / p.height).toFixed(4)}))` }}
              >
                {p.caption}
                {p.stat && <span className="mt-0.5 block text-melon">{p.stat}</span>}
              </figcaption>
            </figure>
          ))}
        </PhotoStrip>
      </div>
    </section>
  );
}

export function Story({ n }: { n: string }) {
  return (
    <section id="story" aria-labelledby="story-title" className={`${panel} scroll-mt-20`}>
      <div className={`${wrap} py-20 sm:py-24`}>
        <SectionLabel n={n}>Timeline</SectionLabel>
        <h2 id="story-title" className={h2}>
          The story so far
        </h2>
        <FlightMap />
      </div>
    </section>
  );
}

export function Notes({ n }: { n: string }) {
  return (
    <section id="notes" aria-labelledby="notes-title" className={`${wrap} scroll-mt-20 py-20 sm:py-24`}>
      <SectionLabel n={n}>Field notes</SectionLabel>
      <h2 id="notes-title" className={h2}>
        How I think, in writing
      </h2>
      <ol className="mt-12 border-t border-line">
        {notes.map((note, i) => (
          <li key={note.slug} className="border-b border-line">
            <Link
              href={`/notes/${note.slug}/`}
              className="group grid gap-3 py-8 sm:grid-cols-[6rem_1fr_auto] sm:items-center sm:gap-8"
            >
              <span className="font-mono text-sm text-accent">{String(i + 1).padStart(2, "0")}</span>
              <span>
                <span className="font-display block text-2xl leading-tight transition-colors group-hover:text-accent sm:text-3xl">
                  {note.title}
                </span>
                <span className="mt-2 block max-w-2xl leading-relaxed text-ink-2">{note.dek}</span>
              </span>
              <span className="flex items-center gap-4 text-sm text-ink-2">
                {note.date}
                <span
                  aria-hidden="true"
                  className="grid h-10 w-10 place-items-center rounded-full border border-line-strong text-base text-ink transition-colors group-hover:border-accent-fill group-hover:bg-accent-fill group-hover:text-white"
                >
                  →
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Skills({ n }: { n: string }) {
  return (
    <section id="skills" aria-labelledby="skills-title" className={`${wrap} scroll-mt-20 pt-4 pb-20 sm:pb-24`}>
      <SectionLabel n={n}>Skills &amp; honors</SectionLabel>
      <h2 id="skills-title" className={h2}>
        What I work with
      </h2>
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {profile.toolkit.map((g) => (
          <div key={g.group} className="rounded-2xl border border-line bg-surface p-6 sm:p-7">
            <h3 className="font-display text-xl">{g.group}</h3>
            <ul className="mt-5 flex flex-wrap gap-2">
              {g.items.map((t) => (
                <li key={t} className="rounded-2xl border border-line-strong bg-surface-2 px-3 py-1.5 text-sm [text-wrap:balance]">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <h3 className="font-display mt-14 text-xl">Honors</h3>
      <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {profile.honors.map((h) => (
          <li key={h.name} className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-4">
            {/* Logos keep their own marks and colors, so they sit on small soft tiles. */}
            <div className="h-14 w-[4.5rem] shrink-0 rounded-xl bg-[#e6e9ef] p-2">
              {/* eslint-disable-next-line @next/next/no-img-element -- small static logo */}
              <img
                src={h.logo}
                alt={`${h.org} logo`}
                loading="lazy"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <p className="font-display leading-snug">{h.name}</p>
              <p className="mt-0.5 text-sm text-ink-2">{h.org}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Contact({ n }: { n: string }) {
  return (
    <section id="contact" aria-labelledby="contact-title" className="scroll-mt-20 px-2 sm:px-4">
      {/* Electric blue panel: tokens are re-pointed so labels and outlines read white on blue. */}
      <div className="relative overflow-hidden rounded-[2rem] bg-accent-fill text-white [--accent:#fff] [--grain:#fff] [--ink-2:rgb(255_255_255/0.8)] [--line-strong:rgb(255_255_255/0.4)]">
        <Pearlite className="opacity-[0.14] [mask-image:radial-gradient(ellipse_at_85%_45%,black,transparent_70%)]" />
        <div className={`${wrap} relative grid gap-14 py-20 sm:py-24 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16`}>
          <div>
            <SectionLabel n={n}>Contact</SectionLabel>
            <h2
              id="contact-title"
              className="reveal font-display mt-6 text-[clamp(2.75rem,6vw,5.25rem)] leading-[0.98] tracking-[-0.045em]"
            >
              Got a part that broke? <span className="text-white/60">Let&apos;s find out why.</span>
            </h2>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/85">
              I&apos;m looking for internships and co-ops in materials engineering — aerospace, defense,
              semiconductors, and anyone building hardware that has to hold up. Good things start with a
              hello.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href={`mailto:${profile.email}`} className="btn bg-bg text-ink hover:bg-surface-2">
                Say hello ↗
              </a>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                LinkedIn ↗
              </a>
              <a href="/resume/" className="btn btn-ghost">
                Resume ↗
              </a>
            </div>
            <p className="mt-8 text-sm text-white/80">{profile.email}</p>
          </div>

          <div className="self-end rounded-2xl border border-white/25 bg-white/[0.07] p-6 backdrop-blur-sm">
            <h3 className="text-sm text-white/80">Looking for</h3>
            <p className="font-display mt-1.5 text-2xl">{profile.lookingFor.seeking}</p>
            <h3 className="mt-6 text-sm text-white/80">In</h3>
            <ul className="mt-2 flex flex-wrap gap-2">
              {profile.lookingFor.industries.map((x) => (
                <li key={x} className="rounded-full border border-white/30 px-3 py-1 text-sm">
                  {x}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line">
      <GrainTexture seed={41} count={90} className="opacity-[0.05]" />
      <div className={`${wrap} relative flex flex-col gap-8 py-12 md:flex-row md:items-end md:justify-between`}>
        <div>
          <Signature className="h-auto w-56 text-ink" />
          <p className="mt-4 text-sm text-ink-2">
            © {new Date().getFullYear()} {profile.name} · Updated {updated}
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <a href={`mailto:${profile.email}`} className="text-ink-2 transition-colors hover:text-ink">
            Email
          </a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-ink-2 transition-colors hover:text-ink">
            LinkedIn
          </a>
          <a href="/resume/" className="text-ink-2 transition-colors hover:text-ink">
            Resume
          </a>
          <a href="#top" className="text-ink transition-colors hover:text-accent">
            Back to top ↑
          </a>
        </nav>
      </div>
    </footer>
  );
}
