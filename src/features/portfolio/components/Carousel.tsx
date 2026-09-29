"use client";

import {
  Children,
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { REDUCED_MOTION_QUERY } from "@/shared/lib/gsap";

function slideStep(track: HTMLElement) {
  const slide = track.firstElementChild as HTMLElement | null;
  return slide ? slide.offsetWidth + (parseFloat(getComputedStyle(track).columnGap) || 0) : 0;
}

function scrollBehavior(): ScrollBehavior {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches ? "auto" : "smooth";
}

export function Carousel({ label, action, children }: { label: string; action?: ReactNode; children: ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const draggedRef = useRef(false);
  const settleRef = useRef(0);
  const dotsRef = useRef<HTMLDivElement>(null);
  const scrubRef = useRef(-1);
  const [position, setPosition] = useState({ active: 0, pages: 1 });
  const slides = Children.toArray(children);
  const scrollable = position.pages > 1;

  const update = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const step = slideStep(track);
    if (!step) return;

    const pages = Math.round((track.scrollWidth - track.clientWidth) / step) + 1;
    const active = Math.min(pages - 1, Math.round(track.scrollLeft / step));
    setPosition((prev) => (prev.active === active && prev.pages === pages ? prev : { active, pages }));
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new ResizeObserver(update);
    observer.observe(track);
    return () => observer.disconnect();
  }, [update, slides.length]);

  const scrollToPage = (page: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: Math.max(0, page) * slideStep(track), behavior: scrollBehavior() });
  };

  const scrubTo = (clientX: number) => {
    const dots = dotsRef.current;
    if (!dots) return;
    let nearest = 0;
    let best = Infinity;
    Array.from(dots.children).forEach((dot, page) => {
      const rect = dot.getBoundingClientRect();
      const distance = Math.abs(rect.left + rect.width / 2 - clientX);
      if (distance < best) {
        best = distance;
        nearest = page;
      }
    });
    if (nearest === scrubRef.current) return;
    scrubRef.current = nearest;
    scrollToPage(nearest);
  };

  const onDotsPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    scrubRef.current = -1;
    scrubTo(event.clientX);
  };

  const onDotsPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) scrubTo(event.clientX);
  };

  const settle = () => {
    window.clearTimeout(settleRef.current);
    settleRef.current = window.setTimeout(() => {
      settleRef.current = 0;
      if (trackRef.current) trackRef.current.style.scrollSnapType = "";
    }, 150);
  };

  const onScroll = () => {
    update();
    if (settleRef.current) settle();
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    draggedRef.current = false;
    const track = trackRef.current;
    if (event.pointerType !== "mouse" || event.button !== 0 || !track) return;
    dragRef.current = { x: event.clientX, left: track.scrollLeft, moved: false };
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const track = trackRef.current;
    if (!drag || !track) return;
    if (event.buttons !== 1) {
      dragRef.current = null;
      return;
    }

    const dx = event.clientX - drag.x;
    if (!drag.moved) {
      if (Math.abs(dx) < 6) return;
      drag.moved = true;
      window.clearTimeout(settleRef.current);
      settleRef.current = 0;
      track.setPointerCapture(event.pointerId);
      track.style.scrollSnapType = "none";
    }
    track.scrollLeft = drag.left - dx;
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const track = trackRef.current;
    dragRef.current = null;
    if (!drag?.moved || !track) return;

    draggedRef.current = true;
    scrollToPage(Math.round(track.scrollLeft / slideStep(track) + Math.sign(drag.x - event.clientX) * 0.4));
    settle();
  };

  const onClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (!draggedRef.current) return;
    draggedRef.current = false;
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div role="region" aria-roledescription="carousel" aria-label={label} className="flex flex-col">
      <div
        ref={trackRef}
        onScroll={onScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
        onDragStart={(event) => event.preventDefault()}
        data-lenis-prevent-horizontal
        className="no-scrollbar -mx-2 -my-3 flex cursor-grab snap-x snap-mandatory gap-4 md:gap-7 overflow-x-auto overscroll-x-contain px-2 py-3 scroll-px-2 select-none active:cursor-grabbing"
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${slides.length}`}
            className={`grid shrink-0 snap-start ${slides.length > 1 ? "w-[85%] md:w-[calc((100%_-_1.75rem)/2)]" : "w-full"}`}
          >
            {slide}
          </div>
        ))}
      </div>

      {scrollable && (
        <div
          ref={dotsRef}
          onPointerDown={onDotsPointerDown}
          onPointerMove={onDotsPointerMove}
          className="flex touch-none items-center justify-center gap-[7px] pt-2"
        >
          {Array.from({ length: position.pages }, (_, page) => (
            <button
              key={page}
              type="button"
              aria-label={`Go to ${label} ${page + 1}`}
              aria-current={page === position.active}
              onClick={() => scrollToPage(page)}
              className="group cursor-pointer py-2"
            >
              <span
                className={`block h-1.5 rounded-full transition-[width,background-color] duration-300 ${page === position.active ? "w-[18px] bg-violet" : "w-1.5 bg-text-muted group-hover:bg-violet"}`}
              />
            </button>
          ))}
        </div>
      )}

      {action && <div className="mt-6 md:mt-24">{action}</div>}
    </div>
  );
}
