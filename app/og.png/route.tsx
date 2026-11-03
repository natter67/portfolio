import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { grainPath } from "@/lib/grains";

// The card LinkedIn shows when the link is pasted: etched grains + name.
// Served as a real .png file so every host sends the right content type.
export const dynamic = "force-static";
const size = { width: 1200, height: 630 };

export async function GET() {
  const [display, mono] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/BigShoulders-ExtraBold.ttf")),
    readFile(join(process.cwd(), "assets/fonts/MartianMono-Regular.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 64px",
          background: "#06070b",
          color: "#f2f4f8",
          position: "relative",
        }}
      >
        <svg
          width="1200"
          height="630"
          viewBox="0 0 1200 630"
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          <path d={grainPath(1200, 630, 90, 11)} fill="none" stroke="#6e9bff" strokeOpacity="0.2" strokeWidth="1.5" />
        </svg>

        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Mono", fontSize: 22, letterSpacing: 2, color: "#9aa3b2" }}>
          <span>SPECIMEN 00 — N. CHAN</span>
          <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ width: 80, height: 2, background: "#9aa3b2" }} /> 50 µm
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", gap: 44, fontFamily: "Display", fontSize: 200, lineHeight: 0.9, letterSpacing: 0 }}>
            <span>NATHAN</span>
            <span style={{ color: "#2a63ff" }}>CHAN</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 28 }}>
            <span style={{ width: 56, height: 6, background: "#ffa672" }} />
            <span style={{ fontFamily: "Mono", fontSize: 26, color: "#9aa3b2", letterSpacing: 1 }}>
              MATERIALS SCIENCE & ENGINEERING · ILLINOIS
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Display", data: display, weight: 800, style: "normal" },
        { name: "Mono", data: mono, weight: 400, style: "normal" },
      ],
    },
  );
}
