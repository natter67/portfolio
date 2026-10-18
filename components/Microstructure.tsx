import { grainPath, pearlitePath } from "@/lib/grains";

// Fine → medium → coarse: grain growth during an anneal.
const STAGES = [
  { count: 130, seed: 11 },
  { count: 80, seed: 23 },
  { count: 45, seed: 37 },
];

/**
 * The hero's living background. Three grain structures crossfade in a slow
 * loop (recrystallization → grain growth). The same geometry is drawn twice:
 * faint across the hero, and crisp inside the cursor's "objective" lens.
 */
export function GrainGrowth() {
  const view = "0 0 1600 1000";
  const layer = (className: string) => (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`}>
      {STAGES.map((_, i) => (
        <svg key={i} viewBox={view} preserveAspectRatio="xMidYMid slice" className="recryst absolute inset-0 h-full w-full">
          <use href={`#grains-${i}`} />
        </svg>
      ))}
    </div>
  );

  return (
    <>
      <svg aria-hidden="true" width="0" height="0" className="absolute">
        <defs>
          {STAGES.map((s, i) => (
            <path
              key={i}
              id={`grains-${i}`}
              d={grainPath(1600, 1000, s.count, s.seed)}
              fill="none"
              stroke="var(--grain)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </defs>
      </svg>
      {layer("grain-base")}
      {layer("grain-lens")}
      <div aria-hidden="true" className="lens-reticle pointer-events-none absolute">
        <span className="specimen absolute top-full left-1/2 mt-2 -translate-x-1/2 whitespace-nowrap text-ink-2">
          ×500 · nital
        </span>
      </div>
    </>
  );
}

/** Pearlite colonies, etched in as the section scrolls into view. */
export function Pearlite({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      className={`etch-in pointer-events-none absolute inset-0 h-full w-full ${className}`}
    >
      <path
        d={pearlitePath(1600, 900, 18, 15, 5)}
        fill="none"
        stroke="var(--grain)"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d={grainPath(1600, 900, 18, 5)}
        fill="none"
        stroke="var(--grain)"
        strokeWidth="1.6"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
