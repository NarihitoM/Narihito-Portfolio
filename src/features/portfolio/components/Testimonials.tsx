"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { Draggable, gsap, registerGsap, REDUCED_MOTION_QUERY } from "@/shared/lib/gsap";
import { SectionEyebrow, SectionHeading } from "@/shared/components/ui/SectionHeading";
import { DetailCta } from "@/shared/components/ui/DetailCta";

const TESTIMONIALS = [
  {
    quote:
      "Rare to find someone who cares equally about the API contract and the easing curve on a modal.",
    name: "Mei Tanaka",
    role: "Product Lead, Northwind Labs",
  },
  {
    quote: "Shipped our real-time layer two weeks early and it hasn't needed a hotfix since.",
    name: "Daniel Osei",
    role: "CTO, Fieldstone",
  },
  {
    quote: "The kind of engineer who leaves a codebase better than a design system.",
    name: "Priya Nair",
    role: "Design Director, Loop & Co.",
  },
];

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useGSAP(
    () => {
      registerGsap();
      const track = trackRef.current;
      if (!track) return;

      const reduced = window.matchMedia(REDUCED_MOTION_QUERY).matches;
      if (reduced) return;

      const cards = gsap.utils.toArray<HTMLElement>("[data-testimonial-card]", track);
      if (cards.length === 0) return;

      const cardWidth = cards[0].offsetWidth + 24;
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
    { scope: sectionRef, dependencies: [] },
  );

  return (
    <section id="testimonials" ref={sectionRef} className="w-full bg-bg py-14 md:py-[140px] overflow-hidden">
      <div className="mx-5 md:mx-[120px] flex flex-col gap-2 md:gap-3 mb-6 md:mb-24">
        <SectionEyebrow>05 — WORDS</SectionEyebrow>
        <div className="flex flex-col gap-2.5 md:flex-row md:items-end md:justify-between">
          <SectionHeading>What people say</SectionHeading>
          <p className="font-mono text-[10px] md:text-[11px] text-text-muted max-w-[360px]">
            <span className="hidden md:inline">
              ◆ Horizontal drag/scroll carousel — momentum snap between cards, GSAP-driven
            </span>
            <span className="md:hidden">
              ◆ SWIPE — GSAP Draggable — Horizontal drag with momentum and snap-to-card; dots track the active
              index.
            </span>
          </p>
        </div>
      </div>

      <div className="px-5 md:px-[120px] cursor-grab active:cursor-grabbing">
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

      <div className="mx-5 md:mx-[120px] mt-6 md:mt-24">
        <DetailCta href="/testimonials" route="/testimonials" />
      </div>
    </section>
  );
}
