import type { Project } from "@/content/projects";

/** "Aug 2023 – May 2024" → "2023–24", "Sept 2025 – present" → "2025–", "Fall 2026" → "2026". */
export function years(dates: string) {
  const ys = [...new Set(dates.match(/\b20\d\d\b/g) ?? [])];
  if (!ys.length) return null;
  if (/present/i.test(dates)) return `${ys[0]}–`;
  return ys.length > 1 ? `${ys[0]}–${ys[ys.length - 1].slice(2)}` : ys[0];
}

/**
 * The information strip printed along the bottom of an SEM micrograph
 * (beam voltage · magnification · working distance · scale bar), repurposed:
 * project number · source · years · scale bar.
 */
export default function DataBar({
  project,
  className = "",
}: {
  project: Pick<Project, "specimen" | "label" | "dates">;
  className?: string;
}) {
  const yr = years(project.dates);
  const field = (k: string, v: string) => (
    <span className="whitespace-nowrap">
      <span className="hidden text-white/55 sm:inline">{k} </span>{v}
    </span>
  );
  return (
    <div
      aria-hidden="true"
      className={`flex items-center gap-x-3 overflow-hidden bg-[#0d0f11]/90 px-2.5 py-1.5 font-mono text-[0.6rem] leading-none tracking-wider text-white uppercase ${className}`}
    >
      {field("No", project.specimen)}
      <span className="min-w-0 truncate">
        <span className="hidden text-white/55 sm:inline">Src </span>
        {project.label}
      </span>
      {yr && field("Yr", yr)}
      <span className="ml-auto flex shrink-0 items-center gap-1.5">
        <span className="relative inline-block h-1.5 w-8 border-x border-white">
          <span className="absolute inset-x-0 top-1/2 h-px bg-white" />
        </span>
        50 <span className="normal-case">µm</span>
      </span>
    </div>
  );
}
