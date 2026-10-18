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
      <main id="main" className="mx-auto max-w-3xl px-4 pt-6 pb-24 sm:px-8">
        <Link href="/#notes" className="specimen text-ink-2 hover:text-ink">
          ← Field notes
        </Link>
        <article className="mt-8">
          <div className="specimen flex justify-between border-y border-ink py-2">
            <span>Field note {String(i + 1).padStart(2, "0")}</span>
            <span className="text-ink-2">{n.date}</span>
          </div>
          <h1 className="font-display mt-8 text-[clamp(2.5rem,7vw,4.5rem)] leading-[0.92]">{n.title}</h1>
          <p className="mt-4 text-xl text-ink-2">{n.dek}</p>
          <div className="mt-10 space-y-5 text-lg leading-relaxed">
            {n.body.map((b, k) => {
              if (typeof b === "string") return <p key={k}>{b}</p>;
              const photo = getPhoto(b.figure)!;
              return (
                <figure key={k} className="py-2">
                  <div className="overflow-hidden bg-black" style={{ aspectRatio: `${photo.width} / ${photo.height}` }}>
                    <Picture photo={photo} sizes="(min-width: 768px) 700px, 100vw" />
                  </div>
                  <figcaption className="specimen mt-2 text-ink-2">{b.caption}</figcaption>
                </figure>
              );
            })}
          </div>
          {n.related && (
            <p className="mt-10">
              <a
                href={n.related.href}
                {...(n.related.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="specimen border-b border-accent pb-0.5 text-accent"
              >
                {n.related.label} →
              </a>
            </p>
          )}
        </article>
        {notes.length > 1 && (
          <Link href={`/notes/${next.slug}/`} className="group mt-20 block border-t border-ink pt-6">
            <span className="specimen text-ink-2">Next note →</span>
            <span className="font-display mt-2 block text-3xl group-hover:text-accent">{next.title}</span>
          </Link>
        )}
      </main>
      <Footer />
    </>
  );
}
