"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap, ease } from "@/shared/lib/gsap";

const GRID_COLS = 32;
const GRID_ROWS = 32;
const SCATTER_RADIUS = 180;
const SCATTER_FORCE = 2.4;
const RETURN_EASE = 0.08;
const HOVER_EASE = 0.12;

interface Particle {
  ox: number;
  oy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

export function HeroSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const frameRef = useRef(0);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const loadedRef = useRef(false);

  const buildParticles = useCallback((img: HTMLImageElement, w: number, h: number) => {
    const offscreen = document.createElement("canvas");
    offscreen.width = w;
    offscreen.height = h;
    const ctx = offscreen.getContext("2d")!;
    ctx.drawImage(img, 0, 0, w, h);
    const data = ctx.getImageData(0, 0, w, h).data;

    const cellW = w / GRID_COLS;
    const cellH = h / GRID_ROWS;
    const particles: Particle[] = [];

    for (let gy = 0; gy < GRID_ROWS; gy++) {
      for (let gx = 0; gx < GRID_COLS; gx++) {
        const px = Math.floor(gx * cellW + cellW / 2);
        const py = Math.floor(gy * cellH + cellH / 2);
        const i = (py * w + px) * 4;
        const a = data[i + 3] ?? 0;
        if (a < 30) continue;

        const ox = gx * cellW;
        const oy = gy * cellH;
        particles.push({
          ox,
          oy,
          x: ox,
          y: oy,
          vx: 0,
          vy: 0,
          size: Math.ceil(cellW),
        });
      }
    }
    return particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement!;
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "/Narihito.jpg";
    imageRef.current = img;

    const onImageLoad = () => {
      loadedRef.current = true;
      particlesRef.current = buildParticles(img, w, h);
    };

    if (img.complete) {
      onImageLoad();
    } else {
      img.onload = onImageLoad;
    }

    const getPointer = (clientX: number, clientY: number) => {
      const rect = parent.getBoundingClientRect();
      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    };

    const onMouseMove = (e: MouseEvent) => {
      const p = getPointer(e.clientX, e.clientY);
      mouseRef.current = { ...p, active: true };
    };

    const onMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      const p = getPointer(t.clientX, t.clientY);
      mouseRef.current = { ...p, active: true };
    };

    const onTouchEnd = () => {
      mouseRef.current.active = false;
    };

    parent.addEventListener("mousemove", onMouseMove);
    parent.addEventListener("mouseleave", onMouseLeave);
    parent.addEventListener("touchmove", onTouchMove, { passive: true });
    parent.addEventListener("touchend", onTouchEnd);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, w, h);

      if (!loadedRef.current) {
        ctx.fillStyle = "rgba(138,138,138,0.15)";
        ctx.font = "12px monospace";
        ctx.textAlign = "center";
        ctx.fillText("LOADING...", w / 2, h / 2);
        return;
      }

      const mouse = mouseRef.current;
      const particles = particlesRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (mouse.active && !reduced) {
          const dx = p.x + p.size / 2 - mouse.x;
          const dy = p.y + p.size / 2 - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < SCATTER_RADIUS) {
            const force = (1 - dist / SCATTER_RADIUS) * SCATTER_FORCE;
            const angle = Math.atan2(dy, dx);
            p.vx += Math.cos(angle) * force;
            p.vy += Math.sin(angle) * force;
          }
        }

        p.vx += (p.ox - p.x) * RETURN_EASE;
        p.vy += (p.oy - p.y) * RETURN_EASE;
        p.vx *= 0.88;
        p.vy *= 0.88;

        if (reduced) {
          p.x += (p.ox - p.x) * 0.1;
          p.y += (p.oy - p.y) * 0.1;
        } else {
          p.x += p.vx * HOVER_EASE;
          p.y += p.vy * HOVER_EASE;
        }

        const dx = p.x + p.size / 2 - mouse.x;
        const dy = p.y + p.size / 2 - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const glow = mouse.active ? Math.max(0, 1 - dist / SCATTER_RADIUS) * 0.3 : 0;

        ctx.globalAlpha = 1 + glow;
        ctx.drawImage(
          img,
          p.ox,
          p.oy,
          img.naturalWidth / GRID_COLS,
          img.naturalHeight / GRID_ROWS,
          p.x,
          p.y,
          p.size,
          p.size,
        );
      }

      ctx.globalAlpha = 1;
    };

    animate();

    const onResize = () => {
      const nw = parent.clientWidth;
      const nh = parent.clientHeight;
      canvas.width = nw;
      canvas.height = nh;
      if (loadedRef.current && imageRef.current) {
        particlesRef.current = buildParticles(imageRef.current, nw, nh);
      }
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frameRef.current);
      parent.removeEventListener("mousemove", onMouseMove);
      parent.removeEventListener("mouseleave", onMouseLeave);
      parent.removeEventListener("touchmove", onTouchMove);
      parent.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", onResize);
    };
  }, [buildParticles]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}