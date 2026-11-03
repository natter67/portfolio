import type { Logbook as Data } from "@/lib/strava";
import SectionLabel from "./SectionLabel";
import { h2, lead, wrap } from "./Sections";

/**
 * Training load drawn like a test log: twelve weekly bars of moving time,
 * plus totals by sport. Data comes from Strava at build time.
 */
export default function Logbook({ n, data }: { n: string; data: Data }) {
  const max = Math.max(1, ...data.weeks.map((w) => w.hours));
  return (
    <section aria-labelledby="log-title" className={`${wrap} pb-20 sm:pb-24`}>
      <SectionLabel n={n}>Logbook</SectionLabel>
      <h2 id="log-title" className={h2}>
        Training load
      </h2>
      <p className={lead}>
        Last 12 weeks, straight from my watch: {data.sessions} sessions, {data.hours} hours moving.
      </p>

      <div className="mt-12 grid gap-10 rounded-2xl border border-line bg-surface p-6 sm:p-8 lg:grid-cols-[1fr_20rem]">
        <figure>
          <div className="flex h-48 items-end gap-1.5 border-b border-line-strong" role="img" aria-label={`Weekly moving hours: ${data.weeks.map((w) => w.hours).join(", ")}`}>
            {data.weeks.map((w, i) => (
              <div key={w.start} className="group relative flex-1">
                <div
                  className="rounded-t-sm bg-accent-fill transition-opacity group-hover:opacity-70"
                  style={{ height: `${(w.hours / max) * 11}rem`, opacity: i === data.weeks.length - 1 ? 0.55 : 1 }}
                />
                <span className="absolute -top-6 left-1/2 hidden -translate-x-1/2 text-xs font-medium whitespace-nowrap text-ink group-hover:block">
                  {w.hours} h
                </span>
              </div>
            ))}
          </div>
          <figcaption className="mt-3 flex justify-between text-sm text-ink-2">
            <span>wk of {data.weeks[0].start}</span>
            <span>this week</span>
          </figcaption>
        </figure>

        <table className="w-full self-start text-sm">
          <caption className="sr-only">Totals by sport, last 12 weeks</caption>
          <thead className="text-ink-2">
            <tr className="border-b border-line-strong text-left">
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
      <p className="mt-6 text-sm text-ink-2">
        Updated {data.updated} ·{" "}
        <a href="https://www.strava.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
          Powered by Strava
        </a>
      </p>
    </section>
  );
}
