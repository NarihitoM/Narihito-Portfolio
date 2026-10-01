"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap, REDUCED_MOTION_QUERY, NO_REDUCED_MOTION_QUERY } from "@/shared/lib/gsap";

const WORD = "NARIHITO";
const COPIES_PER_HALF = 20;
const LOOP_SECONDS = 120;
const MAX_BOOST = 6;

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
        const loops = tracks.map((track, i) =>
          gsap.fromTo(
            track,
            { xPercent: rows[i].from < rows[i].to ? -50 : 0 },
            { xPercent: rows[i].from < rows[i].to ? 0 : -50, duration: LOOP_SECONDS, ease: "none", repeat: -1 },
          ),
        );

        let lastY = window.scrollY;
        const onScroll = () => {
          const boost = Math.min(Math.abs(window.scrollY - lastY) / 8, MAX_BOOST);
          lastY = window.scrollY;
          gsap.to(loops, { timeScale: 1 + boost, duration: 0.2, overwrite: true });
          gsap.to(loops, { timeScale: 1, duration: 1, delay: 0.2 });
        };

        const visibility = new IntersectionObserver(([entry]) => {
          loops.forEach((loop) => loop.paused(!entry.isIntersecting));
        });
        visibility.observe(section);
        window.addEventListener("scroll", onScroll, { passive: true });

        return () => {
          visibility.disconnect();
          window.removeEventListener("scroll", onScroll);
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      aria-hidden
      className="w-full overflow-hidden py-10 md:py-14 lg:py-20 select-none"
    >
      <div className="flex flex-col font-display text-[clamp(26px,5.5vw,72px)] font-semibold leading-[1.05] tracking-[-0.02em]">
        {rows.map((row, i) => (
          <Track key={i} outline={row.outline} />
        ))}
      </div>
    </section>
  );
}
