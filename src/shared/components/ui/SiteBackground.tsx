"use client";

import { useEffect, useId, useRef } from "react";
import { useTheme, type Theme } from "@/shared/hooks/useTheme";

interface SilkPalette {
  low: readonly [number, number, number];
  high: readonly [number, number, number];
  foldGamma: number;
  sheenGamma: number;
  sheenWeight: number;
  vignetteX: number;
  vignetteY: number;
}

const RENDER_DIVISOR = 9;
const RENDER_MIN_COLS = 120;
const RENDER_MAX_COLS = 240;
const RENDER_MAX_ROWS = 320;
const FRAME_INTERVAL = 1000 / 30;
const SHAPE_STEPS = 1024;
const SHAPE_MAX = SHAPE_STEPS - 1;
const DITHER_SIZE = 64;
const DITHER_MASK = DITHER_SIZE - 1;
const GRAIN_OPACITY = 0.3;
const STATIC_FRAME_TIME = 7.2;

const FOLD_FREQUENCY = 9;
const FOLD_TILT = 0.62;
const FOLD_DRIFT = 0.1;
const SHEEN_FREQUENCY = 6;
const SHEEN_TILT = 1.05;
const SHEEN_DRIFT = -0.062;

const PALETTES: Record<Theme, SilkPalette> = {
  dark: {
    low: [6, 5, 5],
    high: [42, 41, 39],
    foldGamma: 3.8,
    sheenGamma: 2.0,
    sheenWeight: 0.085,
    vignetteX: 0.26,
    vignetteY: 0.3,
  },
  light: {
    low: [240, 239, 236],
    high: [190, 188, 182],
    foldGamma: 1.7,
    sheenGamma: 1.5,
    sheenWeight: 0.16,
    vignetteX: 0.14,
    vignetteY: 0.16,
  },
};

export function SiteBackground() {
  const grainId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const palette = PALETTES[theme];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const lowR = palette.low[0];
    const lowG = palette.low[1];
    const lowB = palette.low[2];
    const spanR = palette.high[0] - lowR;
    const spanG = palette.high[1] - lowG;
    const spanB = palette.high[2] - lowB;

    const foldShape = new Float32Array(SHAPE_STEPS);
    const sheenShape = new Float32Array(SHAPE_STEPS);
    for (let i = 0; i < SHAPE_STEPS; i++) {
      const level = i / SHAPE_MAX;
      foldShape[i] = Math.pow(level, palette.foldGamma);
      sheenShape[i] = Math.pow(level, palette.sheenGamma) * palette.sheenWeight;
    }

    const dither = new Float32Array(DITHER_SIZE * DITHER_SIZE);
    for (let i = 0; i < dither.length; i++) {
      dither[i] = Math.random() - 0.5;
    }

    let cols = 0;
    let rows = 0;
    let stepX = 0;
    let stepY = 0;
    let elapsed = STATIC_FRAME_TIME;
    let image: ImageData | null = null;
    let foldCosX = new Float32Array(0);
    let foldSinX = new Float32Array(0);
    let sheenCosX = new Float32Array(0);
    let sheenSinX = new Float32Array(0);
    let envX = new Float32Array(0);
    let vignetteX = new Float32Array(0);
    let foldCosY = new Float32Array(0);
    let foldSinY = new Float32Array(0);
    let sheenCosY = new Float32Array(0);
    let sheenSinY = new Float32Array(0);
    let envY = new Float32Array(0);
    let vignetteY = new Float32Array(0);

    const render = (seconds: number) => {
      if (!image) return;
      const target = image;
      const data = target.data;
      const foldPhase = FOLD_DRIFT * seconds;
      const sheenPhase = SHEEN_DRIFT * seconds;

      for (let x = 0; x < cols; x++) {
        const nx = (x + 0.5) * stepX;
        const foldWarp =
          0.055 * Math.sin(nx * 3.8 + seconds * 0.19) +
          0.03 * Math.sin(nx * 7.0 - seconds * 0.27) +
          0.016 * Math.sin(nx * 11.2 + seconds * 0.13);
        const foldAngle = FOLD_FREQUENCY * (foldWarp - FOLD_TILT * nx);
        foldCosX[x] = Math.cos(foldAngle);
        foldSinX[x] = Math.sin(foldAngle);

        const sheenWarp = 0.075 * Math.sin(nx * 3.1 - seconds * 0.14);
        const sheenAngle = SHEEN_FREQUENCY * (sheenWarp - SHEEN_TILT * nx);
        sheenCosX[x] = Math.cos(sheenAngle);
        sheenSinX[x] = Math.sin(sheenAngle);

        envX[x] = 0.8 + 0.2 * Math.sin(nx * 2.6 + seconds * 0.11);
        const u = ((x + 0.5) / cols) * 2 - 1;
        vignetteX[x] = 1 - palette.vignetteX * u * u;
      }

      for (let y = 0; y < rows; y++) {
        const ny = (y + 0.5) * stepY;
        const foldWarp =
          0.04 * Math.sin(ny * 5.3 - seconds * 0.16) + 0.022 * Math.sin(ny * 9.1 + seconds * 0.23);
        const foldAngle = FOLD_FREQUENCY * (ny + foldWarp) + foldPhase;
        foldCosY[y] = Math.cos(foldAngle);
        foldSinY[y] = Math.sin(foldAngle);

        const sheenWarp = 0.048 * Math.sin(ny * 4.7 + seconds * 0.21);
        const sheenAngle = SHEEN_FREQUENCY * (ny + sheenWarp) + sheenPhase;
        sheenCosY[y] = Math.cos(sheenAngle);
        sheenSinY[y] = Math.sin(sheenAngle);

        envY[y] = 0.88 + 0.12 * Math.sin(ny * 4.3 - seconds * 0.09);
        const v = ((y + 0.5) / rows) * 2 - 1;
        vignetteY[y] = 1 - palette.vignetteY * v * v;
      }

      let i = 0;
      for (let y = 0; y < rows; y++) {
        const foldCy = foldCosY[y];
        const foldSy = foldSinY[y];
        const sheenCy = sheenCosY[y];
        const sheenSy = sheenSinY[y];
        const rowEnv = envY[y];
        const rowVignette = vignetteY[y];
        const noiseRow = (y & DITHER_MASK) * DITHER_SIZE;

        for (let x = 0; x < cols; x++) {
          const fold = 0.5 + 0.5 * (foldCosX[x] * foldCy - foldSinX[x] * foldSy);
          const sheen = 0.5 + 0.5 * (sheenCosX[x] * sheenCy - sheenSinX[x] * sheenSy);
          const crest = foldShape[(fold * SHAPE_MAX) | 0] * envX[x] * rowEnv;
          const glow = sheenShape[(sheen * SHAPE_MAX) | 0];

          let level = (crest + glow - crest * glow) * vignetteX[x] * rowVignette;
          if (level < 0) level = 0;
          else if (level > 1) level = 1;

          const noise = dither[noiseRow + (x & DITHER_MASK)];
          data[i] = lowR + spanR * level + noise;
          data[i + 1] = lowG + spanG * level + noise;
          data[i + 2] = lowB + spanB * level + noise;
          data[i + 3] = 255;
          i += 4;
        }
      }

      ctx.putImageData(target, 0, 0);
    };

    const resize = () => {
      const rect = root.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      if (width < 2 || height < 2) return;

      const nextCols = Math.min(
        RENDER_MAX_COLS,
        Math.max(RENDER_MIN_COLS, Math.round((width * dpr) / RENDER_DIVISOR)),
      );
      const nextRows = Math.min(RENDER_MAX_ROWS, Math.max(2, Math.round((nextCols * height) / width)));

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const diagonal = Math.sqrt(width * width + height * height);
      stepX = width / nextCols / diagonal;
      stepY = height / nextRows / diagonal;

      if (nextCols !== cols || nextRows !== rows) {
        cols = nextCols;
        rows = nextRows;
        canvas.width = cols;
        canvas.height = rows;
        image = ctx.createImageData(cols, rows);
        foldCosX = new Float32Array(cols);
        foldSinX = new Float32Array(cols);
        sheenCosX = new Float32Array(cols);
        sheenSinX = new Float32Array(cols);
        envX = new Float32Array(cols);
        vignetteX = new Float32Array(cols);
        foldCosY = new Float32Array(rows);
        foldSinY = new Float32Array(rows);
        sheenCosY = new Float32Array(rows);
        sheenSinY = new Float32Array(rows);
        envY = new Float32Array(rows);
        vignetteY = new Float32Array(rows);
      }

      render(elapsed);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(root);

    if (reduced) {
      return () => observer.disconnect();
    }

    let raf = 0;
    let lastFrame = 0;
    const started = performance.now();

    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      if (now - lastFrame < FRAME_INTERVAL) return;
      lastFrame = now;
      elapsed = STATIC_FRAME_TIME + (now - started) / 1000;
      render(elapsed);
    }

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [theme]);

  return (
    <div ref={rootRef} aria-hidden className="pointer-events-none fixed inset-0 -z-10 isolate overflow-hidden">
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0" />
      <div className="aura-grain" style={{ opacity: GRAIN_OPACITY }}>
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <filter id={grainId}>
            <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix
              type="matrix"
              values="0.181 0.608 0.061 0 0.075
                      0.181 0.608 0.061 0 0.075
                      0.181 0.608 0.061 0 0.075
                      0     0     0     1 0"
            />
          </filter>
          <rect width="100%" height="100%" filter={`url(#${grainId})`} />
        </svg>
      </div>
    </div>
  );
}

