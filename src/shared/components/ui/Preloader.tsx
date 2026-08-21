"use client";

import { useEffect, useRef, useState } from "react";
import { ease, gsap, registerGsap, ScrollTrigger } from "@/shared/lib/gsap";

const SESSION_KEY = "narihito-intro-played";
const COUNT_DURATION = 1.9;

export function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const alreadyPlayed = window.sessionStorage.getItem(SESSION_KEY) !== null;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (alreadyPlayed || reduced) {
      if (rootRef.current) rootRef.current.style.display = "none";
      requestAnimationFrame(() => setDone(true));
      return;
    }

    registerGsap();

    const root = rootRef.current;
    const bar = barRef.current;
    const counter = counterRef.current;
    const wordmark = wordmarkRef.current;
    if (!root || !bar || !counter || !wordmark) return;

    document.body.style.overflow = "hidden";

    const progress = { value: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        window.sessionStorage.setItem(SESSION_KEY, "1");
        document.body.style.overflow = "";
        setDone(true);
        ScrollTrigger.refresh();
      },
    });

    tl.fromTo(
      wordmark,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.5, ease: ease.entrance },
    );

    tl.to(
      progress,
      {
        value: 100,
        duration: COUNT_DURATION,
        ease: "power2.inOut",
        onUpdate: () => {
          counter.textContent = `${String(Math.round(progress.value)).padStart(3, "0")}%`;
          bar.style.transform = `scaleX(${progress.value / 100})`;
          counter.style.left = `${progress.value}%`;
        },
      },
      "-=0.2",
    );

    tl.to([wordmark, counter], { opacity: 0, duration: 0.3, ease: "power2.in" }, "+=0.15");
    tl.to(root, { yPercent: -100, duration: 0.7, ease: ease.entrance }, "-=0.1");

    return () => {
      startedRef.current = false;
      tl.kill();
      document.body.style.overflow = "";
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-120 flex flex-col items-center justify-center gap-8 bg-bg"
    >
      <div ref={wordmarkRef} className="flex flex-col items-center gap-3">
        <span className="font-display text-[28px] font-semibold tracking-[6px] text-text-primary">
          NARIHITO
        </span>
        <span className="font-mono text-[10px] tracking-[3px] text-text-muted">
          FULL-STACK DEVELOPER
        </span>
      </div>

      <div className="flex w-[280px] flex-col gap-4">
        <div className="h-px w-full overflow-hidden bg-border-glow-soft">
          <span
            ref={barRef}
            className="block h-full w-full origin-left scale-x-0 bg-text-primary"
          />
        </div>
        <div className="relative h-4 w-full">
          <span
            ref={counterRef}
            className="absolute top-0 left-0 -translate-x-1/2 font-mono text-[11px] tracking-[2px] whitespace-nowrap text-text-secondary"
          >
            000%
          </span>
        </div>
      </div>
    </div>
  );
}
