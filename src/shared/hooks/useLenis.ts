"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, registerGsap } from "@/shared/lib/gsap";
import { setLenisInstance } from "@/shared/lib/lenis";

export function useLenis() {
  useEffect(() => {
    registerGsap();

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const lenis = new Lenis({
      autoRaf: false,
    });

    setLenisInstance(lenis);
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(500, 33);

    let lastHeight = document.body.scrollHeight;
    let pending = 0;
    let refreshPending = 0;

    const syncScrollHeight = () => {
      if (pending) return;
      pending = requestAnimationFrame(() => {
        pending = 0;
        const height = document.body.scrollHeight;
        if (height === lastHeight) return;
        lastHeight = height;
        lenis.resize();
        if (refreshPending) return;
        refreshPending = window.setTimeout(() => {
          refreshPending = 0;
          ScrollTrigger.refresh();
        }, 150);
      });
    };

    const observer = new ResizeObserver(syncScrollHeight);
    observer.observe(document.body);

    return () => {
      if (pending) cancelAnimationFrame(pending);
      if (refreshPending) clearTimeout(refreshPending);
      observer.disconnect();
      gsap.ticker.remove(tick);
      setLenisInstance(null);
      lenis.destroy();
    };
  }, []);
}
