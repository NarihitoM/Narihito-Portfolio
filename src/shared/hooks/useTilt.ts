"use client";

import { useRef } from "react";
import { gsap, ease } from "@/shared/lib/gsap";

export function useTilt<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  const reducedMotion = () =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const handleMouseMove = (event: React.MouseEvent<T>) => {
    if (reducedMotion()) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;

    gsap.to(el, {
      rotateX: py * -8,
      rotateY: px * 8,
      duration: 0.3,
      ease: ease.interaction,
      transformPerspective: 800,
    });
  };

  const resetTilt = () => {
    gsap.to(ref.current, { rotateX: 0, rotateY: 0, duration: 0.4, ease: ease.interaction });
  };

  const handleTouchStart = () => {
    if (reducedMotion()) return;
    gsap.to(ref.current, { rotateX: -3, rotateY: 3, duration: 0.3, ease: ease.interaction });
  };

  return {
    ref,
    style: { willChange: "transform" as const },
    onMouseMove: handleMouseMove,
    onMouseLeave: resetTilt,
    onTouchStart: handleTouchStart,
    onTouchEnd: resetTilt,
  };
}
