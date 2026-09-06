"use client";

import { useEffect } from "react";
import { getLenisInstance } from "@/shared/lib/lenis";

let lockCount = 0;
let prevOverflow = "";

export function useLenisLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    lockCount += 1;
    if (lockCount === 1) {
      prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      getLenisInstance()?.stop();
    }
    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) {
        document.body.style.overflow = prevOverflow;
        getLenisInstance()?.start();
      }
    };
  }, [locked]);
}
