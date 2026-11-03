import Link from "next/link";
import { bench, getPhoto } from "@/content/photos";
import Picture from "./Picture";

// Rows of three. Within a row each tile's width follows its aspect ratio, so
// every micrograph in the row is the same height and none is cropped — the
// scale bars and labels sit right in the corners.
const rows = Array.from({ length: Math.ceil(bench.length / 3) }, (_, i) => bench.slice(i * 3, i * 3 + 3));

/** Micrographs from the bench, each tagged like an instrument capture. Part of the Work section. */
export default function Bench() {
  return (
    <div className="mt-20 rounded-3xl border border-line bg-surface p-5 sm:p-8 lg:p-10">
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
        <div className="max-w-2xl">
          <h3 className="font-display text-2xl tracking-[-0.03em] sm:text-3xl">Under the microscope</h3>
          <p className="mt-3 leading-relaxed text-ink-2">
            Captures from my group&apos;s hot-stage runs in MSE 307: a transparent organic alloy that
            freezes like a metal, so you can watch dendrites and eutectic grow live.
          </p>
        </div>
        <Link href="/work/mse-307-solidification/" className="btn btn-ghost">
          The full study <span aria-hidden="true" className="arrow">→</span>
        </Link>
      </div>
      <div className="mt-8 space-y-5">
        {rows.map((row, i) => (
          <div key={i} className="flex flex-col gap-5 md:flex-row">
            {row.map((b) => {
              const p = getPhoto(b.id)!;
              return (
                <figure
                  key={b.id}
                  className="group md:[flex:var(--r)_1_0%]"
                  style={{ "--r": p.width / p.height } as React.CSSProperties}
                >
                  <div className="overflow-hidden rounded-2xl border border-line bg-black">
                    <div className="overflow-hidden" style={{ aspectRatio: `${p.width} / ${p.height}` }}>
                      <Picture
                        photo={p}
                        sizes="(min-width: 1024px) 460px, (min-width: 768px) 33vw, 100vw"
                        className="transition-transform duration-500 group-hover:scale-[1.06]"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-2 bg-surface-2 px-3 py-2 font-mono text-[0.6rem] leading-none tracking-wider text-white uppercase">
                      <span className="truncate">
                        <span className="text-accent">10× · </span>
                        {b.condition}
                      </span>
                      <span className="shrink-0 text-white/55">{b.sample}</span>
                    </div>
                  </div>
                  <figcaption className="mt-3 text-sm text-ink-2">{p.caption}</figcaption>
                </figure>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
