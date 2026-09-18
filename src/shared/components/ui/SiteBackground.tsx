"use client";

import { useId, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap, NO_REDUCED_MOTION_QUERY } from "@/shared/lib/gsap";

export function SiteBackground() {
  const grainId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();

      const mm = gsap.matchMedia();

      mm.add(NO_REDUCED_MOTION_QUERY, () => {
        const tween = gsap.to(".site-aura-parallax", {
          yPercent: (index) => (index === 0 ? 12 : -10),
          ease: "none",
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.2,
          },
        });

        return () => tween.kill();
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="aura-layer-1" />
      <div className="aura-layer-2 site-aura-parallax" />
      <div className="aura-layer-3 site-aura-parallax" />
      <div className="aura-grain">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <filter id={grainId}>
            <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix
              type="matrix"
              values="0.181 0.608 0.061 0 0.075
                      0.181 0.608 0.061 0 0.075
                      0.181 0.608 0.061 0 0.075
                      0     0     0     1 0"
            />
          </filter>
          <rect width="100%" height="100%" filter={`url(#${grainId})`} />
        </svg>
      </div>
    </div>
  );
}
