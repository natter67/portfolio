/** The HIAM process chain, one stage per step. Icons are drawn inline. */

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const STEPS: { title: string; detail: string; becomes: string; icon: React.ReactNode }[] = [
  {
    title: "Design",
    detail: "Lattice electrode in nTopology",
    becomes: "CAD lattice",
    icon: (
      <g {...stroke}>
        <path d="M8 12l8-4 8 4v10l-8 4-8-4z" />
        <path d="M8 12l8 4 8-4M16 16v10M12 10v10M20 10v10" opacity=".6" />
      </g>
    ),
  },
  {
    title: "Print",
    detail: "DLP vat photopolymerization",
    becomes: "Organogel",
    icon: (
      <g {...stroke}>
        <path d="M7 22h18l-2 4H9z" />
        <path d="M16 5v8M12 7l4 6 4-6" opacity=".6" />
        <path d="M11 22v-5h10v5" />
      </g>
    ),
  },
  {
    title: "Solvent exchange",
    detail: "Organic solvent swapped for water",
    becomes: "Hydrogel",
    icon: (
      <g {...stroke}>
        <path d="M11 6h10M13 6v6l-5 12a2 2 0 002 3h12a2 2 0 002-3l-5-12V6" />
        <path d="M10 20h12" opacity=".6" />
      </g>
    ),
  },
  {
    title: "Infuse",
    detail: "Aqueous metal-salt solution",
    becomes: "Metal-laden gel",
    icon: (
      <g {...stroke}>
        <path d="M16 5c4 6 7 10 7 14a7 7 0 01-14 0c0-4 3-8 7-14z" />
        <text x="16" y="22" textAnchor="middle" fontSize="7" fill="currentColor" stroke="none">
          M⁺
        </text>
      </g>
    ),
  },
  {
    title: "Calcine",
    detail: "Polymer burned out at high temperature",
    becomes: "Metal oxide",
    icon: (
      <g {...stroke}>
        <path d="M16 26c-5 0-8-3-8-7 0-5 5-7 5-12 3 2 4 5 4 7 1-1 2-3 2-4 3 2 5 5 5 9 0 4-3 7-8 7z" />
      </g>
    ),
  },
  {
    title: "Reduce",
    detail: "Forming-gas (H₂) anneal",
    becomes: "Metal or alloy — Cu, CuNi, HEA",
    icon: (
      <g {...stroke}>
        <circle cx="12" cy="16" r="4" />
        <circle cx="20" cy="16" r="4" />
        <text x="16" y="28" textAnchor="middle" fontSize="6" fill="currentColor" stroke="none">
          H₂
        </text>
      </g>
    ),
  },
];

export default function HiamDiagram() {
  return (
    <figure className="mt-8">
      <ol className="grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {STEPS.map((s, i) => (
          <li key={s.title} className="flex gap-3 bg-bg p-4 break-words">
            <svg viewBox="0 0 32 32" className="h-9 w-9 shrink-0 text-accent" aria-hidden="true">
              {s.icon}
            </svg>
            <div>
              <p className="specimen text-ink-2">Step {String(i + 1).padStart(2, "0")}</p>
              <p className="font-display mt-1 text-lg leading-tight font-semibold">{s.title}</p>
              <p className="mt-1 text-sm text-ink-2">{s.detail}</p>
              <p className="specimen mt-2 text-accent">→ {s.becomes}</p>
            </div>
          </li>
        ))}
      </ol>
      <figcaption className="specimen mt-3 text-ink-2">
        Fig. — Hydrogel infusion additive manufacturing (HIAM): the metal goes in after printing.
      </figcaption>
    </figure>
  );
}
