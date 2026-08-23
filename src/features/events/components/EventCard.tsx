"use client";

import { useTilt } from "@/shared/hooks/useTilt";
import { useEventsUI } from "../store/eventsUIStore";
import type { Event } from "../types/types";

export function EventCard({ event }: { event: Event }) {
  const tilt = useTilt<HTMLDivElement>();
  const setSelectedEventId = useEventsUI((s) => s.setSelectedEventId);

  return (
    <div
      data-event-card
      role="button"
      tabIndex={0}
      onClick={() => setSelectedEventId(event.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") setSelectedEventId(event.id);
      }}
      ref={tilt.ref}
      style={tilt.style}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      onTouchStart={tilt.onTouchStart}
      onTouchEnd={tilt.onTouchEnd}
      className="flex cursor-pointer flex-col overflow-hidden rounded-[6px] border border-border-glow-soft bg-surface transition-colors hover:border-border-glow"
    >
      {event.image ? (
        <img
          src={event.image}
          alt={event.title}
          className="h-[180px] md:h-[220px] w-full object-cover"
        />
      ) : (
        <div className="h-[180px] md:h-[220px] w-full bg-chip" />
      )}

      <div className="flex flex-col gap-2.5 p-5 md:p-6">
        <span className="font-mono text-[11px] font-medium tracking-[2px] text-violet">
          {event.duration}
        </span>
        <h3 className="font-display text-[20px] md:text-[24px] font-semibold leading-[1.2] tracking-[-0.5px] text-text-primary">
          {event.title}
        </h3>
        <p className="font-body text-[14px] md:text-[15px] leading-[1.6] text-text-secondary line-clamp-3">
          {event.description}
        </p>
      </div>
    </div>
  );
}
