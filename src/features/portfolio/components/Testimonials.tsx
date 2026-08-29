"use client";

import { useRef, useState, useMemo, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import { Draggable, gsap, registerGsap, REDUCED_MOTION_QUERY } from "@/shared/lib/gsap";
import { SectionEyebrow, SectionHeading } from "@/shared/components/ui/SectionHeading";
import { DetailCta } from "@/shared/components/ui/DetailCta";
import { SocialIcon, socialLabel } from "@/shared/components/ui/SocialIcon";
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
      className="flex flex-col gap-[18px] md:gap-4 shrink-0 w-[306px] md:w-[384px] bg-bg-panel rounded-[4px] p-[22px] md:p-8 cursor-pointer transition-colors hover:bg-chip/40 active:bg-chip/60 select-none"
    >
      <span className="font-display text-[36px] md:text-[40px] font-normal leading-none text-violet">&ldquo;</span>
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
      <p className="font-body text-[13px] leading-[1.6] text-text-secondary line-clamp-2">{t.context}</p>
      {t.socials?.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {t.socials.map((social) => (
            <a
              key={social.type + social.url}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label={`${t.name} on ${socialLabel(social.type)}`}
              className="flex h-9 w-9 items-center justify-center rounded border border-border-glow-soft text-text-secondary transition-colors hover:border-violet hover:text-violet"
            >
              <SocialIcon type={social.type} />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { activeIndex, setActiveIndex } = useTestimonialsUI();
  const { testimonials: TESTIMONIALS, isLoading, isError, refetch } = useTestimonialsPreview(9);
  const [selected, setSelected] = useState<Testimonial | null>(null);

  const loopItems = useMemo(() => {
    if (!TESTIMONIALS.length) return [];
    return Array.from({ length: 4 }, () => TESTIMONIALS).flat();
  }, [TESTIMONIALS]);

  const updateActive = useCallback(
    (x: number, cardWidth: number) => {
      if (!TESTIMONIALS.length || !cardWidth) return;
      const progress = Math.abs(x) % (TESTIMONIALS.length * cardWidth);
      const idx = Math.round(progress / cardWidth) % TESTIMONIALS.length;
      setActiveIndex(idx);
    },
    [TESTIMONIALS.length, setActiveIndex],
  );

  useGSAP(
    () => {
      registerGsap();
      const viewport = viewportRef.current;
      const track = trackRef.current;
      if (!viewport || !track) return;
      if (TESTIMONIALS.length === 0) return;

      const reduced = window.matchMedia(REDUCED_MOTION_QUERY).matches;
      if (reduced) return;

      const cards = gsap.utils.toArray<HTMLElement>("[data-testimonial-card]", track);
      if (cards.length === 0) return;

      const gap = parseFloat(getComputedStyle(track).columnGap || "24");
      const cardWidth = cards[0].offsetWidth + gap;
      const singleWidth = TESTIMONIALS.length * cardWidth;

      gsap.set(track, { x: 0 });

      let isHovered = false;
      let isDragging = false;
      let resumeTimeout: ReturnType<typeof setTimeout> | null = null;
      let autoTween: gsap.core.Tween | null = null;

      const createTween = (fromX: number) => {
        if (autoTween) autoTween.kill();
        let normalized = fromX % singleWidth;
        if (normalized > 0) normalized -= singleWidth;
        gsap.set(track, { x: normalized });
        const remaining = singleWidth + normalized;
        const dist = remaining <= 1 ? singleWidth : remaining;
        const duration = (dist / singleWidth) * 28;
        autoTween = gsap.to(track, {
          x: normalized - dist,
          duration,
          ease: "none",
          onUpdate: () => {
            const cur = gsap.getProperty(track, "x") as number;
            updateActive(cur, cardWidth);
          },
          onComplete: () => {
            gsap.set(track, { x: 0 });
            updateActive(0, cardWidth);
            createTween(0);
          },
        });
        if (isHovered || isDragging) autoTween.pause();
      };

      createTween(0);

      const handleEnter = () => {
        isHovered = true;
        autoTween?.pause();
      };
      const handleLeave = () => {
        isHovered = false;
        if (!isDragging) {
          const cur = gsap.getProperty(track, "x") as number;
          createTween(cur);
        }
      };

      viewport.addEventListener("mouseenter", handleEnter);
      viewport.addEventListener("mouseleave", handleLeave);
      track.addEventListener("mouseenter", handleEnter);
      track.addEventListener("mouseleave", handleLeave);

      let draggable: Draggable | null = null;
      const initDraggable = () => {
        const [d] = Draggable.create(track, {
          type: "x",
          inertia: true,
          cursor: "grab",
          activeCursor: "grabbing",
          minimumMovement: 6,
          onPress: () => {
            isDragging = true;
            autoTween?.pause();
            if (resumeTimeout) clearTimeout(resumeTimeout);
          },
          onDrag: function () {
            let x = this.x;
            if (x <= -singleWidth) {
              x += singleWidth;
              gsap.set(track, { x });
              this.update();
            } else if (x > 0) {
              x -= singleWidth;
              gsap.set(track, { x });
              this.update();
            }
            updateActive(x, cardWidth);
          },
          onRelease: function () {
            const x = gsap.getProperty(track, "x") as number;
            updateActive(x, cardWidth);
          },
          onThrowComplete: function () {
            isDragging = false;
            let x = gsap.getProperty(track, "x") as number;
            let normalized = x % singleWidth;
            if (normalized > 0) normalized -= singleWidth;
            gsap.set(track, { x: normalized });
            this.update();
            updateActive(normalized, cardWidth);
            if (!isHovered) {
              resumeTimeout = setTimeout(() => createTween(normalized), 900);
            }
          },
          onDragEnd: function () {
            if (!this.isThrowing) {
              isDragging = false;
              const x = gsap.getProperty(track, "x") as number;
              let normalized = x % singleWidth;
              if (normalized > 0) normalized -= singleWidth;
              gsap.set(track, { x: normalized });
              this.update();
              if (!isHovered) {
                resumeTimeout = setTimeout(() => createTween(normalized), 900);
              }
            }
          },
        });
        draggable = d;
      };

      initDraggable();

      const onTouchStart = () => {
        isDragging = true;
        autoTween?.pause();
        if (resumeTimeout) clearTimeout(resumeTimeout);
      };
      const onTouchEnd = () => {
        if (!draggable?.isDragging && !draggable?.isThrowing) {
          isDragging = false;
          if (!isHovered) {
            const x = gsap.getProperty(track, "x") as number;
            resumeTimeout = setTimeout(() => createTween(x), 900);
          }
        }
      };
      viewport.addEventListener("touchstart", onTouchStart, { passive: true });
      viewport.addEventListener("touchend", onTouchEnd);
      viewport.addEventListener("touchcancel", onTouchEnd);

      const onWheel = (e: WheelEvent) => {
        if (Math.abs(e.deltaX) < Math.abs(e.deltaY) && Math.abs(e.deltaY) > 2) return;
        if (Math.abs(e.deltaX) < 2) return;
        autoTween?.pause();
        isDragging = true;
        if (resumeTimeout) clearTimeout(resumeTimeout);
        let x = (gsap.getProperty(track, "x") as number) - e.deltaX * 0.9;
        let normalized = x % singleWidth;
        if (normalized > 0) normalized -= singleWidth;
        gsap.set(track, { x: normalized });
        draggable?.update();
        updateActive(normalized, cardWidth);
        e.preventDefault();
        resumeTimeout = setTimeout(() => {
          isDragging = false;
          if (!isHovered) createTween(normalized);
        }, 900);
      };
      viewport.addEventListener("wheel", onWheel, { passive: false });

      let resizeTimer: ReturnType<typeof setTimeout>;
      const onResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          const newGap = parseFloat(getComputedStyle(track).columnGap || "24");
          const newCardW = (track.querySelector("[data-testimonial-card]") as HTMLElement)?.offsetWidth + newGap;
          if (!newCardW) return;
          const newSingle = TESTIMONIALS.length * newCardW;
          if (Math.abs(newSingle - singleWidth) > 4) {
            autoTween?.kill();
            draggable?.kill();
            gsap.set(track, { x: 0 });
            createTween(0);
          }
        }, 250);
      };
      window.addEventListener("resize", onResize);

      return () => {
        viewport.removeEventListener("mouseenter", handleEnter);
        viewport.removeEventListener("mouseleave", handleLeave);
        track.removeEventListener("mouseenter", handleEnter);
        track.removeEventListener("mouseleave", handleLeave);
        viewport.removeEventListener("touchstart", onTouchStart);
        viewport.removeEventListener("touchend", onTouchEnd);
        viewport.removeEventListener("touchcancel", onTouchEnd);
        viewport.removeEventListener("wheel", onWheel);
        window.removeEventListener("resize", onResize);
        if (resumeTimeout) clearTimeout(resumeTimeout);
        clearTimeout(resizeTimer);
        autoTween?.kill();
        draggable?.kill();
      };
    },
    { scope: sectionRef, dependencies: [TESTIMONIALS, loopItems.length] },
  );

  return (
    <section id="testimonials" ref={sectionRef} className="w-full bg-bg py-12 md:py-[72px] overflow-hidden">
      <div className="mx-5 md:mx-10 lg:mx-[120px] flex flex-col gap-2 md:gap-3 mb-6 md:mb-24">
        <SectionEyebrow>06 - WORDS</SectionEyebrow>
        <SectionHeading>What people say</SectionHeading>
      </div>

      <div ref={viewportRef} className="px-5 md:px-10 lg:px-[120px] cursor-grab active:cursor-grabbing overflow-hidden select-none">
        {isLoading ? (
          <div className="flex gap-3.5 md:gap-6">
            <Skeleton className="h-[220px] w-[306px] md:w-[384px] shrink-0" />
            <Skeleton className="h-[220px] w-[306px] md:w-[384px] shrink-0" />
            <Skeleton className="h-[220px] w-[306px] md:w-[384px] shrink-0" />
          </div>
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : (
          <div ref={trackRef} className="flex gap-3.5 md:gap-6 w-max will-change-transform">
            {loopItems.map((t, i) => (
              <TestimonialCard key={`${t.name}-${i}`} t={t} onSelect={() => setSelected(t)} />
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-[7px] px-5 pt-4 md:px-10 lg:px-[120px]">
        {TESTIMONIALS.map((t, index) => (
          <span
            key={t.name}
            className={index === activeIndex ? "h-1.5 w-[18px] rounded-full bg-violet" : "h-1.5 w-1.5 rounded-full bg-text-muted"}
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
