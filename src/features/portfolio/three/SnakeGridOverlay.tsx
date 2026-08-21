"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/shared/hooks/useTheme";

interface Point {
  x: number;
  y: number;
}

interface Runner {
  x: number;
  y: number;
  dx: number;
  dy: number;
  distSinceTurn: number;
  speed: number;
  trail: Point[];
}

interface Pulse {
  x: number;
  y: number;
  start: number;
}

const CELL = 56;
const TRAIL_LENGTH = 52;
const RUNNER_COUNT = 10;
const TRAIL_BANDS = 6;
const PULSE_DURATION = 1600;
const PULSE_INTERVAL = 520;

const JOG_CHANCE = 0.28;
const RESUME_CHANCE = 0.7;

export function SnakeGridOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rgb = theme === "light" ? "10,10,10" : "255,255,255";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let runners: Runner[] = [];
    const pulses: Pulse[] = [];
    let lastPulse = 0;

    const gridCanvas = document.createElement("canvas");
    const gridCtx = gridCanvas.getContext("2d");

    function paintGrid() {
      if (!gridCtx) return;
      gridCanvas.width = width * dpr;
      gridCanvas.height = height * dpr;
      gridCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      gridCtx.clearRect(0, 0, width, height);

      gridCtx.strokeStyle = `rgba(${rgb},0.035)`;
      gridCtx.lineWidth = 1;
      gridCtx.beginPath();
      for (let c = 0; c <= cols; c++) {
        const x = c * CELL + 0.5;
        gridCtx.moveTo(x, 0);
        gridCtx.lineTo(x, height);
      }
      for (let r = 0; r <= rows; r++) {
        const y = r * CELL + 0.5;
        gridCtx.moveTo(0, y);
        gridCtx.lineTo(width, y);
      }
      gridCtx.stroke();

      gridCtx.fillStyle = `rgba(${rgb},0.09)`;
      for (let c = 0; c <= cols; c++) {
        for (let r = 0; r <= rows; r++) {
          gridCtx.fillRect(c * CELL - 0.75, r * CELL - 0.75, 1.5, 1.5);
        }
      }
    }

    function resetRunner(runner: Runner, seeded: boolean) {
      runner.x = Math.floor(Math.random() * (cols + 1)) * CELL;
      runner.y = seeded ? Math.floor(Math.random() * (rows + 1)) * CELL : -CELL;
      runner.dx = 0;
      runner.dy = 1;
      runner.distSinceTurn = 0;
      runner.speed = 70 + Math.random() * 55;
      runner.trail.length = 0;
    }

    function makeRunners() {
      return Array.from({ length: RUNNER_COUNT }, () => {
        const runner: Runner = {
          x: 0,
          y: 0,
          dx: 0,
          dy: 1,
          distSinceTurn: 0,
          speed: 0,
          trail: [],
        };
        resetRunner(runner, true);
        return runner;
      });
    }

    function resize() {
      const rect = parent!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      cols = Math.max(1, Math.floor(width / CELL));
      rows = Math.max(1, Math.floor(height / CELL));
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      paintGrid();
      runners = makeRunners();
      pulses.length = 0;
    }

    resize();
    window.addEventListener("resize", resize);

    if (reduced) {
      ctx.drawImage(gridCanvas, 0, 0, width, height);
      return () => window.removeEventListener("resize", resize);
    }

    let raf = 0;
    let last = performance.now();

    function drawTrail(runner: Runner) {
      const trail = runner.trail;
      if (trail.length < 2) return;

      const bandSize = Math.ceil(trail.length / TRAIL_BANDS);
      for (let b = 0; b < TRAIL_BANDS; b++) {
        const from = b * bandSize;
        const to = Math.min((b + 1) * bandSize, trail.length - 1);
        if (from >= to) continue;

        const strength = (b + 1) / TRAIL_BANDS;
        ctx!.strokeStyle = `rgba(${rgb},${0.34 * strength * strength})`;
        ctx!.lineWidth = 0.5 + 1.3 * strength;
        ctx!.beginPath();
        ctx!.moveTo(trail[from].x, trail[from].y);
        for (let i = from + 1; i <= to; i++) {
          ctx!.lineTo(trail[i].x, trail[i].y);
        }
        ctx!.stroke();
      }
    }

    function drawHead(head: Point) {
      const glow = ctx!.createRadialGradient(head.x, head.y, 0, head.x, head.y, 9);
      glow.addColorStop(0, `rgba(${rgb},0.45)`);
      glow.addColorStop(1, `rgba(${rgb},0)`);
      ctx!.fillStyle = glow;
      ctx!.fillRect(head.x - 9, head.y - 9, 18, 18);

      ctx!.beginPath();
      ctx!.arc(head.x, head.y, 1.9, 0, Math.PI * 2);
      ctx!.fillStyle = `rgba(${rgb},0.75)`;
      ctx!.fill();
    }

    function drawPulses(now: number) {
      ctx!.lineWidth = 1;
      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i];
        const t = (now - pulse.start) / PULSE_DURATION;
        if (t >= 1) {
          pulses.splice(i, 1);
          continue;
        }
        const eased = 1 - Math.pow(1 - t, 3);
        ctx!.beginPath();
        ctx!.arc(pulse.x, pulse.y, eased * 26, 0, Math.PI * 2);
        ctx!.strokeStyle = `rgba(${rgb},${(1 - t) * 0.22})`;
        ctx!.stroke();
      }
    }

    function step(runner: Runner, dt: number) {
      runner.x += runner.dx * runner.speed * dt;
      runner.y += runner.dy * runner.speed * dt;
      runner.distSinceTurn += runner.speed * dt;

      if (runner.distSinceTurn >= CELL) {
        runner.distSinceTurn = 0;
        runner.x = Math.round(runner.x / CELL) * CELL;
        runner.y = Math.round(runner.y / CELL) * CELL;

        if (runner.dy === 1) {
          if (Math.random() < JOG_CHANCE) {
            runner.dx = Math.random() < 0.5 ? -1 : 1;
            runner.dy = 0;
          }
        } else if (Math.random() < RESUME_CHANCE) {
          runner.dx = 0;
          runner.dy = 1;
        }

        const maxX = cols * CELL;
        if ((runner.x <= 0 && runner.dx === -1) || (runner.x >= maxX && runner.dx === 1)) {
          runner.dx = 0;
          runner.dy = 1;
        }
      }

      runner.trail.push({ x: runner.x, y: runner.y });
      if (runner.trail.length > TRAIL_LENGTH) runner.trail.shift();

      if (runner.trail[0].y > height) resetRunner(runner, false);
    }

    function frame(now: number) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      ctx!.clearRect(0, 0, width, height);
      ctx!.drawImage(gridCanvas, 0, 0, width, height);
      ctx!.lineJoin = "round";
      ctx!.lineCap = "round";

      if (now - lastPulse > PULSE_INTERVAL) {
        lastPulse = now;
        pulses.push({
          x: Math.floor(Math.random() * (cols + 1)) * CELL,
          y: Math.floor(Math.random() * (rows + 1)) * CELL,
          start: now,
        });
      }

      drawPulses(now);

      for (const runner of runners) {
        step(runner, dt);
        drawTrail(runner);
        const head = runner.trail[runner.trail.length - 1];
        if (head) drawHead(head);
      }

      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [theme]);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0" />;
}
