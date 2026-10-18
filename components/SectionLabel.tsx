/** `SPECIMEN 03 — BORING ILLINI  |——| 50 µm` — a micrograph annotation. */
export default function SectionLabel({
  n,
  children,
  as: Tag = "p",
  id,
}: {
  n: string;
  children: React.ReactNode;
  as?: "p" | "h2";
  id?: string;
}) {
  return (
    <Tag id={id} className="specimen flex items-center gap-3 text-ink-2">
      <span>
        Specimen {n} — {children}
      </span>
      <span aria-hidden="true" className="flex items-center gap-1.5 text-ink-2">
        <span className="scalebar relative inline-block h-2 w-10 border-x border-current">
          <span className="absolute inset-x-0 top-1/2 h-px bg-current" />
        </span>
        50&nbsp;<span className="normal-case">µm</span>
      </span>
    </Tag>
  );
}
