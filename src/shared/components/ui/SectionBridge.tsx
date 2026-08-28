"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap, REDUCED_MOTION_QUERY, NO_REDUCED_MOTION_QUERY } from "@/shared/lib/gsap";

export function SectionBridge({ from, to }: { from: string; to: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const root = rootRef.current;
      const fill = fillRef.current;
      const dot = dotRef.current;
      if (!root || !fill || !dot) return;

      const mm = gsap.matchMedia();

      mm.add(REDUCED_MOTION_QUERY, () => {
        gsap.set(fill, { scaleX: 1 });
        gsap.set(dot, { left: "100%" });
      });

      mm.add(NO_REDUCED_MOTION_QUERY, () => {
        const scrollTrigger = {
          trigger: root,
          start: "top 90%",
          end: "bottom 45%",
          scrub: 0.6,
        };

        gsap.fromTo(fill, { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger });
        gsap.fromTo(dot, { left: "0%" }, { left: "100%", ease: "none", scrollTrigger });
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <div aria-hidden className="w-full">
      <div
        ref={rootRef}
        className="mx-5 md:mx-10 lg:mx-[120px] flex items-center gap-3 md:gap-6 py-4 md:py-6"
      >
        <span className="shrink-0 font-mono text-[9px] md:text-[11px] font-medium tracking-[2px] md:tracking-[3px] text-text-muted">
          {from}
        </span>

        <div className="relative h-px flex-1 bg-border-glow-soft">
          <span ref={fillRef} className="absolute inset-0 origin-left bg-violet" />
          <span
            ref={dotRef}
            className="absolute top-1/2 h-1.5 w-1.5 md:h-2 md:w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet text-violet shadow-[0_0_10px_2px_currentColor]"
          />
        </div>

        <span className="shrink-0 font-mono text-[9px] md:text-[11px] font-medium tracking-[2px] md:tracking-[3px] text-violet">
          {to}
        </span>
      </div>
    </div>
  );
}
