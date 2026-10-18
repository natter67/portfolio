"use client";

import { useEffect, useRef, useState } from "react";
import type { Grain } from "@/lib/grains";
import { rng } from "@/lib/rng";

// A real metallographic prep sequence. Between grits the specimen is turned
// 90°, so each step's scratches cross the last — that's drawn here too.
const STEPS = [
  { label: "240 grit", medium: "SiC paper" },
  { label: "400 grit", medium: "SiC paper" },
  { label: "800 grit", medium: "SiC paper" },
  { label: "1200 grit", medium: "SiC paper" },
  { label: "3 µm", medium: "Diamond suspension" },
  { label: "0.05 µm", medium: "Colloidal silica" },
];
const STEP_MS = 200;
const POLISH_MS = STEPS.length * STEP_MS; // 1200
const ETCH_MS = 650; // → 1850
const LIFT_MS = 350; // → 2200 total

const SCRATCH = [
  { n: 240, w: 1.6, a: 0.55, light: true },
  { n: 170, w: 1.2, a: 0.45, light: true },
  { n: 120, w: 0.9, a: 0.36, light: true },
  { n: 70, w: 0.7, a: 0.3, light: false },
  { n: 30, w: 0.5, a: 0.22, light: false },
  { n: 8, w: 0.4, a: 0.14, light: false },
];

const GW = 1600;
const GH = 1000;

type Phase = "polish" | "etch" | "lift" | "done";

export default function Loader({ cells }: { cells: Grain[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<Phase>("polish");
  const [step, setStep] = useState(0);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    // Not this session (or reduced motion): CSS keeps the overlay hidden.
    if (!root.hasAttribute("data-loader")) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    // Pre-generate scratches for each step.
    const rand = rng(7);
    const diag = Math.hypot(W, H);
    const scratches = SCRATCH.map((s, i) => {
      const base = (i % 2 ? Math.PI / 2 : 0) + Math.PI / 7;
      const lines = new Float32Array(s.n * 4);
      for (let k = 0; k < s.n; k++) {
        const ang = base + (rand() - 0.5) * 0.12;
        const len = diag * (0.15 + rand() * 0.9);
        const cx = rand() * W;
        const cy = rand() * H;
        const dx = (Math.cos(ang) * len) / 2;
        const dy = (Math.sin(ang) * len) / 2;
        lines.set([cx - dx, cy - dy, cx + dx, cy + dy], k * 4);
      }
      return lines;
    });

    // Fit the grain field to the viewport like `object-fit: cover`.
    const scale = Math.max(W / GW, H / GH);
    const ox = (W - GW * scale) / 2;
    const oy = (H - GH * scale) / 2;
    const paths = cells.map((c) => {
      const p = new Path2D();
      c.points.forEach(([x, y], j) =>
        j ? p.lineTo(ox + x * scale, oy + y * scale) : p.moveTo(ox + x * scale, oy + y * scale),
      );
      p.closePath();
      return p;
    });

    // Same display face as the hero, sized like clamp(72px, 20vw, 240px) and
    // shrunk if needed to fit narrow screens.
    const family = getComputedStyle(root).getPropertyValue("--fa-display").trim() || "sans-serif";
    let nameSize = Math.min(240, Math.max(72, W * 0.2));
    ctx.font = `800 ${nameSize}px ${family}`;
    const fit = (W * 0.9) / ctx.measureText("NATHAN CHAN").width;
    if (fit < 1) nameSize *= fit;
    const nameFont = `800 ${nameSize}px ${family}`;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const clamp = (t: number) => Math.min(1, Math.max(0, t));

    function drawScratches(i: number, alpha: number) {
      if (alpha <= 0) return;
      const s = SCRATCH[i];
      ctx.lineWidth = s.w;
      ctx.strokeStyle = s.light
        ? `rgba(235,238,242,${s.a * alpha})`
        : `rgba(24,26,30,${s.a * alpha})`;
      ctx.beginPath();
      const l = scratches[i];
      for (let k = 0; k < l.length; k += 4) {
        ctx.moveTo(l[k], l[k + 1]);
        ctx.lineTo(l[k + 2], l[k + 3]);
      }
      ctx.stroke();
    }

    function surface(p: number) {
      // Rough dark metal → bright mirror polish.
      const v = Math.round(lerp(42, 190, p * p * (3 - 2 * p)));
      ctx.fillStyle = `rgb(${v},${v + 2},${v + 6})`;
      ctx.fillRect(0, 0, W, H);
      const g = ctx.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, "rgba(255,255,255,0)");
      g.addColorStop(0.45, `rgba(255,255,255,${0.28 * p})`);
      g.addColorStop(0.6, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }

    let start = performance.now();
    let raf = 0;
    let lastStep = -1;
    let etchStarted = false;
    let finished = false;

    function frame(now: number) {
      const t = Math.max(0, now - start);
      if (t < POLISH_MS) {
        const i = Math.floor(t / STEP_MS);
        const local = (t % STEP_MS) / STEP_MS;
        if (i !== lastStep) {
          lastStep = i;
          setStep(i);
        }
        surface(t / POLISH_MS);
        if (i > 0) drawScratches(i - 1, 1 - local / 0.4);
        drawScratches(i, local < 0.3 ? 1 : 1 - ((local - 0.3) / 0.7) * 0.6);
      } else {
        if (!etchStarted) {
          etchStarted = true;
          setPhase("etch");
        }
        const e = clamp((t - POLISH_MS) / ETCH_MS);
        surface(1);
        drawScratches(5, 0.4 * (1 - e));
        // Grains darken at different rates (orientation contrast), boundaries
        // etch in first — like nital attacking a ferrite structure.
        cells.forEach((c, k) => {
          const local = clamp((e - c.shade * 0.45) / 0.55);
          if (local <= 0) return;
          const tone = Math.round(lerp(196, 150 + c.shade * 50, local));
          ctx.fillStyle = `rgb(${tone},${tone + 2},${tone + 5})`;
          ctx.fill(paths[k]);
          ctx.strokeStyle = `rgba(22,24,28,${0.85 * local})`;
          ctx.lineWidth = 1.3;
          ctx.stroke(paths[k]);
        });
        // The name resolves out of the etched structure. It's drawn on the
        // canvas, not in the DOM, so it never becomes the page's LCP element.
        const n = clamp((e - 0.35) / 0.5);
        if (n > 0) {
          ctx.save();
          ctx.globalAlpha = n;
          ctx.filter = `blur(${(1 - n) * 10}px)`;
          ctx.fillStyle = "#16181b";
          ctx.font = nameFont;
          ctx.letterSpacing = "0px";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("NATHAN CHAN", W / 2, H / 2);
          ctx.restore();
        }
        if (t >= POLISH_MS + ETCH_MS) {
          finish();
          return;
        }
      }
      raf = requestAnimationFrame(frame);
    }

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function finish() {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(raf);
      setPhase("lift");
      try {
        sessionStorage.setItem("etched", "1");
      } catch {}
      window.setTimeout(() => {
        root.removeAttribute("data-loader");
        document.body.style.overflow = prevOverflow;
        setPhase("done");
        setActive(false);
      }, LIFT_MS);
    }

    const skip = () => finish();
    window.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);
    start = performance.now();
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
      document.body.style.overflow = prevOverflow;
    };
  }, [cells]);

  if (!active) return null;

  const s = STEPS[step];
  const lifting = phase === "lift" || phase === "done";
  const etching = phase !== "polish";

  return (
    <div
      className="loader fixed inset-0 z-[100] cursor-pointer overflow-hidden"
      aria-hidden="true"
      style={{
        background:
          "repeating-linear-gradient(26deg, rgba(255,255,255,.05) 0 1px, transparent 1px 7px), #2a2c30",
        transform: lifting ? "translateY(-100%)" : "none",
        transition: `transform ${LIFT_MS}ms cubic-bezier(.7,0,.2,1)`,
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      <div className="absolute inset-0 flex flex-col justify-between p-5 text-white mix-blend-difference sm:p-8">
        <div className="specimen flex justify-between">
          <span>Specimen 00 — N. Chan</span>
          <span>Press any key to skip</span>
        </div>

        <div className="flex items-end justify-between gap-4 font-mono">
          <div>
            <div className="specimen opacity-70">
              {etching ? "Etch" : `Step ${String(step + 1).padStart(2, "0")} / 06 · ${s.medium}`}
            </div>
            <div className="mt-1 text-3xl tabular-nums sm:text-5xl">
              {etching ? "2% Nital" : s.label}
            </div>
          </div>
          <div className="specimen flex items-center gap-2 pb-1">
            <span className="inline-block h-px w-12 bg-current" /> 50 <span className="normal-case">µm</span>
          </div>
        </div>
      </div>
    </div>
  );
}
