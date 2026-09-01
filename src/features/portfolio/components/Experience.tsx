"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ease, gsap, registerGsap, REDUCED_MOTION_QUERY, NO_REDUCED_MOTION_QUERY } from "@/shared/lib/gsap";
import { SectionEyebrow, SectionHeading } from "@/shared/components/ui/SectionHeading";
import { DetailCta } from "@/shared/components/ui/DetailCta";
import { useExperiencePreview } from "@/features/experience/hooks/useExperiencePreview";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { ErrorState } from "@/shared/components/ui/ErrorState";

export function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const spineFillRef = useRef<HTMLDivElement>(null);
  const { entries: ENTRIES, isLoading, isError, refetch } = useExperiencePreview(10);

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

      return () => {
        mm.revert();
      };
    },
    { scope: sectionRef, dependencies: [ENTRIES, isLoading] },
  );

  return (
    <section data-snap id="experience" ref={sectionRef} className="w-full bg-bg py-12 md:py-[72px]">
      <div className="mx-5 flex flex-col gap-6 md:mx-10 lg:mx-[120px] md:gap-24">
        <div className="flex flex-col gap-2 md:max-w-[599px] md:gap-3">
          <SectionEyebrow>03 - EXPERIENCE</SectionEyebrow>
          <SectionHeading>Where I&apos;ve worked</SectionHeading>
        </div>

        <div className="flex flex-row gap-6">
          <div className="relative w-6 shrink-0">
            <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-border-glow" />
            <div
              ref={spineFillRef}
              className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-violet"
            />
          </div>

          <div className="flex flex-1 flex-col gap-10">
            {isLoading ? (
              <>
                <Skeleton className="h-[110px] w-full" />
                <Skeleton className="h-[110px] w-full" />
                <Skeleton className="h-[110px] w-full" />
              </>
            ) : isError ? (
              <ErrorState onRetry={refetch} />
            ) : (
              ENTRIES.map((entry) => (
                <div
                  key={entry.role}
                  data-timeline-entry
                  className="relative flex flex-col gap-2 md:gap-2.5"
                >
                  <span
                    data-timeline-dot
                    className="absolute left-[-42px] top-[2px] h-3 w-3 rounded-full border-[3px] border-bg bg-violet"
                  />
                  <span className="font-mono text-[11px] text-text-muted">{entry.dates}</span>

                  <h3 className="font-display text-[19px] font-semibold tracking-[-0.5px] text-text-primary md:text-[24px]">
                    <span className="md:hidden block">{entry.role}</span>
                    <span className="hidden md:inline">
                      {entry.role} · {entry.company}
                    </span>
                  </h3>
                  <span className="font-mono text-[12px] text-cyan md:hidden">{entry.company}</span>
                  <p className="font-body text-[14px] leading-[1.55] text-text-secondary md:max-w-[640px] md:text-[15px]">
                    {entry.description}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <DetailCta href="/experience" route="/experience" />
      </div>
    </section>
  );
}
