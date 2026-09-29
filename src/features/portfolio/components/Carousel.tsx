"use client";

import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { REDUCED_MOTION_QUERY } from "@/shared/lib/gsap";

const NAV_BUTTON =
  "flex h-10 w-10 items-center justify-center rounded border border-border-glow-soft text-text-secondary transition-[color,border-color,transform] hover:border-violet hover:text-violet active:scale-95 disabled:pointer-events-none disabled:opacity-40";

export function Carousel({ label, children }: { label: string; children: ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: true });
  const slides = Children.toArray(children);

  const update = useCallback(() => {
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!track || !thumb) return;

    const { scrollLeft, scrollWidth, clientWidth } = track;
    thumb.style.width = `${(clientWidth / scrollWidth) * 100}%`;
    thumb.style.transform = `translateX(${(scrollLeft / clientWidth) * 100}%)`;

    const start = scrollLeft <= 1;
    const end = scrollLeft >= scrollWidth - clientWidth - 1;
    setEdges((prev) => (prev.start === start && prev.end === end ? prev : { start, end }));
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new ResizeObserver(update);
    observer.observe(track);
    return () => observer.disconnect();
  }, [update, slides.length]);

  const go = (direction: 1 | -1) => {
    const track = trackRef.current;
    const slide = track?.firstElementChild as HTMLElement | null;
    if (!track || !slide) return;

    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollBy({
      left: direction * (slide.offsetWidth + gap),
      behavior: window.matchMedia(REDUCED_MOTION_QUERY).matches ? "auto" : "smooth",
    });
  };

  const scrollable = !(edges.start && edges.end);

  return (
    <div role="region" aria-roledescription="carousel" aria-label={label} className="flex flex-col gap-5 md:gap-8">
      <div
        ref={trackRef}
        onScroll={update}
        data-lenis-prevent-horizontal
        className="no-scrollbar -mx-2 -my-3 flex snap-x snap-mandatory gap-4 md:gap-7 overflow-x-auto overscroll-x-contain px-2 py-3 scroll-px-2"
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${slides.length}`}
            className="grid w-[85%] shrink-0 snap-start md:w-[calc((100%_-_1.75rem)/2)]"
          >
            {slide}
          </div>
        ))}
      </div>

      <div aria-hidden={!scrollable} className={`flex items-center justify-between gap-6 ${scrollable ? "" : "invisible"}`}>
        <div className="relative h-0.5 w-full max-w-[240px] overflow-hidden rounded-full bg-border-glow">
          <div ref={thumbRef} className="absolute inset-y-0 left-0 rounded-full bg-violet" />
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button type="button" aria-label={`Previous ${label}`} disabled={edges.start} onClick={() => go(-1)} className={NAV_BUTTON}>
            <ArrowLeft size={16} />
          </button>
          <button type="button" aria-label={`Next ${label}`} disabled={edges.end} onClick={() => go(1)} className={NAV_BUTTON}>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
