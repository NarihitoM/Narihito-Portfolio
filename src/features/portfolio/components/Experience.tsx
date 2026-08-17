"use client";

import { useLayoutEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ease, gsap, registerGsap, REDUCED_MOTION_QUERY, NO_REDUCED_MOTION_QUERY } from "@/shared/lib/gsap";
import { SectionEyebrow, SectionHeading } from "@/shared/components/ui/SectionHeading";
import { DetailCta } from "@/shared/components/ui/DetailCta";

const ENTRIES = [
  {
    dates: "2024 - Present",
    role: "Senior Full-Stack Engineer",
    company: "Northwind Labs",
    description:
      "Leading the rebuild of the core product on Next.js and a Node/Postgres service layer, cutting median page load by 60%.",
  },
  {
    dates: "2022 - 2024",
    role: "Full-Stack Developer",
    company: "Fieldstone",
    description:
      "Owned the design system and the API gateway; shipped real-time collaboration features used by 50k weekly users.",
  },
  {
    dates: "2020 - 2022",
    role: "Frontend Developer",
    company: "Loop & Co.",
    description:
      "Built the marketing site and internal tools, introduced motion design patterns still used across the product.",
  },
];

export function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const spineFillRef = useRef<HTMLDivElement>(null);
  const spineColRef = useRef<HTMLDivElement>(null);
  const entryRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useLayoutEffect(() => {
    const spineCol = spineColRef.current;
    if (!spineCol) return;

    const positionDots = () => {
      const spineTop = spineCol.getBoundingClientRect().top;
      entryRefs.current.forEach((entry, i) => {
        const dot = dotRefs.current[i];
        if (!entry || !dot) return;
        const dateRow = entry.querySelector("[data-entry-date]");
        const target = dateRow ?? entry;
        const rect = target.getBoundingClientRect();
        const offset = rect.top - spineTop + rect.height / 2;
        dot.style.top = `${offset}px`;
      });
    };

    positionDots();

    const observer = new ResizeObserver(positionDots);
    observer.observe(spineCol);
    entryRefs.current.forEach((entry) => entry && observer.observe(entry));

    return () => observer.disconnect();
  }, []);

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

      mm.add(NO_REDUCED_MOTION_QUERY, () => {
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
      <div className="mx-5 flex flex-col gap-6 md:mx-[120px] md:gap-24">
        <div className="flex flex-col gap-2 md:w-[599px] md:gap-3">
          <SectionEyebrow>03 - EXPERIENCE</SectionEyebrow>
          <SectionHeading>Where I&apos;ve worked</SectionHeading>
        </div>

        <div className="flex flex-col gap-10 pl-1.5 md:flex-row md:gap-10 md:pl-0">
          <div ref={spineColRef} className="relative hidden w-6 shrink-0 md:block">
            <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-border-glow" />
            <div
              ref={spineFillRef}
              className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-violet"
            />
            {ENTRIES.map((entry, index) => (
              <span
                key={entry.role}
                ref={(el) => {
                  dotRefs.current[index] = el;
                }}
                data-timeline-dot
                className="absolute left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-bg bg-violet"
              />
            ))}
          </div>

          <div className="flex flex-1 flex-col gap-10">
            {ENTRIES.map((entry, index) => (
              <div
                key={entry.role}
                ref={(el) => {
                  entryRefs.current[index] = el;
                }}
                data-timeline-entry
                className={`flex flex-col gap-2 md:gap-2.5 ${
                  index > 0 ? "md:border-t md:border-border-glow-soft md:pt-10" : ""
                }`}
              >
                <div data-entry-date className="flex items-center gap-2">
                  <span className="h-[7px] w-[7px] rounded-full bg-violet md:hidden" />
                  <span className="font-mono text-[11px] text-text-muted">{entry.dates}</span>
                </div>

                <h3 className="font-display text-[19px] font-semibold tracking-[-0.5px] text-text-primary md:text-[24px]">
                  <span className="md:hidden block">{entry.role}</span>
                  <span className="hidden md:inline">
                    {entry.role} · {entry.company}
                  </span>
                </h3>
                <span className="font-mono text-[12px] text-cyan md:hidden">{entry.company}</span>
                <p className="font-body text-[14px] leading-[1.55] text-text-secondary md:w-[640px] md:text-[15px]">
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
