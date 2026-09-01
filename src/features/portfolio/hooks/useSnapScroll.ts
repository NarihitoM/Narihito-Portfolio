"use client";

import { useEffect, useRef } from "react";
import { Observer, registerGsap } from "@/shared/lib/gsap";
import { getLenisInstance } from "@/shared/lib/lenis";

const SNAP_SELECTOR = "[data-snap]";
const LAPTOP_QUERY = "(min-width: 1024px)";
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

export function useSnapScroll(enabled = true) {
  const animatingRef = useRef(false);
  const indexRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;
    registerGsap();

    const isLaptop = window.matchMedia(LAPTOP_QUERY).matches;
    const reduced = window.matchMedia(REDUCED_QUERY).matches;
    if (!isLaptop || reduced) return;

    const sections = Array.from(document.querySelectorAll<HTMLElement>(SNAP_SELECTOR));
    if (sections.length < 2) return;

    const getCurrentIndex = () => {
      const y = window.scrollY + window.innerHeight * 0.35;
      let idx = 0;
      for (let i = 0; i < sections.length; i++) {
        if (sections[i].offsetTop <= y) idx = i;
      }
      return idx;
    };

    indexRef.current = getCurrentIndex();

    const goTo = (next: number) => {
      if (animatingRef.current) return;
      const clamped = Math.max(0, Math.min(sections.length - 1, next));
      if (clamped === indexRef.current) return;
      animatingRef.current = true;
      indexRef.current = clamped;
      const target = sections[clamped];
      const lenis = getLenisInstance();
      if (lenis) {
        lenis.scrollTo(target, { offset: 0 });
      } else {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      window.setTimeout(() => {
        animatingRef.current = false;
      }, 900);
    };

    const onResize = () => {
      indexRef.current = getCurrentIndex();
    };
    window.addEventListener("resize", onResize);

    const onScroll = () => {
      if (animatingRef.current) return;
      indexRef.current = getCurrentIndex();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const observer = Observer.create({
      type: "wheel,touch",
      wheelSpeed: -1,
      tolerance: 10,
      preventDefault: true,
      onUp: () => goTo(indexRef.current + 1),
      onDown: () => goTo(indexRef.current - 1),
      onPress: () => {
        indexRef.current = getCurrentIndex();
      },
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        goTo(indexRef.current + 1);
      }
      if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        goTo(indexRef.current - 1);
      }
      if (e.key === "Home") {
        e.preventDefault();
        goTo(0);
      }
      if (e.key === "End") {
        e.preventDefault();
        goTo(sections.length - 1);
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKeyDown);
      observer.kill();
    };
  }, [enabled]);
}
