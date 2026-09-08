"use client";

import { useEffect, useRef } from "react";

export function ScrollProgressLine() {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const line = lineRef.current;
    if (!line) return;

    let frame = 0;
    let last = -1;

    const tick = () => {
      const doc = document.documentElement;
      const body = document.body;
      const top = Math.max(window.scrollY, doc.scrollTop, body.scrollTop);
      const max = Math.max(doc.scrollHeight - doc.clientHeight, body.scrollHeight - body.clientHeight);
      const progress = max > 0 ? Math.min(top / max, 1) : 0;

      if (progress !== last) {
        last = progress;
        line.style.transform = `scaleX(${progress})`;
      }
      frame = requestAnimationFrame(tick);
    };

    tick();

    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[55] h-[2px]">
      <div ref={lineRef} className="h-full w-full origin-left scale-x-0 bg-violet" />
    </div>
  );
}
