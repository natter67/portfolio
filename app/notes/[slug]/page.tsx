import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Picture from "@/components/Picture";
import { Footer } from "@/components/Sections";
import { notes } from "@/content/notes";
import { getPhoto } from "@/content/photos";

export const dynamicParams = false;
export function generateStaticParams() {
  return notes.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: PageProps<"/notes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const n = notes.find((x) => x.slug === slug);
  return n ? { title: n.title, description: n.dek, alternates: { canonical: `/notes/${n.slug}/` } } : {};
}

export default async function NotePage({ params }: PageProps<"/notes/[slug]">) {
  const { slug } = await params;
  const i = notes.findIndex((x) => x.slug === slug);
  if (i < 0) notFound();
  const n = notes[i];
  const next = notes[(i + 1) % notes.length];

  return (
    <>
      <Nav />
      <main id="main" className="mx-auto max-w-3xl px-5 pt-10 pb-24 sm:px-8">
        <Link href="/#notes" className="inline-flex items-center gap-2 rounded-full border border-line-strong px-3.5 py-1.5 text-sm text-ink-2 transition-colors hover:border-ink-2 hover:text-ink">
          ← Field notes
        </Link>
        <article className="mt-8">
          <div className="specimen flex justify-between border-y border-line-strong py-3 text-ink-2">
            <span className="text-accent">Field note {String(i + 1).padStart(2, "0")}</span>
            <span>{n.date}</span>
          </div>
          <h1 className="font-display mt-10 text-[clamp(2.5rem,6.5vw,4.25rem)] leading-[1.02] tracking-[-0.04em]">{n.title}</h1>
          <p className="mt-5 text-xl leading-relaxed text-ink-2">{n.dek}</p>
          <div className="mt-10 space-y-5 text-lg leading-relaxed text-ink/90">
            {n.body.map((b, k) => {
              if (typeof b === "string") return <p key={k}>{b}</p>;
              const photo = getPhoto(b.figure)!;
              return (
                <figure key={k} className="py-2">
                  <div className="overflow-hidden rounded-2xl border border-line bg-black" style={{ aspectRatio: `${photo.width} / ${photo.height}` }}>
                    <Picture photo={photo} sizes="(min-width: 768px) 700px, 100vw" />
                  </div>
                  <figcaption className="mt-3 text-sm text-ink-2">{b.caption}</figcaption>
                </figure>
              );
            })}
          </div>
          {n.related && (
            <p className="mt-10">
              <a
                href={n.related.href}
                {...(n.related.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="btn btn-ghost"
              >
                {n.related.label} →
              </a>
            </p>
          )}
        </article>
        {notes.length > 1 && (
          <Link href={`/notes/${next.slug}/`} className="group mt-20 block rounded-3xl border border-line bg-surface p-7 transition-colors hover:border-accent-fill sm:p-9">
            <span className="text-sm font-medium text-accent">Next note →</span>
            <span className="font-display mt-3 block text-2xl leading-tight transition-colors group-hover:text-accent sm:text-3xl">{next.title}</span>
          </Link>
        )}
      </main>
      <Footer />
    </>
  );
}
