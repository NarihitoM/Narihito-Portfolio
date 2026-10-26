"use client";

import { useEffect, useRef } from "react";
import { getLenisInstance } from "@/shared/lib/lenis";

export function ScrollProgressLine() {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const line = lineRef.current;
    if (!line) return;

    let frame = 0;
    let last = -1;

    const nativeProgress = () => {
      const doc = document.documentElement;
      const body = document.body;
      const top = Math.max(window.scrollY, doc.scrollTop, body.scrollTop);
      const max = Math.max(doc.scrollHeight - doc.clientHeight, body.scrollHeight - body.clientHeight);
      return max > 0 ? Math.min(top / max, 1) : 0;
    };

    const update = () => {
      frame = 0;
      const lenis = getLenisInstance();
      const value =
        lenis && lenis.limit > 0 && Number.isFinite(lenis.progress) ? lenis.progress : nativeProgress();
      const progress = Math.min(Math.max(value, 0), 1);

      if (progress !== last) {
        last = progress;
        line.style.transform = `scaleX(${progress})`;
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();

    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[55] h-[2px]">
      <div ref={lineRef} className="h-full w-full origin-left bg-violet" style={{ transform: "scaleX(0)" }} />
    </div>
  );
}
