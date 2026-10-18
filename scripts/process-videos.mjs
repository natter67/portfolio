// Turns approved clips in _photo-intake/ into small, silent web loops.
//   node scripts/process-videos.mjs
// Output: public/video/<id>.mp4 (H.264, no audio, faststart) + <id>.webp poster,
// and content/video-data.json (dimensions). Captions live in content/projects.ts.
// ffmpeg drops all metadata (-map_metadata -1), including location.

import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";

const sources = {
  // id: { src, start?, duration?, speed? } — times in seconds of the source clip
};

mkdirSync("public/video", { recursive: true });
const data = {};
for (const [id, { src, start = 0, duration, speed = 1 }] of Object.entries(sources)) {
  const input = `_photo-intake/${src}`;
  const vf = [`setpts=PTS/${speed}`, "scale='min(720,iw)':-2", "fps=30"].join(",");
  const trim = [...(start ? ["-ss", `${start}`] : []), ...(duration ? ["-t", `${duration}`] : [])];
  execFileSync("ffmpeg", [
    "-y", "-loglevel", "error", ...trim, "-i", input,
    "-an", "-map_metadata", "-1", "-vf", vf,
    "-c:v", "libx264", "-profile:v", "high", "-pix_fmt", "yuv420p", "-crf", "28", "-preset", "slow",
    "-movflags", "+faststart", `public/video/${id}.mp4`,
  ]);
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", `public/video/${id}.mp4`, "-frames:v", "1", "-q:v", "70", `public/video/${id}.webp`]);
  const [w, h] = execFileSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", `public/video/${id}.mp4`])
    .toString().trim().split(",").map(Number);
  data[id] = { width: w, height: h };
  console.log(id, `${w}x${h}`);
}
writeFileSync("content/video-data.json", JSON.stringify(data, null, 2) + "\n");
