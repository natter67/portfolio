"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Photo } from "@/content/photos";
import DataBar from "./DataBar";
import Picture from "./Picture";

export type Element = {
  slug: string;
  symbol: string;
  specimen: string;
  title: string;
  label: string;
  dates: string;
  year: string;
  family: string;
  families: string[];
  outcome: string;
  href: string | null;
  cover?: Photo;
};

// Families take steel's temper colors: straw → bronze → purple → blue.
export const FAMILY_COLOR: Record<string, string> = {
  Materials: "var(--t-blue)",
  Engineering: "var(--t-straw)",
  Software: "var(--t-bronze)",
  Leadership: "var(--t-purple)",
  Life: "var(--t-straw)",
};

// The active family lives in the URL (?view=materials) so links are shareable.
const EVENT = "workview";
function subscribe(cb: () => void) {
  window.addEventListener("popstate", cb);
  window.addEventListener(EVENT, cb);
  return () => {
    window.removeEventListener("popstate", cb);
    window.removeEventListener(EVENT, cb);
  };
}
const getView = () => new URLSearchParams(location.search).get("view") ?? "all";

export default function WorkTable({ families, items }: { families: string[]; items: Element[] }) {
  const view = useSyncExternalStore(subscribe, getView, () => "all");
  const active = families.some((f) => f.toLowerCase() === view) ? view : "all";
  const inFamily = (it: Element) => active === "all" || it.families.some((f) => f.toLowerCase() === active);

  const [selected, setSelected] = useState(items[0].slug);
  const current = items.find((it) => it.slug === selected && inFamily(it)) ?? items.find(inFamily) ?? items[0];
  // Touch: remember, at finger-down, whether this tile was already the one shown
  // (focus fires before click, so checking at click time is too late).
  const touchArmed = useRef<string | null>(null);

  // Sweep through the visible elements every 4s. Pointing at the tiles or
  // tabbing into the table holds the current one so it can be read.
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const paused = hovering || focused;
  const shown = items.filter(inFamily);
  const next = shown[(shown.indexOf(current) + 1) % shown.length];
  useEffect(() => {
    if (paused || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setSelected(next.slug), 4000);
    return () => clearTimeout(t);
  }, [paused, next.slug]);

  function setFamily(next: string) {
    const url = new URL(location.href);
    if (next === "all") url.searchParams.delete("view");
    else url.searchParams.set("view", next);
    history.replaceState(null, "", url);
    window.dispatchEvent(new Event(EVENT));
  }

  return (
    <div
      className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,23rem)_minmax(0,1fr)] lg:gap-12"
      onFocus={(e) => setFocused(e.target.matches(":focus-visible"))}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setFocused(false)}
    >
      <div>
        {/* Legend doubles as the filter, like the family key on a periodic table. */}
        <div role="group" aria-label="Filter by family" className="flex flex-wrap gap-x-4 gap-y-2">
          {["All", ...families].map((f) => {
            const key = f.toLowerCase();
            const on = key === active;
            const n = key === "all" ? items.length : items.filter((it) => it.families.includes(f)).length;
            return (
              <button
                key={f}
                type="button"
                aria-pressed={on}
                onClick={() => setFamily(key)}
                className={`specimen flex items-center gap-2 border-b py-1 transition-colors ${
                  on ? "border-ink text-ink" : "border-transparent text-ink-2 hover:text-ink"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="inline-block h-2.5 w-2.5"
                  style={{ background: FAMILY_COLOR[f] ?? "var(--ink)" }}
                />
                {f === "All" ? "All work" : f}
                <span className="text-ink-2">{n}</span>
              </button>
            );
          })}
        </div>

        <ul
          className="mt-5 grid grid-cols-3 gap-1.5"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          {items.map((it) => {
            const on = it.slug === current.slug;
            const dim = !inFamily(it);
            const color = FAMILY_COLOR[it.family] ?? "var(--ink)";
            const tile = (
              <>
                <span className="flex justify-between font-mono text-[0.6rem] leading-none">
                  <span>{it.specimen}</span>
                  <span className={on ? "text-bg/70" : "text-ink-2"}>{it.year}</span>
                </span>
                <span className="font-display text-[2.6rem] leading-none" style={{ textTransform: "none" }}>
                  {it.symbol}
                </span>
                <span
                  className={`truncate font-mono text-[0.55rem] leading-none tracking-wider uppercase ${
                    on ? "text-bg/70" : "text-ink-2"
                  }`}
                >
                  {it.label}
                </span>
                <span className="sr-only">
                  {" "}
                  — {it.title}. {it.outcome}
                </span>
              </>
            );
            const cls = `relative flex aspect-square flex-col justify-between border p-2 transition-[transform,opacity,background-color,color] duration-200 ${
              on ? "z-10 scale-[1.06] border-ink bg-ink text-bg shadow-lg" : "border-line-strong bg-bg hover:z-10 hover:scale-[1.04]"
            } ${dim ? "opacity-25" : ""}`;
            const style = {
              boxShadow: on ? undefined : `inset 3px 0 0 ${color}`,
              backgroundImage: on ? undefined : `linear-gradient(color-mix(in srgb, ${color} 9%, transparent), transparent)`,
            };
            const select = () => setSelected(it.slug);
            return (
              <li key={it.slug}>
                {it.href ? (
                  <Link
                    href={it.href}
                    className={cls}
                    style={style}
                    onMouseEnter={select}
                    onFocus={select}
                    onPointerDown={(e) => {
                      touchArmed.current =
                        e.pointerType === "mouse" ? null : current.slug === it.slug ? "open" : "read";
                    }}
                    onClick={(e) => {
                      // On touch, the first tap reads the element; the second opens it.
                      if (touchArmed.current === "read") {
                        e.preventDefault();
                        select();
                      }
                      touchArmed.current = null;
                    }}
                  >
                    {tile}
                  </Link>
                ) : (
                  <button
                    type="button"
                    className={`${cls} w-full text-left`}
                    style={style}
                    onMouseEnter={select}
                    onFocus={select}
                    onClick={select}
                  >
                    {tile}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
        <p className="specimen mt-3 text-ink-2">
          <span className="hidden lg:inline">Hover an element to read it · click to open the datasheet</span>
          <span className="lg:hidden">Tap an element to read it · tap again to open</span>
        </p>
      </div>

      {/* The key: the selected element, enlarged. */}
      {/* Announce only changes the visitor made, not every step of the sweep. */}
      <article key={current.slug} aria-live={paused ? "polite" : "off"} className="element-key min-w-0">
        <div className="relative aspect-[16/10] overflow-hidden border border-line bg-surface">
          {current.cover && (
            <Picture photo={current.cover} sizes="(min-width: 1024px) 760px, 100vw" />
          )}
          <DataBar project={current} className="absolute inset-x-0 bottom-0" />
        </div>
        <div className="mt-5 flex gap-5">
          <div
            aria-hidden="true"
            className="hidden h-28 w-28 shrink-0 flex-col justify-between border-2 border-ink p-2 sm:flex"
            style={{ boxShadow: `inset 5px 0 0 ${FAMILY_COLOR[current.family] ?? "var(--ink)"}` }}
          >
            <span className="flex justify-between font-mono text-[0.65rem] leading-none">
              <span>{current.specimen}</span>
              <span className="text-ink-2">{current.year}</span>
            </span>
            <span className="font-display text-6xl leading-none" style={{ textTransform: "none" }}>
              {current.symbol}
            </span>
            <span className="truncate font-mono text-[0.55rem] leading-none tracking-wider text-ink-2 uppercase">
              {current.family}
            </span>
          </div>
          <div className="min-w-0">
            <h3 className="font-display text-3xl leading-[0.95] sm:text-4xl">{current.title}</h3>
            <p className="specimen mt-2 text-ink-2">
              {current.label}
              {current.dates && ` · ${current.dates}`}
            </p>
            <p className="mt-3 max-w-xl text-ink-2">{current.outcome}</p>
            {current.href && (
              <Link
                href={current.href}
                className="specimen mt-4 inline-flex items-center gap-2 border-b border-accent pb-0.5 text-accent hover:gap-3"
                style={{ transition: "gap .2s" }}
              >
                Read the datasheet →
              </Link>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
