"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ease, gsap, registerGsap, REDUCED_MOTION_QUERY } from "@/shared/lib/gsap";
import { scrollToTarget } from "@/shared/lib/lenis";

export function ScrollToTop() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useGSAP(() => {
    registerGsap();
    const button = buttonRef.current;
    if (!button) return;

    const reduced = window.matchMedia(REDUCED_MOTION_QUERY).matches;
    gsap.set(button, { opacity: 0, y: 16, pointerEvents: "none" });

    const trigger = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: "top -600",
        toggleActions: "play none none reverse",
      },
    });

    trigger.to(button, {
      opacity: 1,
      y: 0,
      pointerEvents: "auto",
      duration: reduced ? 0.2 : 0.4,
      ease: ease.interaction,
    });
  }, []);

  return (
    <button
      ref={buttonRef}
      type="button"
      aria-label="Scroll back to top"
      onClick={() => scrollToTarget(0)}
      className="fixed bottom-6 right-5 md:bottom-8 md:right-8 z-40 flex h-11 w-11 md:h-12 md:w-12 items-center justify-center rounded-full bg-chip border border-border-glow-soft text-text-primary"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
