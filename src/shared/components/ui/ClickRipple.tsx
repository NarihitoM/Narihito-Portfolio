"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/shared/hooks/useTheme";

interface Droplet {
  angle: number;
  distance: number;
  size: number;
}

interface Ripple {
  x: number;
  y: number;
  start: number;
  droplets: Droplet[];
}

const DURATION = 1000;
const MAX_RADIUS = 110;
const RING_COUNT = 3;
const RING_STAGGER = 0.13;

function makeDroplets() {
  const count = 5 + Math.floor(Math.random() * 3);
  return Array.from({ length: count }, () => ({
    angle: Math.random() * Math.PI * 2,
    distance: 26 + Math.random() * 26,
    size: 1.1 + Math.random() * 1.5,
  }));
}

export function ClickRipple() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rgb = theme === "light" ? "10,10,10" : "255,255,255";
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let width = 0;
    let height = 0;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener("resize", resize);

    const ripples: Ripple[] = [];
    let raf = 0;

    function drawRipple(ripple: Ripple, t: number) {
      for (let k = 0; k < RING_COUNT; k++) {
        const rt = (t - k * RING_STAGGER) / (1 - k * RING_STAGGER);
        if (rt <= 0 || rt >= 1) continue;

        const eased = 1 - Math.pow(1 - rt, 3);
        const radius = eased * MAX_RADIUS * (1 - k * 0.2);
        const alpha = Math.pow(1 - rt, 1.6) * 0.4 * (1 - k * 0.22);
        if (alpha <= 0.002) continue;

        ctx!.beginPath();
        ctx!.arc(ripple.x, ripple.y, radius, 0, Math.PI * 2);
        ctx!.strokeStyle = `rgba(${rgb},${alpha})`;
        ctx!.lineWidth = 0.4 + 1.6 * (1 - rt);
        ctx!.stroke();
      }
    }

    function drawImpact(ripple: Ripple, t: number) {
      const it = Math.min(Math.max(t / 0.3, 0), 1);
      if (it >= 1) return;

      const eased = 1 - Math.pow(1 - it, 2);
      const radius = 3 + eased * 15;
      const alpha = Math.pow(1 - it, 2) * 0.5;

      const glow = ctx!.createRadialGradient(ripple.x, ripple.y, 0, ripple.x, ripple.y, radius);
      glow.addColorStop(0, `rgba(${rgb},${alpha})`);
      glow.addColorStop(1, `rgba(${rgb},0)`);
      ctx!.fillStyle = glow;
      ctx!.beginPath();
      ctx!.arc(ripple.x, ripple.y, radius, 0, Math.PI * 2);
      ctx!.fill();
    }

    function drawDroplets(ripple: Ripple, t: number) {
      const dt = Math.min(t / 0.55, 1);
      if (dt >= 1) return;

      const eased = 1 - Math.pow(1 - dt, 2);
      const alpha = Math.pow(1 - dt, 1.5) * 0.55;
      if (alpha <= 0.002) return;

      ctx!.fillStyle = `rgba(${rgb},${alpha})`;
      for (const drop of ripple.droplets) {
        const dist = eased * drop.distance;
        const lift = Math.sin(dt * Math.PI) * 7;
        const x = ripple.x + Math.cos(drop.angle) * dist;
        const y = ripple.y + Math.sin(drop.angle) * dist - lift;

        ctx!.beginPath();
        ctx!.arc(x, y, drop.size * (1 - dt * 0.55), 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function frame(now: number) {
      ctx!.clearRect(0, 0, width, height);

      for (let i = ripples.length - 1; i >= 0; i--) {
        const ripple = ripples[i];
        const t = (now - ripple.start) / DURATION;
        if (t >= 1) {
          ripples.splice(i, 1);
          continue;
        }
        drawRipple(ripple, t);
        drawDroplets(ripple, t);
        drawImpact(ripple, t);
      }

      if (ripples.length > 0) {
        raf = requestAnimationFrame(frame);
      } else {
        raf = 0;
        ctx!.clearRect(0, 0, width, height);
      }
    }

    function onPointerDown(event: PointerEvent) {
      ripples.push({
        x: event.clientX,
        y: event.clientY,
        start: performance.now(),
        droplets: makeDroplets(),
      });
      if (!raf) {
        raf = requestAnimationFrame(frame);
      }
    }

    window.addEventListener("pointerdown", onPointerDown);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize", resize);
    };
  }, [theme]);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[90]" />;
}
