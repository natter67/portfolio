import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import GrainTexture from "@/components/GrainTexture";
import SteelTable from "@/components/SteelTable";
import HiamDiagram from "@/components/HiamDiagram";
import CadEmbed from "@/components/CadEmbed";
import DataBar from "@/components/DataBar";
import { Footer } from "@/components/Sections";
import Picture from "@/components/Picture";
import { getPhoto } from "@/content/photos";
import { publishedProjects } from "@/content/projects";
import { updated } from "@/content/profile";

const studies = publishedProjects.filter((p) => p.caseStudy);

export const dynamicParams = false;
export function generateStaticParams() {
  return studies.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = studies.find((s) => s.slug === slug);
  return p
    ? { title: p.title, description: p.outcome, alternates: { canonical: `/work/${p.slug}/` } }
    : {};
}

export default async function CaseStudy({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const i = studies.findIndex((s) => s.slug === slug);
  if (i < 0) notFound();
  const p = studies[i];
  const cs = p.caseStudy!;
  const cover = getPhoto(p.cover);
  const gallery = (p.gallery ?? []).map((id) => getPhoto(id)!);
  const figures = (p.figures ?? []).map((id) => getPhoto(id)!);
  const cadPoster = p.cad && getPhoto(p.cad.poster)!;
  const next = studies[(i + 1) % studies.length];

  const spec = (
    [
      ["Role", p.role],
      ["Dates", p.dates],
      ["Team", p.team],
      ["Tools", p.tools.join(" · ")],
      ["Outcome", p.outcome],
    ] as [string, React.ReactNode][]
  ).filter(([, v]) => v);
  if (p.links?.length)
    spec.push([
      "Links",
      <ul key="links" className="space-y-1">
        {p.links.map((l) => (
          <li key={l.href}>
            <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-4">
              {l.label} ↗
            </a>
          </li>
        ))}
      </ul>,
    ]);

  // Sections with nothing to say are left out rather than shown empty.
  const sections = (
    [
      ["Problem", cs.problem],
      ["Approach", cs.approach],
      ["Result", cs.result],
      ["What I'd do next", cs.next],
    ] as [string, string[]][]
  ).filter(([, paras]) => paras.length > 0);

  return (
    <>
      <Nav />
      <main id="main" className="mx-auto max-w-5xl px-4 pt-6 pb-24 sm:px-8">
        <Link href="/#work" className="specimen text-ink-2 hover:text-ink">
          ← All work
        </Link>

        <article className="mt-8">
          {/* Datasheet header strip */}
          <div className="specimen flex flex-wrap justify-between gap-2 border-y border-ink py-2">
            <span>Materials datasheet</span>
            <span>
              Specimen {p.specimen} — {p.label}
            </span>
            <span className="text-ink-2">Rev. {updated}</span>
          </div>

          <h1 className="font-display mt-8 text-[clamp(2.5rem,7vw,5rem)] leading-[0.95] font-semibold">
            {p.title}
          </h1>
          <p className="mt-3 text-lg text-ink-2">
            {p.org}
            {p.location && ` · ${p.location}`}
          </p>

          <dl className="mt-10 border-t border-line-strong">
            {spec.map(([k, v]) => (
              <div
                key={k}
                className="grid gap-1 border-b border-line py-3 sm:grid-cols-[10rem_1fr] sm:gap-6"
              >
                <dt className="specimen pt-0.5 text-ink-2">{k}</dt>
                <dd className={k === "Outcome" ? "font-medium" : ""}>{v}</dd>
              </div>
            ))}
          </dl>

          {p.confidential && (
            <p className="specimen mt-4 text-ink-2">
              Customer parts and findings are confidential — this page covers methods only.
            </p>
          )}

          <figure className="mt-12">
            <div
              className="relative overflow-hidden rounded-sm border border-line bg-surface"
              style={{
                aspectRatio: cover ? `${Math.max(cover.width / cover.height, 4 / 3)}` : "16 / 9",
              }}
            >
              {cover ? (
                <Picture photo={cover} sizes="(min-width: 1024px) 960px, 100vw" priority />
              ) : (
                <GrainTexture seed={Number(p.specimen) * 17} count={90} className="opacity-30" />
              )}
              <DataBar project={p} className="absolute inset-x-0 bottom-0 text-[0.7rem]" />
            </div>
            {cover?.caption && (
              <figcaption className="specimen mt-3 text-ink-2">Fig. 1 — {cover.caption}</figcaption>
            )}
          </figure>

          {sections.map(([title, paras], n) => (
            <section
              key={title}
              className="mt-14 grid gap-4 sm:grid-cols-[10rem_1fr] sm:gap-6"
              aria-labelledby={`s-${n}`}
            >
              <p className="specimen pt-2 text-accent">{String(n + 1).padStart(2, "0")}</p>
              <div className="min-w-0">
                <h2 id={`s-${n}`} className="font-display text-3xl font-semibold">
                  {title}
                </h2>
                <div className="mt-4 space-y-4 text-lg leading-relaxed">
                  {paras.map((t, k) => (
                    <p key={k}>{t}</p>
                  ))}
                </div>
                {title === "Approach" && p.slug === "boring-illini-cutterhead-steel" && (
                  <SteelTable />
                )}
                {title === "Approach" && p.slug === "caltech-hiam-electrodes" && <HiamDiagram />}
                {title === "Approach" && p.cad && cadPoster && (
                  <CadEmbed embed={p.cad.embed} share={p.cad.share} title={cadPoster.caption ?? "CAD model"}>
                    <Picture photo={cadPoster} sizes="(min-width: 1024px) 760px, 100vw" />
                  </CadEmbed>
                )}
                {title === "Approach" &&
                  figures.map((f) => (
                    <figure key={f.id} className="mt-8">
                      <div
                        className="overflow-hidden rounded-sm border border-line"
                        style={{ aspectRatio: `${f.width} / ${f.height}` }}
                      >
                        <Picture photo={f} sizes="(min-width: 1024px) 760px, 100vw" />
                      </div>
                      <figcaption className="specimen mt-3 leading-relaxed text-ink-2">{f.caption}</figcaption>
                    </figure>
                  ))}
              </div>
            </section>
          ))}
          {gallery.length > 0 && (
            <section
              aria-label="More figures"
              className={`mt-16 gap-4 sm:columns-2 ${gallery.length >= 3 ? "lg:columns-3" : ""}`}
            >
              {gallery.map((g, k) => (
                <figure key={g.id} className="mb-6 break-inside-avoid">
                  <div
                    className="overflow-hidden rounded-sm border border-line bg-surface"
                    style={{ aspectRatio: `${g.width} / ${g.height}` }}
                  >
                    <Picture photo={g} sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw" />
                  </div>
                  <figcaption className="specimen mt-2 text-ink-2">
                    Fig. {k + 2} — {g.caption}
                  </figcaption>
                </figure>
              ))}
            </section>
          )}
        </article>

        <Link
          href={`/work/${next.slug}/`}
          className="group mt-24 block border-t border-ink pt-6"
        >
          <span className="specimen text-ink-2">Next specimen →</span>
          <span className="font-display mt-2 block text-3xl font-semibold group-hover:text-accent">
            {next.title}
          </span>
        </Link>
      </main>
      <Footer />
    </>
  );
}
