import type { MetadataRoute } from "next";
import { profile } from "@/content/profile";
import { publishedProjects } from "@/content/projects";
import { notes } from "@/content/notes";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${profile.siteUrl}${path}`;
  return [
    { url: url("/"), priority: 1 },
    { url: url("/resume/"), priority: 0.8 },
    ...publishedProjects
      .filter((p) => p.caseStudy)
      .map((p) => ({ url: url(`/work/${p.slug}/`), priority: 0.7 })),
    ...notes.map((n) => ({ url: url(`/notes/${n.slug}/`), priority: 0.6 })),
  ];
}
