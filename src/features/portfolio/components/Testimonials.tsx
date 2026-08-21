"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Draggable, gsap, registerGsap, REDUCED_MOTION_QUERY } from "@/shared/lib/gsap";
import { SectionEyebrow, SectionHeading } from "@/shared/components/ui/SectionHeading";
import { DetailCta } from "@/shared/components/ui/DetailCta";
import { useTestimonialsPreview } from "@/features/testimonials/hooks/useTestimonialsPreview";
import { useTestimonialsUI } from "@/features/testimonials/store/testimonialsUIStore";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { ErrorState } from "@/shared/components/ui/ErrorState";

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { activeIndex, setActiveIndex } = useTestimonialsUI();
  const { testimonials: TESTIMONIALS, isLoading, isError, refetch } = useTestimonialsPreview(3);

  useGSAP(
    () => {
      registerGsap();
      const track = trackRef.current;
      if (!track) return;

      const reduced = window.matchMedia(REDUCED_MOTION_QUERY).matches;
      if (reduced) return;

      const cards = gsap.utils.toArray<HTMLElement>("[data-testimonial-card]", track);
      if (cards.length === 0) return;

      const trackGap = parseFloat(getComputedStyle(track).columnGap || "0");
      const cardWidth = cards[0].offsetWidth + trackGap;
      const maxX = -(cardWidth * (cards.length - 1));

      const [draggable] = Draggable.create(track, {
        type: "x",
        inertia: true,
        bounds: { minX: maxX, maxX: 0 },
        edgeResistance: 0.7,
        snap: {
          x: (value: number) => Math.round(value / cardWidth) * cardWidth,
        },
        onDrag: updateActive,
        onThrowComplete: updateActive,
      });

      function updateActive() {
        const index = Math.round(-draggable.x / cardWidth);
        setActiveIndex(Math.max(0, Math.min(cards.length - 1, index)));
      }

      return () => draggable.kill();
    },
    { scope: sectionRef, dependencies: [TESTIMONIALS] },
  );

  return (
    <section id="testimonials" ref={sectionRef} className="w-full bg-bg py-14 md:py-[140px] overflow-hidden">
      <div className="mx-5 md:mx-10 lg:mx-[120px] flex flex-col gap-2 md:gap-3 mb-6 md:mb-24">
        <SectionEyebrow>05 - WORDS</SectionEyebrow>
        <SectionHeading>What people say</SectionHeading>
      </div>

      <div className="px-5 md:px-10 lg:px-[120px] cursor-grab active:cursor-grabbing">
        {isLoading ? (
          <div className="flex gap-3.5 md:gap-6">
            <Skeleton className="h-[220px] w-[306px] md:w-[384px] shrink-0" />
            <Skeleton className="h-[220px] w-[306px] md:w-[384px] shrink-0" />
          </div>
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : (
          <div ref={trackRef} className="flex gap-3.5 md:gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                data-testimonial-card
                className="flex flex-col gap-[18px] md:gap-4 shrink-0 w-[306px] md:w-[384px] bg-bg-panel rounded-[4px] p-[22px] md:p-8"
              >
                <span className="font-display text-[36px] md:text-[40px] font-normal leading-none text-violet">
                  &ldquo;
                </span>
                <p className="font-body text-[15px] leading-[1.55] text-text-primary">{t.quote}</p>
                <div className="flex flex-col gap-[3px]">
                  <span className="font-mono text-[13px] text-cyan">{t.name}</span>
                  <span className="font-body text-[12px] text-text-muted">{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex md:hidden items-center gap-[7px] px-5 pt-4">
        {TESTIMONIALS.map((t, index) => (
          <span
            key={t.name}
            className={
              index === activeIndex
                ? "h-1.5 w-[18px] rounded-full bg-violet"
                : "h-1.5 w-1.5 rounded-full bg-text-muted"
            }
          />
        ))}
      </div>

      <div className="mx-5 md:mx-10 lg:mx-[120px] mt-6 md:mt-24">
        <DetailCta href="/testimonials" route="/testimonials" />
      </div>
    </section>
  );
}
