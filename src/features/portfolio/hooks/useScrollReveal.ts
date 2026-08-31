"use client";

import { useGSAP } from "@gsap/react";
import type { RefObject } from "react";
import {
  ease,
  gsap,
  registerGsap,
  stagger,
  REDUCED_MOTION_QUERY,
  NO_REDUCED_MOTION_QUERY,
} from "@/shared/lib/gsap";

type RevealOptions = {
  selector?: string;
  y?: number;
  staggerAmount?: number;
  delay?: number;
  dependencies?: unknown[];
};

export function useScrollReveal(
  scope: RefObject<HTMLElement | null>,
  { selector = "[data-reveal]", y = 24, staggerAmount = stagger.default, delay = 0, dependencies = [] }: RevealOptions = {},
) {
  useGSAP(
    () => {
      registerGsap();
      const el = scope.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add(REDUCED_MOTION_QUERY, () => {
        gsap.set(selector, { opacity: 1, y: 0 });
      });

      mm.add(NO_REDUCED_MOTION_QUERY, () => {
        gsap.fromTo(selector, { opacity: 0, y }, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: ease.entrance,
          stagger: staggerAmount,
          delay,
          scrollTrigger: {
            trigger: el,
            once: true,
          },
        });
      });

      return () => {
        mm.revert();
      };
    },
    { scope, dependencies },
  );
}
