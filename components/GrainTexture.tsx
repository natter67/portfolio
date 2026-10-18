import { grainPath } from "@/lib/grains";

/** Faint etched-grain background. Rendered at build time — zero client JS. */
export default function GrainTexture({
  seed = 3,
  count = 140,
  className = "",
}: {
  seed?: number;
  count?: number;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      viewBox="0 0 1600 1000"
      preserveAspectRatio="xMidYMid slice"
    >
      <path
        d={grainPath(1600, 1000, count, seed)}
        fill="none"
        stroke="var(--grain)"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
