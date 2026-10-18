import { Delaunay } from "d3-delaunay";
import { rng } from "./rng";

export type Grain = { points: [number, number][]; shade: number };

/**
 * A polycrystalline grain structure: Voronoi cells from jittered seeds, with
 * two passes of Lloyd relaxation so grains look equiaxed like an annealed
 * metal rather than random shards.
 */
export function grains(width: number, height: number, count: number, seed = 1): Grain[] {
  const rand = rng(seed);
  let pts: [number, number][] = Array.from({ length: count }, () => [
    rand() * width,
    rand() * height,
  ]);

  for (let pass = 0; pass < 2; pass++) {
    const v = Delaunay.from(pts).voronoi([0, 0, width, height]);
    pts = pts.map((p, i) => {
      const cell = v.cellPolygon(i);
      if (!cell) return p;
      let x = 0,
        y = 0;
      for (const [cx, cy] of cell.slice(0, -1)) {
        x += cx;
        y += cy;
      }
      const n = cell.length - 1;
      return [x / n, y / n];
    });
  }

  const v = Delaunay.from(pts).voronoi([0, 0, width, height]);
  const out: Grain[] = [];
  for (let i = 0; i < pts.length; i++) {
    const cell = v.cellPolygon(i);
    if (!cell) continue;
    out.push({
      points: cell.slice(0, -1).map(([x, y]) => [Math.round(x * 10) / 10, Math.round(y * 10) / 10]),
      shade: Math.round(rand() * 100) / 100,
    });
  }
  return out;
}

/** Grain boundaries as a single SVG path string. */
export function grainPath(width: number, height: number, count: number, seed = 1) {
  return grains(width, height, count, seed)
    .map(({ points }) => "M" + points.map(([x, y]) => `${x},${y}`).join("L") + "Z")
    .join("");
}

/**
 * Pearlite: each grain is a colony of parallel cementite lamellae at its own
 * angle. Voronoi cells are convex, so each lamella is the chord where a line
 * crosses the cell polygon.
 */
export function pearlitePath(width: number, height: number, count: number, spacing: number, seed = 1) {
  const rand = rng(seed * 7919);
  let d = "";
  for (const { points } of grains(width, height, count, seed)) {
    const a = rand() * Math.PI;
    const [nx, ny] = [Math.cos(a), Math.sin(a)];
    const proj = points.map(([x, y]) => x * nx + y * ny);
    const lo = Math.min(...proj);
    const hi = Math.max(...proj);
    for (let off = lo + spacing * rand(); off < hi; off += spacing) {
      const hits: [number, number][] = [];
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const q = points[(i + 1) % points.length];
        const dp = proj[i] - off;
        const dq = proj[(i + 1) % points.length] - off;
        if (dp * dq < 0) {
          const t = dp / (dp - dq);
          hits.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]);
        }
      }
      if (hits.length === 2) {
        const r = (v: number) => Math.round(v * 10) / 10;
        d += `M${r(hits[0][0])},${r(hits[0][1])}L${r(hits[1][0])},${r(hits[1][1])}`;
      }
    }
  }
  return d;
}
