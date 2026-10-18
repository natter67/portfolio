import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const dynamic = "force-static";
const size = { width: 180, height: 180 };

export async function GET() {
  const display = await readFile(join(process.cwd(), "assets/fonts/BigShoulders-ExtraBold.ttf"));
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#16181b",
          color: "#e9e8e3",
          fontFamily: "Display",
          fontSize: 110,
          letterSpacing: 0,
        }}
      >
        N<span style={{ color: "#8fb0ee" }}>.</span>C
      </div>
    ),
    { ...size, fonts: [{ name: "Display", data: display, weight: 800, style: "normal" }] },
  );
}
