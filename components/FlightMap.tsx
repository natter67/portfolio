import { geoAlbersUsa, geoPath } from "d3-geo";
import { feature, mesh } from "topojson-client";
import { presimplify, simplify } from "topojson-simplify";
import type { Topology, GeometryCollection } from "topojson-specification";
import usAtlas from "us-atlas/states-albers-10m.json";
import { profile } from "@/content/profile";
import FlightPlayer, { type Stop } from "./FlightPlayer";

// us-atlas ships pre-projected (Albers USA, 975×610). Simplified at build time
// so the whole map is ~27 KB of path data and zero client JS.
type US = Topology<{ nation: GeometryCollection; states: GeometryCollection }>;
const topo = simplify(presimplify(usAtlas as unknown as US), 1) as unknown as US;
const path = geoPath().digits(0);
const nation = path(feature(topo, topo.objects.nation)) ?? "";
const states = path(mesh(topo, topo.objects.states, (a, b) => a !== b)) ?? "";
const project = geoAlbersUsa().scale(1300).translate([487.5, 305]);

/** Flight legs arc gently, bowing to the left of the direction of travel. */
function leg([x1, y1]: number[], [x2, y2]: number[]) {
  const [mx, my] = [(x1 + x2) / 2, (y1 + y2) / 2];
  const [dx, dy] = [x2 - x1, y2 - y1];
  const k = 0.22;
  return `M${x1},${y1}Q${Math.round(mx + dy * k)},${Math.round(my - dx * k)} ${x2},${y2}`;
}

export default function FlightMap() {
  const stops: Stop[] = profile.route.map((r) => {
    const [x, y] = project([r.lon, r.lat])!;
    return { ...r, x: Math.round(x), y: Math.round(y), proof: [...r.proof] };
  });
  const legs = stops.slice(1).map((s, i) => leg([stops[i].x, stops[i].y], [s.x, s.y]));

  return (
    <FlightPlayer stops={stops} legs={legs}>
      <path d={nation} fill="var(--surface)" stroke="var(--line-strong)" strokeWidth="1" />
      <path d={states} fill="none" stroke="var(--line)" strokeWidth="0.75" strokeLinejoin="round" />
    </FlightPlayer>
  );
}
