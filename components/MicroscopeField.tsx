"use client";

import { useRef } from "react";

/**
 * Pointer tracking for the hero's microscope field. The grain layers are
 * server-rendered children; this only feeds the cursor position to CSS
 * (--mx/--my), throttled to one update per frame. Touch devices never see the
 * lens — CSS gates it on (hover: hover) and (pointer: fine).
 */
export default function MicroscopeField({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    const el = ref.current!;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
      el.dataset.lens = "on";
    });
  }

  function onPointerLeave() {
    cancelAnimationFrame(frame.current);
    delete ref.current!.dataset.lens;
  }

  return (
    <div ref={ref} className="microscope relative" onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
      {children}
    </div>
  );
}
