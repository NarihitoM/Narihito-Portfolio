"use client";

import { useEffect, type ReactNode } from "react";
import { useLenis } from "@/shared/hooks/useLenis";
import { ScrollTrigger } from "@/shared/lib/gsap";

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useLenis();

  useEffect(() => {
    if (document.fonts) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }
  }, []);

  return <>{children}</>;
}
