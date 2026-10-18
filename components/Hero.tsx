import { profile } from "@/content/profile";
import { getPhoto, heroPortraitId } from "@/content/photos";
import Picture from "./Picture";
import MicroscopeField from "./MicroscopeField";
import { GrainGrowth } from "./Microstructure";
import Signature from "./Signature";

export default function Hero() {
  const portrait = getPhoto(heroPortraitId)!;
  const sizes = "(min-width: 768px) 33vw, 100vw";
  return (
    <section aria-labelledby="hero-name" className="relative overflow-hidden">
      <MicroscopeField>
      <GrainGrowth />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pt-10 pb-20 sm:px-8 md:grid-cols-12 md:pt-16 md:pb-28">
        <div className="md:col-span-8">
          <p className="specimen text-ink-2">{profile.meta.join(" · ")}</p>

          <h1
            id="hero-name"
            className="font-display mt-6 text-[clamp(6rem,26vw,15rem)] leading-[0.8] font-semibold"
          >
            Nathan
            <br />
            <span className="ml-[0.6em]">Chan</span>
          </h1>

          <Signature className="mt-5 ml-[8%] h-auto w-72 text-ink sm:w-[26rem]" />

          <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink sm:text-xl">
            {profile.oneLiner}
          </p>

          <p className="specimen mt-5 flex items-start gap-2 text-ink-2">
            <span aria-hidden="true" className="now-dot mt-1 inline-block h-2 w-2 shrink-0 bg-accent-fill" />
            <span>
              <span className="text-ink">Now · {profile.now.month}</span> — {profile.now.text}
            </span>
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#work"
              className="bg-accent-fill px-6 py-3 text-sm font-semibold text-accent-on shadow-[4px_4px_0_var(--ink)] transition-[transform,box-shadow] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_var(--ink)]"
            >
              View work
            </a>
            <a
              href="/resume/"
              className="border border-line-strong px-6 py-3 text-sm font-semibold transition-colors hover:border-ink"
            >
              Resume ↗
            </a>
          </div>
        </div>

        <figure className="md:col-span-4 md:self-end">
          <div
            className="relative overflow-hidden rounded-sm border border-line bg-surface"
            style={{ aspectRatio: `${portrait.width} / ${portrait.height}` }}
          >
            <Picture photo={portrait} sizes={sizes} priority />
            <Crosshairs />
          </div>
          <figcaption className="specimen mt-3 flex justify-between text-ink-2">
            <span>Fig. 1 — N. Chan</span>
            <span>{portrait.caption}</span>
          </figcaption>
        </figure>
      </div>
      </MicroscopeField>
    </section>
  );
}

function Crosshairs() {
  const c = "absolute h-4 w-4 border-white/80";
  return (
    <div aria-hidden="true">
      <span className={`${c} top-3 left-3 border-t border-l`} />
      <span className={`${c} top-3 right-3 border-t border-r`} />
      <span className={`${c} bottom-3 left-3 border-b border-l`} />
      <span className={`${c} right-3 bottom-3 border-r border-b`} />
    </div>
  );
}
