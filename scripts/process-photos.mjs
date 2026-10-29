// Turns approved originals in _photo-intake/ into web images.
//   node scripts/process-photos.mjs
// Output: public/photos/<id>-<width>.{avif,webp} and content/photo-data.json
// (sizes + blur placeholders). Alt text and captions live in content/photos.ts.
// sharp drops all EXIF/GPS metadata unless asked to keep it — we never ask.

import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const INTAKE = "_photo-intake";
const OUT = "public/photos";
const WIDTHS = [480, 800, 1200, 1600, 2000];

// id → source (relative to _photo-intake). maxWidth caps the largest export;
// extract crops a region of the (upright) original first.
const sources = {
  // Hero
  // Studio headshot is 3:2 landscape — crop to 3:4 around the subject to keep the hero shape.
  portrait: { src: "hero/headshot-2026-10.jpg", extract: { left: 1440, top: 0, width: 3000, height: 4000 } },
  // Project covers
  "boring-illini-team": { src: "favorites/IMG_2591.JPG" },
  "acp-bench-test": { src: "favorites/IMG_4875.JPG" },
  "eoh-booth": { src: "albums/Illini 26’/IMG_2629.JPG" },
  // Other students' name tags are in frame — keep it small enough that they stay illegible.
  "tm-makerspace": { src: "albums/T&M Launc Day Scavaneger Hunt/Image (6).jpeg", maxWidth: 800 },
  "muck-removal-cad": { src: "portfolio-deck/s04-muck-removal-cad-top.png" },
  "caltech-hydrogel-lattice": { src: "portfolio-deck/s09-caltech-printed-hydrogel-lattice.png" },
  "vartm-layup": { src: "portfolio-deck/s11-vartm-layup.jpg" },
  // Personality strip
  "water-polo": { src: "favorites/IMG_4906.JPG" },
  "eagle-court-of-honor": { src: "favorites/R6M21957-Enhanced-NR (1).JPG" },
  "eagle-scout-profile": { src: "favorites/C1C2CB90-14B3-455F-BDCE-89FEB93E8F1A.jpg" },
  "illini-football": { src: "favorites/IMG_0379.JPG" },
  graduation: { src: "albums/Desktop/SEA09189.JPEG" },
  zion: { src: "albums/Desktop/IMG_0150.jpeg" },
  miyajima: { src: "favorites/IMG_9133_edited.jpeg" },
  "grainger-bucket-hats": { src: "albums/Illini 26’/IMG_9936.JPG" },
  snowman: { src: "favorites/IMG_1114.JPG" },
  "long-beach-suits": { src: "favorites/IMG_8787.JPG" },
  // Case-study galleries (from the portfolio deck)
  "caltech-glovebox": { src: "portfolio-deck/s09-caltech-glovebox-nathan.png" },
  "caltech-metal-lattices": { src: "portfolio-deck/s09-caltech-metal-lattices-petri.png" },
  "caltech-sem-screen": { src: "portfolio-deck/s09-caltech-sem-fib-screen.png" },
  "muck-removal-cad-underside": { src: "portfolio-deck/s04-muck-removal-cad-underside.png" },
  "boring-illini-banner": { src: "portfolio-deck/s06-competition-team-banner.jpg" },
  "boring-illini-night-crew": { src: "portfolio-deck/s06-competition-trio-hardhats-night.jpg" },
  // EOH logos (rendered from the EOH-2026 repo's SVG; transparent background)
  "eoh-logo-2026": { src: "logos/eoh-2026.png" },
  // EOH gallery
  "eoh-night": { src: "favorites/DSC09242.JPG" },
  "eoh-soldering": { src: "hero/eoh-soldering.jpg" },
  // Dana co-op (approved album; no customer parts or failure details)
  "dana-hq": { src: "dana/IMG_3879.JPG" },
  "dana-polisher": { src: "dana/IMG_3007.JPG" },
  "dana-mounts": { src: "dana/IMG_3016.JPG" },
  "dana-mount-pile": { src: "dana/IMG_3819.JPG" },
  "dana-lab-press": { src: "dana/IMG_3748.JPG" },
  "dana-lab-selfie": { src: "dana/IMG_4175.JPG" },
  // ID badge in frame — kept small enough to be illegible.
  "dana-plant-floor": { src: "dana/IMG_9678.jpeg", maxWidth: 800 },
  "dana-interns": { src: "dana/IMG_8304.jpeg" },
  "dana-plant-letters": { src: "dana/IMG_3269.JPG" },
  // Bench: micrographs captured by Nathan's lab group (MSE 307), cut from report figures
  "bench-23-melt": { src: "mse307/Fig2_transitions.jpg", extract: { left: 0, top: 514, width: 900, height: 675 } },
  "bench-23-eutectic": { src: "mse307/Fig2_transitions.jpg", extract: { left: 908, top: 514, width: 900, height: 675 } },
  "bench-35-heat-a": { src: "mse307/Fig3_hyper_heating.jpg", extract: { left: 0, top: 0, width: 900, height: 506 } },
  "bench-35-heat-c": { src: "mse307/Fig3_hyper_heating.jpg", extract: { left: 1816, top: 0, width: 900, height: 506 } },
  "bench-35-1c": { src: "mse307/Fig5_cooling_rate_grid_v2.jpg", extract: { left: 908, top: 1366, width: 900, height: 506 } },
  "bench-35-10c": { src: "mse307/Fig5_cooling_rate_grid_v2.jpg", extract: { left: 1816, top: 1366, width: 900, height: 506 } },
  // Soil-conditioning CAD: still of the Fusion model, shown until the live viewer is opened
  "acp-cad-poster": { src: "cad/acp-fusion-poster.png" },
  // MSE 307 report figures (original resolution, from "OM ImageJ Analysis/Report figures")
  "om-dendrites-cover": {
    src: "mse307/Fig2_transitions.jpg",
    extract: { left: 1818, top: 514, width: 898, height: 673 }, // panel F: 23 wt%, final
  },
  "om-transitions": { src: "mse307/Fig2_transitions.jpg", maxWidth: 2000 },
  "om-heating": { src: "mse307/Fig3_hyper_heating.jpg", maxWidth: 2000 },
  "om-phase-fraction": { src: "mse307/Fig4_phase_fraction_v2.jpg", maxWidth: 2000 },
  "om-cooling-rates": { src: "mse307/Fig5_cooling_rate_grid_v2.jpg", maxWidth: 2000 },
};

await mkdir(OUT, { recursive: true });
const data = {};

for (const [id, { src, maxWidth = 1600, extract }] of Object.entries(sources)) {
  // Bake in EXIF orientation, then work from the upright pixels.
  let upright = await sharp(path.join(INTAKE, src)).rotate().toBuffer();
  if (extract) upright = await sharp(upright).extract(extract).toBuffer();
  const { width: w0, height: h0 } = await sharp(upright).metadata();
  const top = Math.min(w0, maxWidth);
  const widths = WIDTHS.filter((w) => w < top).concat(top);

  for (const w of widths) {
    const img = sharp(upright).resize({ width: w });
    await img.clone().avif({ quality: 50 }).toFile(`${OUT}/${id}-${w}.avif`);
    await img.clone().webp({ quality: 74 }).toFile(`${OUT}/${id}-${w}.webp`);
  }

  const blur = await sharp(upright).resize({ width: 16 }).webp({ quality: 40 }).toBuffer();
  data[id] = {
    width: top,
    height: Math.round((h0 * top) / w0),
    widths,
    blur: `data:image/webp;base64,${blur.toString("base64")}`,
  };
  console.log(`${id}: ${w0}x${h0} → ${widths.join(", ")}`);
}

await writeFile("content/photo-data.json", JSON.stringify(data, null, 2) + "\n");
