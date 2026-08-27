"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap, REDUCED_MOTION_QUERY, NO_REDUCED_MOTION_QUERY } from "@/shared/lib/gsap";

const WORD = "NARIHITO";
const COPIES_PER_HALF = 20;

const rows = [
  { outline: true, from: -50, to: -20 },
  { outline: false, from: -20, to: -50 },
  { outline: true, from: -50, to: -20 },
];

function Track({ outline }: { outline: boolean }) {
  return (
    <div
      data-track
      className={
        outline
          ? "flex w-max shrink-0 text-outline opacity-30"
          : "flex w-max shrink-0 text-text-primary"
      }
    >
      {Array.from({ length: COPIES_PER_HALF * 2 }, (_, i) => (
        <span key={i} className="whitespace-nowrap pr-[0.28em]">
          {WORD} &mdash;
        </span>
      ))}
    </div>
  );
}

export function NameMarquee() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const section = sectionRef.current;
      if (!section) return;

      const tracks = gsap.utils.toArray<HTMLElement>("[data-track]", section);
      const mm = gsap.matchMedia();

      mm.add(REDUCED_MOTION_QUERY, () => {
        tracks.forEach((track, i) => gsap.set(track, { xPercent: rows[i].from }));
      });

      mm.add(NO_REDUCED_MOTION_QUERY, () => {
        tracks.forEach((track, i) => {
          gsap.fromTo(
            track,
            { xPercent: rows[i].from },
            {
              xPercent: rows[i].to,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.6,
              },
            },
          );
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      aria-hidden
      className="w-full overflow-hidden bg-bg py-10 md:py-14 lg:py-20 select-none"
    >
      <div className="flex flex-col font-display text-[clamp(26px,5.5vw,72px)] font-semibold leading-[1.05] tracking-[-0.02em]">
        {rows.map((row, i) => (
          <Track key={i} outline={row.outline} />
        ))}
      </div>
    </section>
  );
}
