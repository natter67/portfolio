import Link from "next/link";
import { bench, getPhoto } from "@/content/photos";
import Picture from "./Picture";
import SectionLabel from "./SectionLabel";

/** Micrographs from the bench, each tagged like an instrument capture. */
export default function Bench() {
  return (
    <section aria-labelledby="bench-title" className="mx-auto max-w-7xl px-4 py-16 sm:px-8">
      <SectionLabel n="02">The bench</SectionLabel>
      <h2 id="bench-title" className="reveal font-display mt-4 text-4xl sm:text-5xl">
        Under the microscope
      </h2>
      <p className="mt-3 max-w-2xl text-ink-2">
        Captures from my group&apos;s hot-stage runs in MSE 307: a transparent organic alloy that
        freezes like a metal, so you can watch dendrites and eutectic grow live.{" "}
        <Link href="/work/mse-307-solidification/" className="text-accent underline underline-offset-4">
          The full study →
        </Link>
      </p>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {bench.map((b) => {
          const p = getPhoto(b.id)!;
          return (
            <li key={b.id}>
              <figure className="group">
                <div className="aspect-[4/3] overflow-hidden bg-black">
                  <Picture
                    photo={p}
                    sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                    className="transition-transform duration-500 group-hover:scale-[1.08]"
                  />
                </div>
                <figcaption className="flex items-center justify-between gap-2 bg-[#0d0f11] px-2.5 py-1.5 font-mono text-[0.6rem] leading-none tracking-wider text-white uppercase">
                  <span className="truncate">
                    <span className="text-white/55">10× · </span>
                    {b.condition}
                  </span>
                  <span className="shrink-0 text-white/55">{b.sample}</span>
                </figcaption>
                <p className="specimen mt-2 text-ink-2">{p.caption}</p>
              </figure>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
