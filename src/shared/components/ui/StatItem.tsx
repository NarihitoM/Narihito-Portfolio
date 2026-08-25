"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { duration, ease, gsap, registerGsap, REDUCED_MOTION_QUERY, NO_REDUCED_MOTION_QUERY } from "@/shared/lib/gsap";

export function StatItem({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const numRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const el = numRef.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add(REDUCED_MOTION_QUERY, () => {
        el.textContent = `${value}${suffix}`;
      });

      mm.add(NO_REDUCED_MOTION_QUERY, () => {
        const counter = { val: 0 };
        gsap.to(counter, {
          val: value,
          duration: duration.countUp,
          ease: ease.entrance,
          scrollTrigger: { trigger: el },
          onUpdate: () => {
            el.textContent = `${Math.round(counter.val)}${suffix}`;
          },
        });
      });

      return () => mm.revert();
    },
    { scope: numRef, dependencies: [value, suffix] },
  );

  return (
    <div className="flex flex-col gap-1">
      <span ref={numRef} className="font-display text-[28px] md:text-[34px] font-semibold text-text-primary">
        0{suffix}
      </span>
      <span className="font-body text-[12px] md:text-[13px] text-text-secondary">{label}</span>
    </div>
  );
}
