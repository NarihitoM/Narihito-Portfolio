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
  trail: Point[];
}

const CELL = 56;
const SPEED = 90;
const TRAIL_LENGTH = 52;
const RUNNER_COUNT = 18;

function randomDir(exclude?: { dx: number; dy: number }) {
  const dirs = [
    { dx: 1, dy: 0 },
    { dx: -1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: 0, dy: -1 },
  ];
  const options = exclude
    ? dirs.filter((d) => !(d.dx === -exclude.dx && d.dy === -exclude.dy))
    : dirs;
  return options[Math.floor(Math.random() * options.length)];
}

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
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let runners: Runner[] = [];

    function makeRunners() {
      const cols = Math.max(1, Math.floor(width / CELL));
      const rows = Math.max(1, Math.floor(height / CELL));
      return Array.from({ length: RUNNER_COUNT }, () => {
        const dir = randomDir();
        return {
          x: Math.floor(Math.random() * cols) * CELL,
          y: Math.floor(Math.random() * rows) * CELL,
          dx: dir.dx,
          dy: dir.dy,
          distSinceTurn: 0,
          trail: [],
        };
      });
    }

    function resize() {
      const rect = parent!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      runners = makeRunners();
    }

    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    let last = performance.now();

    function frame(now: number) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      ctx!.clearRect(0, 0, width, height);

      for (const runner of runners) {
        runner.x += runner.dx * SPEED * dt;
        runner.y += runner.dy * SPEED * dt;
        runner.distSinceTurn += SPEED * dt;

        if (runner.distSinceTurn >= CELL) {
          runner.distSinceTurn = 0;
          runner.x = Math.round(runner.x / CELL) * CELL;
          runner.y = Math.round(runner.y / CELL) * CELL;

          if (runner.x <= 0) {
            runner.dx = 1;
            runner.dy = 0;
          } else if (runner.x >= width) {
            runner.dx = -1;
            runner.dy = 0;
          } else if (runner.y <= 0) {
            runner.dx = 0;
            runner.dy = 1;
          } else if (runner.y >= height) {
            runner.dx = 0;
            runner.dy = -1;
          } else if (Math.random() < 0.55) {
            const dir = randomDir({ dx: runner.dx, dy: runner.dy });
            runner.dx = dir.dx;
            runner.dy = dir.dy;
          }
        }

        runner.trail.push({ x: runner.x, y: runner.y });
        if (runner.trail.length > TRAIL_LENGTH) runner.trail.shift();

        if (runner.trail.length > 1) {
          const tail = runner.trail[0];
          const head = runner.trail[runner.trail.length - 1];
          const gradient = ctx!.createLinearGradient(tail.x, tail.y, head.x, head.y);
          gradient.addColorStop(0, `rgba(${rgb},0)`);
          gradient.addColorStop(1, `rgba(${rgb},0.28)`);

          ctx!.strokeStyle = gradient;
          ctx!.lineWidth = 1.5;
          ctx!.lineJoin = "round";
          ctx!.beginPath();
          ctx!.moveTo(tail.x, tail.y);
          for (let i = 1; i < runner.trail.length; i++) {
            ctx!.lineTo(runner.trail[i].x, runner.trail[i].y);
          }
          ctx!.stroke();
        }

        const head = runner.trail[runner.trail.length - 1];
        if (head) {
          const glow = ctx!.createRadialGradient(head.x, head.y, 0, head.x, head.y, 5);
          glow.addColorStop(0, `rgba(${rgb},0.5)`);
          glow.addColorStop(1, `rgba(${rgb},0)`);
          ctx!.fillStyle = glow;
          ctx!.fillRect(head.x - 5, head.y - 5, 10, 10);

          ctx!.beginPath();
          ctx!.arc(head.x, head.y, 1.8, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(${rgb},0.6)`;
          ctx!.fill();
        }
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