import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import SectionLabel from "@/components/SectionLabel";
import WorkTable from "@/components/WorkTable";
import { years } from "@/components/DataBar";
import { Contact, Footer, Notes, Skills, Story, Strip, h2, wrap } from "@/components/Sections";
import Bench from "@/components/Bench";
import Logbook from "@/components/Logbook";
import { getLogbook } from "@/lib/strava";
import { categories, publishedProjects } from "@/content/projects";
import { profile } from "@/content/profile";
import { getPhoto, heroPortraitId } from "@/content/photos";

// Only show chips for categories that have at least one published project.
const chips = categories.filter((c) => publishedProjects.some((p) => p.categories.includes(c)));

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.fullName,
  alternateName: profile.name,
  url: profile.siteUrl,
  email: `mailto:${profile.email}`,
  image: `${profile.siteUrl}/photos/${heroPortraitId}-800.webp`,
  jobTitle: "Materials Science & Engineering student",
  affiliation: { "@type": "CollegeOrUniversity", name: profile.education.school },
  sameAs: [profile.linkedin],
  knowsAbout: ["Metallography", "Failure analysis", "Materials selection", "Additive manufacturing", "SEM", "Next.js"],
};

export default async function Home() {
  const log = await getLogbook();
  // Sections are numbered in render order, so the optional logbook never leaves a gap.
  let count = 0;
  const n = () => String(++count).padStart(2, "0");
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
      <Nav />
      <main id="main" className="pb-16">
        <Hero />

        <section id="work" aria-labelledby="work-title" className={`${wrap} scroll-mt-20 py-20 sm:py-24`}>
          <SectionLabel n={n()}>Selected work</SectionLabel>
          <h2 id="work-title" className={h2}>
            Proof of work
          </h2>
          <WorkTable
            families={[...chips]}
            items={publishedProjects.map((p) => ({
              slug: p.slug,
              symbol: p.symbol,
              specimen: p.specimen,
              title: p.title,
              label: p.label,
              dates: p.dates,
              year: years(p.dates) ?? "",
              family: p.categories[0],
              families: p.categories,
              outcome: p.outcome,
              href: p.caseStudy ? `/work/${p.slug}/` : null,
              cover: getPhoto(p.cover),
            }))}
          />
          <Bench />
        </section>

        <Strip n={n()} />
        {log && <Logbook n={n()} data={log} />}
        <Story n={n()} />
        <Notes n={n()} />
        <Skills n={n()} />
        <Contact n={n()} />
      </main>
      <Footer />
    </>
  );
}
