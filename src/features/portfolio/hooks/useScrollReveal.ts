"use client";

import { useGSAP } from "@gsap/react";
import type { RefObject } from "react";
import {
  ease,
  gsap,
  registerGsap,
  ScrollTrigger,
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

      const targets = Array.from(el.querySelectorAll<HTMLElement>(selector));
      if (!targets.length) return;

      mm.add(REDUCED_MOTION_QUERY, () => {
        gsap.set(targets, { opacity: 1, y: 0 });
      });

      mm.add(NO_REDUCED_MOTION_QUERY, () => {
        gsap.set(targets, { opacity: 0, y });
        ScrollTrigger.batch(targets, {
          start: "top 88%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: ease.entrance,
              stagger: staggerAmount,
              delay,
              overwrite: true,
            }),
        });
      });

      return () => {
        mm.revert();
      };
    },
    { scope, dependencies },
  );
}
