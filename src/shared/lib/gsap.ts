import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";

let registered = false;

export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, SplitText, Draggable, InertiaPlugin);

  ScrollTrigger.defaults({
    start: "top 80%",
    end: "bottom 20%",
    toggleActions: "play none none none",
  });

  registered = true;
}

export const ease = {
  entrance: "power3.out",
  splitReveal: "power4.out",
  wipe: "power4.inOut",
  interaction: "power2.out",
  pop: "back.out(1.6)",
} as const;

export const duration = {
  press: 0.15,
  hover: 0.3,
  entrance: 0.6,
  heroReveal: 0.9,
  countUp: 1.5,
} as const;

export const stagger = {
  default: 0.06,
  dense: 0.03,
  large: 0.09,
} as const;

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
export const NO_REDUCED_MOTION_QUERY = "(prefers-reduced-motion: no-preference)";

export { gsap, ScrollTrigger, SplitText, Draggable, InertiaPlugin };
