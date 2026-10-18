import { steelCriteria, steelTradeStudy } from "@/content/projects";

/** Seven candidate steels, with the values the team actually compared. */
export default function SteelTable() {
  return (
    <figure className="mt-8">
      <div className="overflow-x-auto rounded-sm border border-line">
        <table className="w-full min-w-[46rem] text-left text-sm">
          <caption className="sr-only">
            Candidate cutterhead blade steels compared on hardness, strength, machinability, and
            heat-treat stability
          </caption>
          <thead className="specimen bg-surface text-ink-2">
            <tr>
              <th scope="col" className="px-4 py-3 font-normal">Steel</th>
              {steelCriteria.map((c) => (
                <th key={c} scope="col" className="px-4 py-3 font-normal">{c}</th>
              ))}
              <th scope="col" className="px-4 py-3 font-normal">Verdict</th>
            </tr>
          </thead>
          <tbody>
            {steelTradeStudy.map((s) => (
              <tr
                key={s.steel}
                className={`border-t border-line ${s.selected ? "bg-accent-fill/10" : ""}`}
              >
                <th scope="row" className="px-4 py-3 align-top font-mono font-medium whitespace-nowrap">
                  {s.steel}
                  <span className="block font-sans text-xs font-normal text-ink-2">{s.family}</span>
                </th>
                {s.values.map((v, k) => (
                  <td key={k} className="px-4 py-3 align-top">{v}</td>
                ))}
                <td
                  className={`px-4 py-3 align-top ${s.selected ? "font-semibold text-accent" : "text-ink-2"}`}
                >
                  {s.verdict}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <figcaption className="specimen mt-3 text-ink-2">
        Table 1 — Values as compiled in the team&apos;s trade-study sheet, from the Online Metals
        product guide.
      </figcaption>
    </figure>
  );
}
