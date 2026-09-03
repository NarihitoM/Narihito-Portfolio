"use client";

import { useTilt } from "@/shared/hooks/useTilt";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { useEventsUI } from "../store/eventsUIStore";
import type { Event } from "../types/types";

export function EventCard({ event }: { event: Event }) {
  const { ref: tiltRef, style: tiltStyle, onMouseMove, onMouseLeave, onTouchStart, onTouchEnd } = useTilt<HTMLDivElement>();
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
      ref={tiltRef}
      style={tiltStyle}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className="flex cursor-pointer flex-col overflow-hidden rounded-[6px] border border-border-glow-soft bg-surface transition-colors hover:border-border-glow active:border-violet active:bg-chip/40"
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

export function EventCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-[6px] border border-border-glow-soft bg-surface">
      <Skeleton className="h-[180px] md:h-[220px] w-full rounded-none border-0" />
      <div className="flex flex-col gap-2.5 p-5 md:p-6">
        <Skeleton className="h-[13px] w-28" />
        <Skeleton className="h-6 md:h-7 w-4/5" />
        <Skeleton className="h-[67px] md:h-[72px] w-full" />
      </div>
    </div>
  );
}
