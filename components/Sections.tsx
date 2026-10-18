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

const wrap = "mx-auto max-w-7xl px-4 sm:px-8";
const h2 = "reveal font-display mt-4 text-4xl font-semibold sm:text-5xl";

export function Strip() {
  const photos = stripPhotoIds.map((id) => getPhoto(id)!);
  return (
    <section aria-labelledby="strip-title" className="py-16">
      <div className={wrap}>
        <SectionLabel n="02b">Off the clock</SectionLabel>
        <h2 id="strip-title" className={h2}>
          Outside the lab
        </h2>
      </div>
      <div className="mt-10">
        <PhotoStrip>
          {photos.map((p) => (
            <figure key={p.id} className="shrink-0 snap-start">
              <div
                className="overflow-hidden rounded-sm bg-surface [--strip-h:18rem] sm:[--strip-h:24rem]"
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
                className="specimen mt-2 text-ink-2"
                style={{ maxWidth: `min(80vw, calc(var(--strip-h) * ${(p.width / p.height).toFixed(4)}))` }}
              >
                {p.caption}
                {p.stat && <span className="mt-1 block text-accent">{p.stat}</span>}
              </figcaption>
            </figure>
          ))}
        </PhotoStrip>
      </div>
    </section>
  );
}

export function Story() {
  return (
    <section id="story" aria-labelledby="story-title" className={`${wrap} scroll-mt-8 py-16`}>
      <SectionLabel n="03">Flight log</SectionLabel>
      <h2 id="story-title" className={h2}>
        The story so far
      </h2>
      <FlightMap />
    </section>
  );
}

export function Notes() {
  return (
    <section id="notes" aria-labelledby="notes-title" className={`${wrap} scroll-mt-8 py-16`}>
      <SectionLabel n="04">Field notes</SectionLabel>
      <h2 id="notes-title" className={h2}>
        How I think, in writing
      </h2>
      <ol className="mt-8 border-t border-ink">
        {notes.map((n, i) => (
          <li key={n.slug} className="border-b border-line">
            <Link
              href={`/notes/${n.slug}/`}
              className="group grid gap-2 py-6 sm:grid-cols-[6rem_1fr_auto] sm:items-baseline sm:gap-8"
            >
              <span className="specimen text-ink-2">No. {String(i + 1).padStart(2, "0")}</span>
              <span>
                <span className="font-display block text-3xl leading-none transition-colors group-hover:text-accent">
                  {n.title}
                </span>
                <span className="mt-2 block max-w-2xl text-ink-2">{n.dek}</span>
              </span>
              <span className="specimen text-ink-2">
                {n.date} <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Toolkit() {
  return (
    <section id="toolkit" aria-labelledby="toolkit-title" className={`${wrap} scroll-mt-8 py-16`}>
      <SectionLabel n="05">Toolkit</SectionLabel>
      <h2 id="toolkit-title" className={h2}>
        What I work with
      </h2>
      <div className="mt-10 grid gap-px overflow-hidden rounded-sm border border-line bg-line md:grid-cols-3">
        {profile.toolkit.map((g) => (
          <div key={g.group} className="bg-bg p-6">
            <h3 className="specimen text-accent">{g.group}</h3>
            <ul className="mt-4 space-y-2">
              {g.items.map((t) => (
                <li key={t} className="border-b border-line pb-2 last:border-0">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Honors() {
  return (
    <section aria-labelledby="honors-title" className={`${wrap} py-16`}>
      <SectionLabel n="06">Honors</SectionLabel>
      <h2 id="honors-title" className="sr-only">
        Honors
      </h2>
      <ul className="mt-6 grid border-y border-ink sm:grid-cols-2 lg:grid-cols-4">
        {profile.honors.map((h) => (
          <li
            key={h.name}
            className="flex flex-col gap-4 border-line py-6 sm:px-5 sm:first:pl-0 sm:even:border-l lg:border-l lg:first:border-l-0"
          >
            <div className="flex h-24 w-full max-w-[12rem] items-center justify-center rounded-sm bg-[#faf9f6] p-3 ring-1 ring-line">
              {/* eslint-disable-next-line @next/next/no-img-element -- small static logo */}
              <img src={h.logo} alt={`${h.org} logo`} loading="lazy" className="h-[4.5rem] w-auto max-w-full object-contain" />
            </div>
            <div>
              <p className="font-display text-2xl leading-tight font-semibold">{h.name}</p>
              <p className="specimen mt-1 text-ink-2">{h.org}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Contact() {
  const btn =
    "border border-line-strong px-6 py-3 text-sm font-semibold transition-colors hover:border-ink";
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative scroll-mt-8 overflow-hidden">
      <Pearlite className="opacity-[0.07] [mask-image:radial-gradient(ellipse_at_80%_50%,black,transparent_70%)]" />
      <div className={`${wrap} relative py-24`}>
      <SectionLabel n="07">Contact</SectionLabel>
      <h2 id="contact-title" className="reveal font-display mt-4 max-w-4xl text-[clamp(2.75rem,8vw,6.5rem)] leading-[0.92] font-semibold">
        Got a part that broke? Let&apos;s find out why.
      </h2>
      <p className="mt-6 max-w-2xl text-lg text-ink-2">
        I&apos;m looking for internships and co-ops in materials engineering — aerospace, defense,
        semiconductors, and anyone building hardware that has to hold up. Good things start with a
        hello.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href={`mailto:${profile.email}`}
          className="bg-accent-fill px-6 py-3 text-sm font-semibold text-accent-on shadow-[4px_4px_0_var(--ink)] transition-[transform,box-shadow] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_var(--ink)]"
        >
          Say hello ↗
        </a>
        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className={btn}>
          LinkedIn ↗
        </a>
        <a href="/resume/" className={btn}>
          Resume ↗
        </a>
      </div>
      <p className="specimen mt-6 text-ink-2">{profile.email}</p>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line">
      <GrainTexture seed={41} count={90} className="opacity-[0.06]" />
      <div className={`${wrap} relative flex flex-col gap-8 py-12 md:flex-row md:items-end md:justify-between`}>
        <div>
          <Signature className="h-auto w-60 text-ink" />
          <p className="specimen mt-3 text-ink-2">
            © {new Date().getFullYear()} {profile.name} · Updated {updated}
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <a href={`mailto:${profile.email}`} className="text-ink-2 hover:text-ink">
            Email
          </a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-ink-2 hover:text-ink">
            LinkedIn
          </a>
          <a href="/resume/" className="text-ink-2 hover:text-ink">
            Resume
          </a>
          <a href="#top" className="text-ink hover:text-accent">
            Back to top ↑
          </a>
        </nav>
      </div>
    </footer>
  );
}
