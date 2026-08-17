"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ease, gsap, registerGsap, REDUCED_MOTION_QUERY } from "@/shared/lib/gsap";
import { SectionEyebrow, SectionHeading } from "@/shared/components/ui/SectionHeading";
import { DetailCta } from "@/shared/components/ui/DetailCta";

const ENTRIES = [
  {
    dates: "2024 — Present",
    role: "Senior Full-Stack Engineer",
    company: "Northwind Labs",
    description:
      "Leading the rebuild of the core product on Next.js and a Node/Postgres service layer, cutting median page load by 60%.",
  },
  {
    dates: "2022 — 2024",
    role: "Full-Stack Developer",
    company: "Fieldstone",
    description:
      "Owned the design system and the API gateway; shipped real-time collaboration features used by 50k weekly users.",
  },
  {
    dates: "2020 — 2022",
    role: "Frontend Developer",
    company: "Loop & Co.",
    description:
      "Built the marketing site and internal tools, introduced motion design patterns still used across the product.",
  },
];

export function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const spineFillRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const spine = spineFillRef.current;
      if (!spine) return;

      const mm = gsap.matchMedia();

      mm.add(REDUCED_MOTION_QUERY, () => {
        gsap.set(spine, { scaleY: 1 });
        gsap.set("[data-timeline-dot]", { opacity: 1, scale: 1 });
      });

      mm.add(`not ${REDUCED_MOTION_QUERY}`, () => {
        gsap.fromTo(
          spine,
          { scaleY: 0 },
          {
            scaleY: 1,
            transformOrigin: "top",
            ease: "none",
            scrollTrigger: {
              trigger: spine,
              start: "top 80%",
              end: "bottom 60%",
              scrub: 0.6,
            },
          },
        );

        gsap.from("[data-timeline-dot]", {
          opacity: 0,
          scale: 0,
          duration: 0.5,
          ease: ease.pop,
          stagger: 0.1,
          scrollTrigger: { trigger: spine, start: "top 70%" },
        });

        gsap.from("[data-timeline-entry]", {
          opacity: 0,
          y: 24,
          duration: 0.6,
          ease: ease.entrance,
          stagger: 0.1,
          scrollTrigger: { trigger: spine, start: "top 75%" },
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section id="experience" ref={sectionRef} className="w-full bg-bg py-14 md:py-[140px]">
      <div className="mx-5 md:mx-[120px] flex flex-col gap-6 md:gap-24">
        <div className="flex flex-col gap-2 md:gap-3 md:w-[599px]">
          <SectionEyebrow>03 — EXPERIENCE</SectionEyebrow>
          <SectionHeading>Where I&apos;ve worked</SectionHeading>
          <p className="font-mono text-[10px] md:text-[11px] text-text-muted">
            ◆ GSAP ScrollTrigger — the spine line draws downward as you scroll, dot pulses on entry
          </p>
        </div>

        <div className="flex gap-4 md:gap-10 pl-1.5 md:pl-0">
          <div className="relative w-2.5 md:w-6 shrink-0">
            <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-border-glow md:bg-border-glow" />
            <div
              ref={spineFillRef}
              className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-violet md:bg-violet"
            />
          </div>

          <div className="flex flex-1 flex-col gap-10">
            {ENTRIES.map((entry) => (
              <div key={entry.role} data-timeline-entry className="flex flex-col gap-2 md:gap-2.5">
                <div className="flex items-center gap-2">
                  <span data-timeline-dot className="h-[7px] w-[7px] rounded-full bg-violet md:hidden" />
                  <span className="font-mono text-[11px] text-text-muted">{entry.dates}</span>
                </div>
                <h3 className="font-display text-[19px] md:text-[24px] font-semibold tracking-[-0.5px] text-text-primary">
                  <span className="md:hidden block">{entry.role}</span>
                  <span className="hidden md:inline">
                    {entry.role} · {entry.company}
                  </span>
                </h3>
                <span className="md:hidden font-mono text-[12px] text-cyan">{entry.company}</span>
                <p className="font-body text-[14px] md:text-[15px] leading-[1.55] text-text-secondary md:w-[640px]">
                  {entry.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <DetailCta href="/experience" route="/experience" />
      </div>
    </section>
  );
}
