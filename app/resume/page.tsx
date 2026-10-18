import type { Metadata } from "next";
import Nav from "@/components/Nav";
import SectionLabel from "@/components/SectionLabel";
import { Footer } from "@/components/Sections";
import { profile, updated } from "@/content/profile";

export const metadata: Metadata = {
  title: "Resume",
  description: `Resume — ${profile.name}, ${profile.education.degree}, ${profile.education.school}.`,
  alternates: { canonical: "/resume/" },
};

export default function Resume() {
  const btn = "px-6 py-3 text-sm font-semibold transition-colors";
  return (
    <>
      <Nav />
      <main id="main" className="mx-auto max-w-5xl px-4 pt-6 pb-24 sm:px-8">
        <SectionLabel n="00">Resume</SectionLabel>
        <h1 className="font-display mt-4 text-5xl font-semibold sm:text-6xl">Resume</h1>
        <p className="mt-3 text-ink-2">One page. Updated {updated}.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={profile.resume}
            download="Nathan-Chan-Resume.pdf"
            className={`${btn} bg-accent-fill text-accent-on hover:opacity-90`}
          >
            Download PDF ↓
          </a>
          <a
            href={profile.resume}
            target="_blank"
            rel="noopener noreferrer"
            className={`${btn} border border-line-strong hover:border-ink`}
          >
            Open in new tab ↗
          </a>
        </div>

        {/* Phones don't render embedded PDFs reliably — they get the buttons above. */}
        <object
          data={profile.resume}
          type="application/pdf"
          aria-label="Nathan Chan resume (PDF)"
          className="mt-10 hidden aspect-[8.5/11] w-full rounded-sm border border-line bg-white md:block"
        >
          <p className="p-6">
            Your browser can&apos;t show PDFs inline.{" "}
            <a href={profile.resume} className="underline">
              Download the resume
            </a>
            .
          </p>
        </object>
      </main>
      <Footer />
    </>
  );
}
