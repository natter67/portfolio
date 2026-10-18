import type { Logbook as Data } from "@/lib/strava";
import SectionLabel from "./SectionLabel";

/**
 * Training load drawn like a test log: twelve weekly bars of moving time,
 * plus totals by sport. Data comes from Strava at build time.
 */
export default function Logbook({ data }: { data: Data }) {
  const max = Math.max(1, ...data.weeks.map((w) => w.hours));
  return (
    <section aria-labelledby="log-title" className="mx-auto max-w-7xl px-4 py-16 sm:px-8">
      <SectionLabel n="02c">Logbook</SectionLabel>
      <h2 id="log-title" className="reveal font-display mt-4 text-4xl sm:text-5xl">
        Training load
      </h2>
      <p className="mt-3 max-w-xl text-ink-2">
        Last 12 weeks, straight from my watch: {data.sessions} sessions, {data.hours} hours moving.
      </p>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_20rem]">
        <figure>
          <div className="flex h-48 items-end gap-1.5 border-b border-ink" role="img" aria-label={`Weekly moving hours: ${data.weeks.map((w) => w.hours).join(", ")}`}>
            {data.weeks.map((w, i) => (
              <div key={w.start} className="group relative flex-1">
                <div
                  className="bg-accent-fill transition-opacity group-hover:opacity-70"
                  style={{ height: `${(w.hours / max) * 11}rem`, opacity: i === data.weeks.length - 1 ? 0.55 : 1 }}
                />
                <span className="specimen absolute -top-5 left-1/2 hidden -translate-x-1/2 whitespace-nowrap text-ink group-hover:block">
                  {w.hours} h
                </span>
              </div>
            ))}
          </div>
          <figcaption className="specimen mt-2 flex justify-between text-ink-2">
            <span>wk of {data.weeks[0].start}</span>
            <span>this week</span>
          </figcaption>
        </figure>

        <table className="w-full self-start text-sm">
          <caption className="sr-only">Totals by sport, last 12 weeks</caption>
          <thead className="specimen text-ink-2">
            <tr className="border-b border-ink text-left">
              <th scope="col" className="py-2 font-normal">Sport</th>
              <th scope="col" className="py-2 text-right font-normal">n</th>
              <th scope="col" className="py-2 text-right font-normal">km</th>
              <th scope="col" className="py-2 text-right font-normal">h</th>
            </tr>
          </thead>
          <tbody className="font-mono">
            {data.totals.map((t) => (
              <tr key={t.sport} className="border-b border-line">
                <th scope="row" className="py-2 text-left font-normal">{t.sport}</th>
                <td className="py-2 text-right">{t.count}</td>
                <td className="py-2 text-right">{t.km || "—"}</td>
                <td className="py-2 text-right">{t.hours}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="specimen mt-6 text-ink-2">
        Updated {data.updated} ·{" "}
        <a href="https://www.strava.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
          Powered by Strava
        </a>
      </p>
    </section>
  );
}
