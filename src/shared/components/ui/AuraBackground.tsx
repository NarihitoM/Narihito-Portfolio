"use client";

import { useId } from "react";

export function AuraBackground() {
  const grainId = useId();

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="aura-layer-1" />
      <div className="aura-layer-2" />
      <div className="aura-layer-3" />
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
