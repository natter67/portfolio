// Builds the signature path from a single-stroke script font (EMS Allure,
// SIL OFL) so it can be "written" one continuous stroke at a time.
//   node scripts/make-signature.mjs
// Output: content/signature.json — { viewBox, strokes: [{ d, len, start, dur }] }

import fs from "node:fs";

const TEXT = "Nathan Chan";
const TRACK = -70; // tighter letter spacing (font units) — signatures run together
const SLANT = 0.18; // extra forward lean
const CAP = 1.7; // capitals written large, lowercase runs small after them
const font = fs.readFileSync("assets/fonts/EMSAllure.svg", "utf8");

const glyphs = {};
for (const m of font.matchAll(/<glyph\b([^>]*)\/?>/g)) {
  const a = m[1];
  const uni = a.match(/unicode="([^"]*)"/)?.[1];
  if (uni == null) continue;
  glyphs[uni] = { adv: +(a.match(/horiz-adv-x="([^"]*)"/)?.[1] ?? 500), d: a.match(/\sd="([^"]*)"/)?.[1] ?? "" };
}

// Glyph outlines → polylines in page space (y down, slanted).
const strokes = [];
let x = 0;
for (const ch of TEXT) {
  const g = glyphs[ch] ?? { adv: 400, d: "" };
  const k = /[A-Z]/.test(ch) ? CAP : 1;
  // Big N: keep only its main stroke; the extra tick reads as an arrowhead at this size.
  const subs = g.d.split("M").map((s) => s.trim()).filter(Boolean);
  for (const sub of ch === "N" ? subs.slice(0, 1) : subs) {
    const nums = sub.replace(/L/g, " ").trim().split(/\s+/).map(Number);
    const pts = [];
    for (let i = 0; i + 1 < nums.length; i += 2) {
      const [gx, gy] = [nums[i] * k + x, nums[i + 1] * k];
      pts.push([gx + gy * SLANT, -gy]);
    }
    // Some glyphs repeat a stroke to fake weight; keep one copy.
    const key = pts.map((p) => p.map(Math.round).join(",")).join(" ");
    if (pts.length > 1 && !strokes.some((s) => s.key === key)) strokes.push({ key, pts });
  }
  x += g.adv * k + TRACK;
}

// Underline: one clean stroke beneath the lowercase, lifting slightly at the end.
const all = strokes.flatMap((s) => s.pts);
const minX = Math.min(...all.map((p) => p[0]));
const maxX = Math.max(...all.map((p) => p[0]));
const w = maxX - minX;
strokes.push({
  key: "underline",
  pts: [
    [minX + 0.16 * w, 120],
    [minX + 0.5 * w, 175],
    [maxX - 0.12 * w, 150],
    [maxX + 0.01 * w, 70],
  ],
});

// Smooth each polyline with Catmull–Rom → cubic Béziers.
const f = (n) => Math.round(n * 10) / 10;
function smooth(pts) {
  if (pts.length < 3) return `M${f(pts[0][0])},${f(pts[0][1])}L${f(pts[1][0])},${f(pts[1][1])}`;
  let d = `M${f(pts[0][0])},${f(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const [p1, p2] = [pts[i], pts[i + 1]];
    const p3 = pts[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${f(c1[0])},${f(c1[1])} ${f(c2[0])},${f(c2[1])} ${f(p2[0])},${f(p2[1])}`;
  }
  return d;
}

const allPts = strokes.flatMap((s) => s.pts);
const pad = 40;
const bx = Math.min(...allPts.map((p) => p[0])) - pad;
const by = Math.min(...allPts.map((p) => p[1])) - pad;
const bw = Math.max(...allPts.map((p) => p[0])) - bx + pad;
const bh = Math.max(...allPts.map((p) => p[1])) - by + pad;

// Each stroke is its own path: SVG restarts dash patterns per subpath, so the
// pen animation times every stroke separately by its share of total length.
const lengths = strokes.map((s) =>
  s.pts.slice(1).reduce((L, p, i) => L + Math.hypot(p[0] - s.pts[i][0], p[1] - s.pts[i][1]), 0),
);
const total = lengths.reduce((a, b) => a + b, 0);
let acc = 0;
const out = strokes.map((s, i) => {
  const o = { d: smooth(s.pts), len: Math.round(lengths[i]), start: +(acc / total).toFixed(4), dur: +(lengths[i] / total).toFixed(4) };
  acc += lengths[i];
  return o;
});
fs.writeFileSync("content/signature.json", JSON.stringify({ viewBox: [bx, by, bw, bh].map(f).join(" "), strokes: out }) + "\n");
console.log("strokes:", strokes.length, "viewBox:", [bx, by, bw, bh].map(Math.round).join(" "));
