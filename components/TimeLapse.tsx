"use client";

import { useEffect, useRef } from "react";

/**
 * A silent looping clip that plays only while on screen. Under reduced motion
 * it stays paused on its poster with controls, so it never moves on its own.
 */
export default function TimeLapse({
  id,
  width,
  height,
  label,
}: {
  id: string;
  width: number;
  height: number;
  label: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current!;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.controls = true;
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => (v.controls = true));
        else v.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      poster={`/video/${id}.webp`}
      width={width}
      height={height}
      aria-label={label}
      className="h-full w-full bg-black object-contain"
    >
      <source src={`/video/${id}.mp4`} type="video/mp4" />
    </video>
  );
}
