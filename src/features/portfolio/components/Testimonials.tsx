"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { Draggable, gsap, registerGsap, REDUCED_MOTION_QUERY } from "@/shared/lib/gsap";
import { SectionEyebrow, SectionHeading } from "@/shared/components/ui/SectionHeading";
import { DetailCta } from "@/shared/components/ui/DetailCta";
import { useTestimonialsPreview } from "@/features/testimonials/hooks/useTestimonialsPreview";
import { useTestimonialsUI } from "@/features/testimonials/store/testimonialsUIStore";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { ErrorState } from "@/shared/components/ui/ErrorState";
import { TestimonialDialog } from "@/features/testimonials/components/TestimonialDialog";
import { useTilt } from "@/shared/hooks/useTilt";
import type { Testimonial } from "@/features/testimonials/types/types";

function TestimonialCard({ t, onSelect }: { t: Testimonial; onSelect: () => void }) {
  const { ref: tiltRef, style: tiltStyle, onMouseMove, onMouseLeave, onTouchStart, onTouchEnd } = useTilt<HTMLDivElement>();

  return (
    <div
      data-testimonial-card
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect();
      }}
      ref={tiltRef}
      style={tiltStyle}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className="flex flex-col gap-[18px] md:gap-4 shrink-0 w-[306px] md:w-[384px] bg-bg-panel rounded-[4px] p-[22px] md:p-8 cursor-pointer transition-colors hover:bg-chip/40 active:bg-chip/60"
    >
      <span className="font-display text-[36px] md:text-[40px] font-normal leading-none text-violet">
        &ldquo;
      </span>
      <p className="font-body text-[15px] leading-[1.55] text-text-primary line-clamp-3">{t.quote}</p>
      <div className="flex items-center gap-3">
        {t.profilePic ? (
          <img src={t.profilePic} alt={t.name} className="h-9 w-9 shrink-0 rounded-full object-cover" />
        ) : (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-chip font-mono text-[12px] font-medium text-text-primary">
            {t.initials}
          </div>
        )}
        <div className="flex flex-col gap-[3px]">
          <span className="font-mono text-[13px] text-cyan">{t.name}</span>
          <span className="font-body text-[12px] text-text-muted">{t.role}</span>
        </div>
      </div>
      <p className="font-body text-[13px] leading-[1.6] text-text-secondary line-clamp-2">
        {t.context}
      </p>
    </div>
  );
}

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { activeIndex, setActiveIndex } = useTestimonialsUI();
  const { testimonials: TESTIMONIALS, isLoading, isError, refetch } = useTestimonialsPreview(9);
  const [selected, setSelected] = useState<Testimonial | null>(null);

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
        <SectionEyebrow>06 - WORDS</SectionEyebrow>
        <SectionHeading>What people say</SectionHeading>
      </div>

      <div className="px-5 md:px-10 lg:px-[120px] cursor-grab active:cursor-grabbing">
        {isLoading ? (
          <div className="flex gap-3.5 md:gap-6">
            <Skeleton className="h-[220px] w-[306px] md:w-[384px] shrink-0" />
            <Skeleton className="h-[220px] w-[306px] md:w-[384px] shrink-0" />
            <Skeleton className="h-[220px] w-[306px] md:w-[384px] shrink-0" />
          </div>
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : (
          <div ref={trackRef} className="flex gap-3.5 md:gap-6">
            {TESTIMONIALS.map((t) => (
              <TestimonialCard key={t.name} t={t} onSelect={() => setSelected(t)} />
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-[7px] px-5 pt-4 md:px-10 lg:px-[120px]">
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

      {selected && <TestimonialDialog testimonial={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
