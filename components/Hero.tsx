import { profile } from "@/content/profile";
import { getPhoto, heroPortraitId } from "@/content/photos";
import Picture from "./Picture";
import MicroscopeField from "./MicroscopeField";
import { GrainGrowth } from "./Microstructure";

export default function Hero() {
  const portrait = getPhoto(heroPortraitId)!;
  const sizes = "(min-width: 768px) 33vw, 100vw";
  return (
    <section aria-labelledby="hero-name" className="relative overflow-hidden">
      <MicroscopeField>
      <GrainGrowth />
      {/* A single wash of electric blue behind the portrait, fading to midnight. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_55%_at_80%_25%,rgb(42_99_255/0.14),transparent_70%)]"
      />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 pt-12 pb-16 sm:px-8 md:grid-cols-12 md:pt-20 md:pb-24">
        <div className="md:col-span-8">
          <p className="text-sm text-ink-2">{profile.meta.join(" · ")}</p>

          <h1
            id="hero-name"
            className="font-wordmark mt-6 text-[clamp(5.5rem,24vw,14rem)] leading-[0.8]"
          >
            Nathan
            <br />
            <span className="ml-[0.6em] text-accent-fill">Chan</span>
          </h1>

          <p className="mt-10 max-w-xl text-lg leading-relaxed text-ink sm:text-xl">
            {profile.oneLiner}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#work" className="btn btn-primary">
              View work <span aria-hidden="true" className="arrow">→</span>
            </a>
            <a href="/resume/" className="btn btn-ghost">
              Resume ↗
            </a>
          </div>
        </div>

        <div className="md:col-span-4 md:self-start">
          <figure>
            <div
              className="relative overflow-hidden rounded-3xl border border-line-strong bg-surface"
              style={{ aspectRatio: `${portrait.width} / ${portrait.height}` }}
            >
              <Picture photo={portrait} sizes={sizes} priority />
              <Crosshairs />
            </div>
            <figcaption className="mt-3 flex justify-between text-sm text-ink-2">
              <span>Fig. 1 — N. Chan</span>
              <span>{portrait.caption}</span>
            </figcaption>
          </figure>

          <p className="mt-6 rounded-2xl border border-line bg-surface/80 p-4 text-sm leading-relaxed text-ink-2 backdrop-blur">
            <span className="flex items-center gap-2 font-medium text-ink">
              <span aria-hidden="true" className="now-dot inline-block h-2 w-2 rounded-full bg-melon" />
              Now · {profile.now.month}
            </span>
            <span className="mt-2 block">{profile.now.text}</span>
          </p>
        </div>
      </div>

      {/* Proof, up front: every number here is real (content/profile.ts). */}
      <div className="relative border-y border-line bg-bg/70 backdrop-blur-sm">
        <ul className="mx-auto grid max-w-7xl grid-cols-2 px-5 sm:px-8 lg:grid-cols-4">
          {profile.proof.map((p, i) => (
            <li
              key={p.label}
              className={`border-line py-6 lg:py-8 ${i % 2 ? "border-l pl-5 sm:pl-8" : "pr-5"} ${
                i > 1 ? "border-t lg:border-t-0" : ""
              } ${i === 2 ? "lg:border-l lg:pl-8" : ""}`}
            >
              <span className="font-display block text-4xl leading-none text-melon sm:text-5xl">{p.value}</span>
              <span className="mt-2 block max-w-[16rem] text-sm leading-snug text-ink-2">{p.label}</span>
            </li>
          ))}
        </ul>
      </div>
      </MicroscopeField>
    </section>
  );
}

function Crosshairs() {
  const c = "absolute h-4 w-4 border-white/70";
  return (
    <div aria-hidden="true">
      <span className={`${c} top-4 left-4 border-t border-l`} />
      <span className={`${c} top-4 right-4 border-t border-r`} />
      <span className={`${c} bottom-4 left-4 border-b border-l`} />
      <span className={`${c} right-4 bottom-4 border-r border-b`} />
    </div>
  );
}
