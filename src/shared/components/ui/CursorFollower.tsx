"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/shared/hooks/useTheme";

const TRAIL_EASE = 0.16;

export function CursorFollower() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let raf = 0;
    let visible = false;

    function show() {
      if (visible) return;
      visible = true;
      dot!.style.opacity = "1";
      ring!.style.opacity = "1";
    }

    function onMove(event: PointerEvent) {
      mouseX = event.clientX;
      mouseY = event.clientY;
      dot!.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      show();
    }

    function onLeave() {
      visible = false;
      dot!.style.opacity = "0";
      ring!.style.opacity = "0";
    }

    function frame() {
      ringX += (mouseX - ringX) * TRAIL_EASE;
      ringY += (mouseY - ringY) * TRAIL_EASE;
      ring!.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(frame);
    }

    document.body.classList.add("cursor-none");
    window.addEventListener("pointermove", onMove);
    document.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(frame);

    return () => {
      document.body.classList.remove("cursor-none");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  const rgb = theme === "light" ? "10,10,10" : "255,255,255";

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-95 h-1.5 w-1.5 rounded-full opacity-0 transition-opacity duration-200"
        style={{ backgroundColor: `rgb(${rgb})` }}
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-95 h-8 w-8 rounded-full border opacity-0 transition-opacity duration-200"
        style={{ borderColor: `rgba(${rgb},0.4)` }}
      />
    </>
  );
}
