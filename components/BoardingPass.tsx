"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/content/profile";

const CELLS = 16;
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const pad = (w: string) => w.toUpperCase().padEnd(CELLS, " ").slice(0, CELLS);

/** Split-flap departure board: each cell riffles before settling, left to right. */
function SplitFlap({ words }: { words: readonly string[] }) {
  const [text, setText] = useState(pad(words[0]));
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(box.current!);
    let w = 0;
    let anim = 0;
    const cycle = setInterval(() => {
      if (!visible || document.hidden) return;
      w = (w + 1) % words.length;
      const target = pad(words[w]);
      let tick = 0;
      clearInterval(anim);
      anim = window.setInterval(() => {
        tick++;
        let done = true;
        setText(
          [...target]
            .map((ch, i) => {
              if (tick >= 4 + i * 1.2) return ch;
              done = false;
              return GLYPHS[(Math.random() * GLYPHS.length) | 0];
            })
            .join(""),
        );
        if (done) clearInterval(anim);
      }, 45);
    }, 3200);
    return () => {
      clearInterval(cycle);
      clearInterval(anim);
      io.disconnect();
    };
  }, [words]);

  return (
    <div
      ref={box}
      className="grid max-w-[30rem] grid-cols-[repeat(16,minmax(0,1fr))] gap-[2px] sm:gap-[3px]"
      aria-hidden="true"
    >
      {[...text].map((ch, i) => (
        <span
          key={i}
          className="relative grid aspect-[2/3] place-items-center border border-[#3a3f46] bg-[#202429] font-mono text-[clamp(0.7rem,3.4vw,1.25rem)] text-[#f3e9c6]"
        >
          {ch}
          <span className="absolute inset-x-0 top-1/2 h-px bg-black/60" />
        </span>
      ))}
    </div>
  );
}

/** A deterministic barcode drawn from the email address. */
function Barcode({ seed }: { seed: string }) {
  const bars: number[] = [];
  for (const c of seed) {
    const n = c.charCodeAt(0);
    bars.push((n % 3) + 1, ((n >> 2) % 2) + 1);
  }
  let x = 0;
  return (
    <svg viewBox={`0 0 ${bars.reduce((a, b) => a + b + 1, 0)} 30`} preserveAspectRatio="none" className="h-12 w-full" aria-hidden="true">
      {bars.map((b, i) => {
        const r = i % 2 === 0 ? <rect key={i} x={x} y="0" width={b} height="30" fill="currentColor" /> : null;
        x += b + 1;
        return r;
      })}
    </svg>
  );
}

export default function BoardingPass({ from }: { from: string }) {
  const b = profile.boarding;
  const mail = `mailto:${profile.email}?subject=${encodeURIComponent("Next stop: your team")}`;
  const field = (k: string, v: React.ReactNode) => (
    <div>
      <dt className="specimen text-ink-2">{k}</dt>
      <dd className="font-display mt-1 text-2xl leading-none">{v}</dd>
    </div>
  );

  return (
    <section aria-labelledby="pass-title" className="mt-14 lg:col-span-2">
      <div className="grid overflow-hidden border-2 border-ink bg-surface md:grid-cols-[1fr_auto_17rem]">
        {/* Main ticket */}
        <div className="p-5 sm:p-7">
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-3">
            <h3 id="pass-title" className="specimen text-ink">
              Boarding pass · Stop {String(profile.route.length + 1).padStart(2, "0")}
            </h3>
            <span className="specimen text-accent">Now boarding</span>
          </div>

          <div className="mt-5 grid grid-cols-[auto_1fr] items-end gap-x-6 gap-y-5 sm:grid-cols-[auto_auto_1fr]">
            <div>
              <p className="specimen text-ink-2">From</p>
              <p className="font-display mt-1 text-2xl leading-none">{from.split(",")[0]}</p>
            </div>
            <span aria-hidden="true" className="hidden pb-1 text-3xl text-ink-2 sm:block">
              ✈
            </span>
            <div className="col-span-2 sm:col-span-1">
              <p className="specimen mb-2 text-ink-2">To</p>
              <SplitFlap words={b.destinations} />
              <p className="sr-only">Destinations: {b.destinations.join(", ")}</p>
            </div>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
            {field("Passenger", "Chan / Nathan")}
            {field("Class", "Materials Eng.")}
            {field("Seeking", b.seeking)}
            {field("Degree", `B.S. ${profile.education.expected.slice(-4)}`)}
          </dl>

          <div className="mt-7">
            <p className="specimen text-ink-2">Checked baggage — already proven</p>
            <ul className="mt-3 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
              {b.proof.map((p) => (
                <li key={p.label} className="bg-bg p-3">
                  <span className="font-display block text-3xl leading-none text-accent">{p.value}</span>
                  <span className="mt-1 block text-sm text-ink-2">{p.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="specimen mt-6 text-ink-2">
            Carry-on: <span className="text-ink">{b.carryOn.join(" · ")}</span>
          </p>
        </div>

        {/* Perforation */}
        <div aria-hidden="true" className="relative hidden w-0 border-l-2 border-dashed border-line-strong md:block">
          <span className="absolute -top-3 -left-3 h-6 w-6 rounded-[50%] border-2 border-ink bg-bg" />
          <span className="absolute -bottom-3 -left-3 h-6 w-6 rounded-[50%] border-2 border-ink bg-bg" />
        </div>

        {/* Stub */}
        <div className="flex flex-col justify-between gap-5 border-t-2 border-dashed border-line-strong bg-bg p-5 sm:p-7 md:border-t-0">
          <div>
            <p className="specimen text-ink-2">Gate</p>
            <p className="font-display mt-1 text-5xl leading-none">Your team</p>
            <p className="mt-3 text-sm text-ink-2">{profile.next}</p>
          </div>
          <div className="text-ink">
            <Barcode seed={profile.email} />
            <p className="specimen mt-1 text-center text-ink-2">{profile.email}</p>
          </div>
          <div className="flex flex-col gap-2">
            <a
              href={mail}
              className="bg-accent-fill px-5 py-3 text-center text-sm font-semibold text-accent-on shadow-[4px_4px_0_var(--ink)] transition-[transform,box-shadow] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_var(--ink)]"
            >
              Board — email me ↗
            </a>
            <a href="/resume/" className="border border-line-strong px-5 py-3 text-center text-sm font-semibold hover:border-ink">
              Check the manifest (resume) ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
