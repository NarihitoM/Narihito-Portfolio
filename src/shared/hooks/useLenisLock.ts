"use client";

import { useEffect } from "react";
import { getLenisInstance } from "@/shared/lib/lenis";

export function useLenisLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const lenis = getLenisInstance();
    lenis?.stop();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
      lenis?.start();
    };
  }, [locked]);
}
