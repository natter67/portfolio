"use client";

import { useEffect, useRef } from "react";

const SPEED = 26; // px per second — slow, so captions stay readable

/**
 * Photo strip as a slow, endless carousel. The tiles render twice (the copy is
 * inert and hidden from screen readers) so the loop wraps seamlessly. It pauses
 * on hover, focus, touch, drag, when offscreen, and entirely under reduced
 * motion — where it's a normal sideways-scrolling strip.
 */
export default function PhotoStrip({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number } | null>(null);
  const paused = useRef(false);
  const copy = useRef<HTMLDivElement>(null);
  // Loop length: distance from the first tile to the start of the copied set.
  const period = () => {
    const el = ref.current!;
    return copy.current!.offsetLeft - (el.firstElementChild as HTMLElement).offsetLeft;
  };

  useEffect(() => {
    const el = ref.current!;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let visible = false;
    let raf = 0;
    let last = performance.now();
    let pos = el.scrollLeft;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);
    const tick = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      const half = period();
      if (visible && !paused.current && !document.hidden) {
        // Track position in floats: scrollLeft rounds, which would stall at slow speeds.
        if (Math.abs(el.scrollLeft - pos) > 2) pos = el.scrollLeft; // user moved it
        pos += (SPEED * dt) / 1000;
        if (pos >= half) pos -= half;
        el.scrollLeft = pos;
      } else {
        pos = el.scrollLeft;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    paused.current = true;
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const el = ref.current!;
    drag.current = { x: e.clientX, left: el.scrollLeft };
    el.setPointerCapture(e.pointerId);
    el.style.cursor = "grabbing";
  }
  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!drag.current) return;
    const el = ref.current!;
    const half = period();
    let left = drag.current.left - (e.clientX - drag.current.x);
    if (left < 0) left += half;
    if (left >= half) left -= half;
    el.scrollLeft = left;
  }
  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") paused.current = false;
    if (!drag.current) return;
    drag.current = null;
    ref.current!.style.cursor = "";
  }

  const page = (dir: 1 | -1) => {
    const el = ref.current!;
    el.scrollBy({ left: dir * el.clientWidth * 0.6, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={ref}
        tabIndex={0}
        role="region"
        aria-label="Photos — a slow carousel; hover or focus to pause, scroll sideways to browse"
        onPointerEnter={(e) => e.pointerType === "mouse" && (paused.current = true)}
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") paused.current = false;
        }}
        onFocus={() => (paused.current = true)}
        onBlur={() => (paused.current = false)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="flex cursor-grab gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:px-8 [&::-webkit-scrollbar]:hidden"
      >
        {children}
        <div ref={copy} aria-hidden="true" inert className="flex shrink-0 gap-4">
          {children}
        </div>
      </div>
      <div className="mx-auto mt-2 hidden max-w-7xl justify-end gap-2 px-8 sm:flex">
        {([-1, 1] as const).map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => page(d)}
            aria-label={d < 0 ? "Previous photos" : "Next photos"}
            className="grid h-10 w-10 place-items-center border border-line-strong text-ink-2 transition-colors hover:border-ink hover:text-ink"
          >
            {d < 0 ? "←" : "→"}
          </button>
        ))}
      </div>
    </div>
  );
}
