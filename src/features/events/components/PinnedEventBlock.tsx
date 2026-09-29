"use client";

import { useState } from "react";
import { ImageLightbox } from "@/shared/components/ui/ImageLightbox";
import { EventMeta } from "./EventMeta";
import type { Event } from "../types/types";

export function PinnedEventBlock({ event }: { event: Event }) {
  const [zoomed, setZoomed] = useState(false);

  return (
    <div data-pinned className="flex flex-col lg:flex-row gap-8 lg:gap-14">
      <div className="flex-1">
        {event.image ? (
          <button
            type="button"
            aria-label={`View ${event.title} image`}
            onClick={() => setZoomed(true)}
            className="block h-[240px] lg:h-[320px] w-full cursor-zoom-in overflow-hidden rounded-[6px] border border-border-glow-soft bg-surface transition-colors hover:border-violet"
          >
            <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
          </button>
        ) : (
          <div className="flex h-[240px] lg:h-[320px] w-full items-center justify-center rounded-[6px] border border-border-glow-soft bg-surface">
            <span className="font-mono text-[12px] tracking-[2px] text-text-muted">{event.title}</span>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col gap-6">
        <h2 className="font-display fs-28 md:text-[34px] font-semibold leading-[1.15] tracking-[-0.8px] text-text-primary">
          {event.title}
        </h2>
        <p className="font-body fs-15 md:text-[16px] leading-[1.7] text-text-secondary">{event.description}</p>
        <EventMeta event={event} />
      </div>

      {zoomed && event.image && (
        <ImageLightbox src={event.image} alt={event.title} onClose={() => setZoomed(false)} />
      )}
    </div>
  );
}
