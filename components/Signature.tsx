"use client";

import { useEffect, useRef } from "react";
import sig from "@/content/signature.json";

/**
 * "Nathan Chan" handwritten with a large N and C, drawn stroke by stroke like
 * a pen the first time it scrolls into view (after the loader). Path from
 * scripts/make-signature.mjs.
 */
export default function Signature({ className = "" }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = ref.current!;
    const root = document.documentElement;
    let seen = false;
    const draw = () => {
      if (seen && !root.hasAttribute("data-loader")) {
        el.classList.add("is-drawn");
        io.disconnect();
        mo.disconnect();
      }
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        seen = true;
        draw();
      }
    });
    const mo = new MutationObserver(draw);
    io.observe(el);
    mo.observe(root, { attributes: true, attributeFilter: ["data-loader"] });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return (
    <svg ref={ref} viewBox={sig.viewBox} className={`sig ${className}`} role="img" aria-label="Nathan Chan signature">
      {sig.strokes.map((st, k) => (
        <path
          key={k}
          className="sig-ink"
          style={{ "--s": st.start, "--d": st.dur } as React.CSSProperties}
          d={st.d}
          pathLength={1}
          fill="none"
          stroke="currentColor"
          strokeWidth={32}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}
