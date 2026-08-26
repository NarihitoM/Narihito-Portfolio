"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap, ScrollTrigger } from "@/shared/lib/gsap";

export function ScrollProgressLine() {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const line = lineRef.current;
    if (!line) return;

    registerGsap();

    const st = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        gsap.set(line, { scaleX: self.progress });
      },
    });

    return () => st.kill();
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[55] h-[2px]">
      <div ref={lineRef} className="h-full w-full origin-left scale-x-0 bg-violet" />
    </div>
  );
}
