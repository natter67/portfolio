/** `01 —— SELECTED WORK` — the numbered eyebrow above each section heading. */
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
      <span className="text-accent">{n}</span>
      <span aria-hidden="true" className="scalebar inline-block h-px w-8 bg-line-strong" />
      <span>{children}</span>
    </Tag>
  );
}
