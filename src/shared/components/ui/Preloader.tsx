"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ease, gsap, registerGsap, ScrollTrigger } from "@/shared/lib/gsap";

const TAGLINE = "Full-Stack & Agentic AI Developer";
const TYPE_MS = 50;
const BAR_MS = 2000;

export function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);
  const [typed, setTyped] = useState(TAGLINE.slice(0, 1));
  const typingDone = typed.length === TAGLINE.length;

  useEffect(() => {
    let i = 1;
    const tick = () => {
      i += 1;
      setTyped(TAGLINE.slice(0, i));
      if (i < TAGLINE.length) id = window.setTimeout(tick, TYPE_MS);
    };
    let id = window.setTimeout(tick, TYPE_MS);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (done) return;
    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      window.scrollTo(0, scrollY);
    };
  }, [done]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !typingDone) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      requestAnimationFrame(() => {
        setDone(true);
      });
      return;
    }

    const finish = () => {
      registerGsap();
      gsap.to(root, {
        yPercent: -100,
        duration: 0.7,
        ease: ease.entrance,
        onComplete: () => {
          setDone(true);
          ScrollTrigger.refresh();
        },
      });
    };

    const fallback = window.setTimeout(finish, BAR_MS + 300);

    return () => {
      window.clearTimeout(fallback);
    };
  }, [typingDone]);

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
            src="/img/Narihito.jpg"
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
        <span className="font-mono text-[10px] font-light tracking-[2px] text-violet uppercase after:ml-0.5 after:animate-pulse after:content-['|']">
          {typed}
        </span>
      </div>

      <div className="flex h-[36px] w-70 flex-col gap-4">
        {typed.length === TAGLINE.length && (
          <>
            <div className="h-px w-full overflow-hidden bg-border-glow-soft">
              <span className="preload-bar block h-full w-full origin-left bg-text-primary" />
            </div>
            <div className="relative h-4 w-full">
              <span className="preload-counter absolute top-0 left-0 -translate-x-1/2 font-mono text-[11px] tracking-[2px] whitespace-nowrap text-text-secondary" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
