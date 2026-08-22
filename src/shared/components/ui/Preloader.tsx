"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ease, gsap, registerGsap, ScrollTrigger } from "@/shared/lib/gsap";

const FALLBACK_MS = 2600;

export function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const counter = counterRef.current;
    if (!root || !counter) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      requestAnimationFrame(() => setDone(true));
      return;
    }

    document.body.style.overflow = "hidden";

    let cancelled = false;

    const finish = () => {
      if (cancelled) return;
      cancelled = true;

      registerGsap();
      gsap.to(root, {
        yPercent: -100,
        duration: 0.7,
        ease: ease.entrance,
        onComplete: () => {
          document.body.style.overflow = "";
          setDone(true);
          ScrollTrigger.refresh();
        },
      });
    };

    const running = counter.getAnimations();
    if (running.length) {
      Promise.all(running.map((animation) => animation.finished))
        .then(finish)
        .catch(() => {});
    }

    const fallback = window.setTimeout(finish, FALLBACK_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(fallback);
      document.body.style.overflow = "";
    };
  }, []);

  if (done) return null;

  return (
    <div
      id="preloader"
      ref={rootRef}
      className="fixed inset-0 z-120 flex flex-col items-center justify-center gap-8 bg-bg"
    >
      <div className="flex flex-col items-center gap-5">
        <div className="h-14 w-14 overflow-hidden rounded-full md:h-16 md:w-16">
          <Image
            src="/Narihito.jpg"
            alt="Narihito"
            width={64}
            height={64}
            className="h-full w-full object-cover"
            priority
          />
        </div>
        <span className="font-display text-[28px] font-bold uppercase tracking-[6px] text-text-primary">
          NARIHITO
        </span>
        <span className="font-mono text-[10px] font-light tracking-[2px] text-violet uppercase">
          Full-Stack &amp; Agentic AI Developer
        </span>
      </div>

      <div className="flex w-70 flex-col gap-4">
        <div className="h-px w-full overflow-hidden bg-border-glow-soft">
          <span className="preload-bar block h-full w-full origin-left bg-text-primary" />
        </div>
        <div className="relative h-4 w-full">
          <span
            ref={counterRef}
            className="preload-counter absolute top-0 left-0 -translate-x-1/2 font-mono text-[11px] tracking-[2px] whitespace-nowrap text-text-secondary"
          />
        </div>
      </div>
    </div>
  );
}
