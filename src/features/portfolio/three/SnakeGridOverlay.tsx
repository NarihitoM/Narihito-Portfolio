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

const CELL = 56;
const TRAIL_LENGTH = 52;
const RUNNER_COUNT = 10;
const TRAIL_BANDS = 4;

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
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let runners: Runner[] = [];

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
      runners = makeRunners();
    }

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(parent);

    if (reduced) {
      return () => observer.disconnect();
    }

    let raf = 0;
    let last = performance.now();
    let isVisible = true;
    const visObserver = new IntersectionObserver(
      ([entry]) => {
        const next = entry.isIntersecting;
        if (next === isVisible) return;
        isVisible = next;
        if (isVisible && !raf) {
          last = performance.now();
          raf = requestAnimationFrame(frame);
        } else if (!isVisible && raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { threshold: 0.05 },
    );
    visObserver.observe(parent);

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

    const headSprite = document.createElement("canvas");
    headSprite.width = 18 * dpr;
    headSprite.height = 18 * dpr;
    const headCtx = headSprite.getContext("2d");
    if (headCtx) {
      headCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const glow = headCtx.createRadialGradient(9, 9, 0, 9, 9, 9);
      glow.addColorStop(0, `rgba(${rgb},0.45)`);
      glow.addColorStop(1, `rgba(${rgb},0)`);
      headCtx.fillStyle = glow;
      headCtx.fillRect(0, 0, 18, 18);
      headCtx.beginPath();
      headCtx.arc(9, 9, 1.9, 0, Math.PI * 2);
      headCtx.fillStyle = `rgba(${rgb},0.75)`;
      headCtx.fill();
    }

    function drawHead(head: Point) {
      ctx!.drawImage(headSprite, head.x - 9, head.y - 9, 18, 18);
    }

    function step(runner: Runner, dt: number) {
      runner.x += runner.dx * runner.speed * dt;
      runner.y += runner.dy * runner.speed * dt;
      runner.distSinceTurn += runner.speed * dt;

      if (runner.distSinceTurn >= CELL) {
        runner.distSinceTurn = 0;
        runner.x = Math.round(runner.x / CELL) * CELL;
        runner.y = Math.round(runner.y / CELL) * CELL;
      }

      runner.trail.push({ x: runner.x, y: runner.y });
      if (runner.trail.length > TRAIL_LENGTH) runner.trail.shift();

      if (runner.trail[0].y > height) resetRunner(runner, false);
    }

    function frame(now: number) {
      if (!isVisible) {
        raf = 0;
        return;
      }
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      ctx!.clearRect(0, 0, width, height);
      ctx!.lineJoin = "round";
      ctx!.lineCap = "round";

      for (const runner of runners) {
        step(runner, dt);
        drawTrail(runner);
        const head = runner.trail[runner.trail.length - 1];
        if (head) drawHead(head);
      }

      raf = requestAnimationFrame(frame);
    }

    if (isVisible) raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      visObserver.disconnect();
    };
  }, [theme]);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0" />;
}
