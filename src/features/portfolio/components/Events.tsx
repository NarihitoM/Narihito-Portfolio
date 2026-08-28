"use client";

import { useRef } from "react";
import { SectionEyebrow, SectionHeading } from "@/shared/components/ui/SectionHeading";
import { DetailCta } from "@/shared/components/ui/DetailCta";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { ErrorState } from "@/shared/components/ui/ErrorState";
import { useScrollReveal } from "@/features/portfolio/hooks/useScrollReveal";
import { useEvents } from "@/features/events/hooks/useEvents";
import { useEventsUI } from "@/features/events/store/eventsUIStore";
import { EventCard } from "@/features/events/components/EventCard";
import { EventDialog } from "@/features/events/components/EventDialog";

export function Events() {
  const sectionRef = useRef<HTMLElement>(null);
  const { events, isLoading, isError, refetch } = useEvents(4);
  const { selectedEventId, setSelectedEventId } = useEventsUI();
  const selected = events.find((event) => event.id === selectedEventId) ?? null;
  useScrollReveal(sectionRef, {
    selector: "[data-event-card]",
    y: 30,
    staggerAmount: 0.08,
    dependencies: [events, isLoading],
  });

  if (!isLoading && !isError && events.length === 0) return null;

  return (
    <section id="events" ref={sectionRef} className="w-full bg-bg py-12 md:py-[72px]">
      <div className="mx-5 md:mx-10 lg:mx-[120px] flex flex-col gap-6 md:gap-24">
        <div className="flex flex-col gap-2 md:gap-3">
          <SectionEyebrow>05 - EVENTS</SectionEyebrow>
          <SectionHeading>Events &amp; hackathons</SectionHeading>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-7">
            <Skeleton className="h-[320px] w-full" />
            <Skeleton className="h-[320px] w-full" />
          </div>
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-7">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}

        <DetailCta href="/events" route="/events" />
      </div>

      {selected && <EventDialog event={selected} onClose={() => setSelectedEventId(null)} />}
    </section>
  );
}
