"use client";

import Link from "next/link";
import BoardingPass from "./BoardingPass";
import { useEffect, useRef, useState } from "react";

export type Stop = {
  place: string;
  when: string;
  title: string;
  text: string;
  proof: { label: string; href: string }[];
  x: number;
  y: number;
};

const PAUSE = 1300; // pit stop, ms
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

/**
 * Flies the route once the section scrolls into view: the plane follows each
 * leg, the contrail draws behind it, and it pits at every stop while the log
 * highlights why it's there. Click any stop to fly straight to it.
 */
export default function FlightPlayer({
  stops,
  legs,
  children,
}: {
  stops: Stop[];
  legs: string[];
  children: React.ReactNode;
}) {
  const root = useRef<HTMLDivElement>(null);
  const legRefs = useRef<(SVGPathElement | null)[]>([]);
  const plane = useRef<SVGGElement>(null);
  const run = useRef(0); // bump to cancel an in-flight tour
  const [active, setActive] = useState(0);
  const [flown, setFlown] = useState(0); // legs fully drawn
  const [moving, setMoving] = useState(false);

  // Place the plane at a stop, facing along the leg it arrived on.
  function park(i: number) {
    const el = legRefs.current[Math.max(0, i - 1)];
    const p = plane.current;
    if (!p) return;
    if (!el || i === 0) {
      p.setAttribute("transform", `translate(${stops[0].x},${stops[0].y}) rotate(-20)`);
      return;
    }
    const L = el.getTotalLength();
    const a = el.getPointAtLength(L - 1);
    const b = el.getPointAtLength(L);
    const ang = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
    p.setAttribute("transform", `translate(${b.x},${b.y}) rotate(${ang})`);
  }

  function flyLeg(i: number, token: number) {
    return new Promise<void>((resolve) => {
      const el = legRefs.current[i]!;
      const L = el.getTotalLength();
      const dur = 700 + L * 2.2;
      const t0 = performance.now();
      el.style.strokeDasharray = `${L}`;
      const step = (now: number) => {
        if (token !== run.current) return resolve();
        const t = ease(Math.min(1, (now - t0) / dur));
        const s = t * L;
        const a = el.getPointAtLength(Math.max(0, s - 1));
        const b = el.getPointAtLength(Math.min(L, s + 1));
        const pt = el.getPointAtLength(s);
        const ang = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
        plane.current?.setAttribute("transform", `translate(${pt.x},${pt.y}) rotate(${ang})`);
        el.style.strokeDashoffset = `${L - s}`;
        if (t < 1) requestAnimationFrame(step);
        else resolve();
      };
      requestAnimationFrame(step);
    });
  }

  const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

  async function tour(from: number, to: number) {
    const token = ++run.current;
    setMoving(true);
    for (let i = from; i < to; i++) {
      await flyLeg(i, token);
      if (token !== run.current) return;
      setFlown((f) => Math.max(f, i + 1));
      setActive(i + 1);
      if (i + 1 < to) await wait(PAUSE);
      if (token !== run.current) return;
    }
    setMoving(false);
  }

  function showAll() {
    run.current++;
    legRefs.current.forEach((el) => {
      if (el) {
        el.style.strokeDasharray = "none";
        el.style.strokeDashoffset = "0";
      }
    });
    setFlown(legs.length);
    setMoving(false);
  }

  function goTo(i: number) {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || i <= active || i > flown + 1) {
      // Backwards, or far ahead: jump there with the full route drawn.
      showAll();
      setActive(i);
      park(i);
      return;
    }
    tour(active, i);
  }

  useEffect(() => {
    // Hide contrails until they're flown.
    legRefs.current.forEach((el) => {
      if (!el) return;
      const L = el.getTotalLength();
      el.style.strokeDasharray = `${L}`;
      el.style.strokeDashoffset = `${L}`;
    });
    park(0);
    const runs = run;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // No flight: show the whole route, parked at the latest stop.
      const id = requestAnimationFrame(() => {
        showAll();
        setActive(stops.length - 1);
        park(stops.length - 1);
      });
      return () => cancelAnimationFrame(id);
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          io.disconnect();
          setTimeout(() => tour(0, legs.length), 500);
        }
      },
      { threshold: 0.45 },
    );
    io.observe(root.current!);
    return () => {
      io.disconnect();
      runs.current++;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, []);

  const seen = new Set<string>();

  return (
    <div ref={root} className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12">
      <figure className="relative">
        <svg viewBox="0 0 975 610" className="h-auto w-full" role="img" aria-label="Map of the United States showing Nathan's route: Pasadena, Champaign, Bastrop, Maumee, and back to Champaign.">
          {children}
          {legs.map((d, i) => (
            <path
              key={i}
              ref={(el) => {
                legRefs.current[i] = el;
              }}
              d={d}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          ))}
          {stops.map((s, i) => {
            const label = !seen.has(s.place);
            seen.add(s.place);
            const on = i === active;
            const reached = i <= flown;
            return (
              <g key={i} className="cursor-pointer" onClick={() => goTo(i)}>
                {on && <circle cx={s.x} cy={s.y} r="8" fill="none" stroke="var(--accent)" className="pit-ping" />}
                <circle
                  cx={s.x}
                  cy={s.y}
                  r={on ? 6.5 : 5}
                  fill={reached ? "var(--accent)" : "var(--bg)"}
                  stroke="var(--accent)"
                  strokeWidth="2"
                />
                {label && (
                  <text
                    x={s.x + 22}
                    y={s.y + 5}
                    className="font-mono text-[13px] tracking-wider uppercase max-sm:text-[26px]"
                    fill={on ? "var(--ink)" : "var(--ink-2)"}
                    paintOrder="stroke"
                    stroke="var(--bg)"
                    strokeWidth="4"
                  >
                    {s.place.split(",")[0]}
                  </text>
                )}
              </g>
            );
          })}
          {/* Plane, nose pointing along +x. */}
          <g ref={plane} aria-hidden="true">
            <path
              d="M11 0L3-1.6-4-9h-3l3.6 7.4H-9.5l-2.4-3H-14l1.3 4.6L-14 4.6h2.1l2.4-3H-3.4L-7 9h3l7-7.4z"
              fill="var(--ink)"
              stroke="var(--bg)"
              strokeWidth="1.2"
              transform="scale(1.35)"
            />
          </g>
        </svg>
        <figcaption className="specimen mt-2 flex flex-wrap justify-between gap-2 text-ink-2">
          <span>
            Pit stop {String(active + 1).padStart(2, "0")} / {String(stops.length).padStart(2, "0")} ·{" "}
            {stops[active].place}
          </span>
          <button
            type="button"
            onClick={() => {
              showAll();
              legRefs.current.forEach((el) => {
                if (!el) return;
                const L = el.getTotalLength();
                el.style.strokeDasharray = `${L}`;
                el.style.strokeDashoffset = `${L}`;
              });
              setFlown(0);
              setActive(0);
              park(0);
              setTimeout(() => tour(0, legs.length), 300);
            }}
            className="underline underline-offset-4 hover:text-ink"
          >
            {moving ? "In flight…" : "Replay flight ↺"}
          </button>
        </figcaption>
      </figure>

      <ol className="space-y-1" aria-label="Flight log">
        {stops.map((s, i) => {
          const on = i === active;
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => goTo(i)}
                aria-current={on ? "step" : undefined}
                className={`group w-full border-l-2 py-3 pr-2 pl-4 text-left transition-colors duration-300 ${
                  on ? "border-accent" : "border-line hover:border-line-strong"
                }`}
              >
                <span className="specimen block text-accent">
                  Stop {String(i + 1).padStart(2, "0")} · {s.when}
                </span>
                <span
                  className={`font-display mt-1 block text-2xl leading-none transition-colors ${on ? "text-ink" : "text-ink-2 group-hover:text-ink"}`}
                >
                  {s.place} — {s.title}
                </span>
                <span className="mt-2 block text-sm text-ink-2">{s.text}</span>
              </button>
              {on && s.proof.length > 0 && (
                <p className="specimen flex flex-wrap gap-x-4 gap-y-1 pb-2 pl-4.5">
                  {s.proof.map((p) => (
                    <Link key={p.href} href={p.href} className="inline-block py-1.5 text-accent underline underline-offset-4">
                      {p.label} →
                    </Link>
                  ))}
                </p>
              )}
            </li>
          );
        })}
      </ol>
      <BoardingPass from={stops[stops.length - 1].place} />
    </div>
  );
}
