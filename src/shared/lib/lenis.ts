import type Lenis from "lenis";
import { REDUCED_MOTION_QUERY } from "@/shared/lib/gsap";

let instance: Lenis | null = null;

export function setLenisInstance(lenis: Lenis | null) {
  instance = lenis;
}

export function scrollToTarget(target: string | number, offset = 0) {
  const reduced = typeof window !== "undefined" && window.matchMedia(REDUCED_MOTION_QUERY).matches;

  if (instance && !reduced) {
    instance.scrollTo(target, { offset });
    return;
  }

  const y =
    typeof target === "number"
      ? target
      : (document.querySelector(target)?.getBoundingClientRect().top ?? 0) + window.scrollY + offset;

  window.scrollTo({ top: y, behavior: reduced ? "auto" : "smooth" });
}
