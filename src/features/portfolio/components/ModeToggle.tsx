"use client";

import { useRef } from "react";
import { gsap, ease, registerGsap } from "@/shared/lib/gsap";
import { useTheme } from "@/shared/hooks/useTheme";

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => { ready: Promise<void> };
};

export function ModeToggle() {
  const { theme, toggleTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleRef = useRef<HTMLDivElement | null>(null);

  const runRippleFallback = (x: number, y: number) => {
    registerGsap();
    rippleRef.current?.remove();

    const size = 220;
    const ripple = document.createElement("div");
    ripple.style.cssText = `position:fixed;left:${x - size / 2}px;top:${y - size / 2}px;width:${size}px;height:${size}px;border-radius:50%;z-index:200;pointer-events:none;background:currentColor;color:var(--color-text-primary);opacity:0.35;transform:scale(0);will-change:transform,opacity;`;
    document.body.appendChild(ripple);
    rippleRef.current = ripple;

    toggleTheme();

    gsap.to(ripple, {
      scale: 1,
      opacity: 0,
      duration: 0.6,
      ease: ease.wipe,
      onComplete: () => {
        ripple.remove();
        if (rippleRef.current === ripple) rippleRef.current = null;
      },
    });
  };

  const handleClick = () => {
    const button = buttonRef.current;
    const doc = document as ViewTransitionDocument;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!button || reducedMotion) {
      toggleTheme();
      return;
    }

    const rect = button.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    if (!doc.startViewTransition) {
      runRippleFallback(x, y);
      return;
    }

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const transition = doc.startViewTransition(() => {
      toggleTheme();
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`] },
        { duration: 500, easing: "ease-in-out", pseudoElement: "::view-transition-new(root)" },
      );
    });
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleClick}
      aria-label="Toggle color theme"
      suppressHydrationWarning
      className="flex h-8 w-8 md:h-8 md:w-8 items-center justify-center rounded-full bg-bg-panel-solid text-text-primary transition-[color,transform] duration-300 active:scale-90"
    >
      {theme === "dark" ? (
        <svg key="dark" className="theme-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
        </svg>
      ) : (
        <svg key="light" className="theme-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      )}
    </button>
  );
}
