"use client";

import { useEffect, type ReactNode } from "react";
import { useLenis } from "@/shared/hooks/useLenis";
import { ScrollTrigger } from "@/shared/lib/gsap";
import { scrollToTarget } from "@/shared/lib/lenis";

const HEADER_OFFSET = -72;

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useLenis();

  useEffect(() => {
    if (document.fonts) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();

        const hash = window.location.hash;
        if (hash && document.querySelector(hash)) {
          scrollToTarget(hash, HEADER_OFFSET);
        }
      });
    }
  }, []);

  return <>{children}</>;
}
