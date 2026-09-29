"use client";

import { useRef } from "react";
import { SectionEyebrow, SectionHeading } from "@/shared/components/ui/SectionHeading";
import { DetailCta } from "@/shared/components/ui/DetailCta";
import { ErrorState } from "@/shared/components/ui/ErrorState";
import { useScrollReveal } from "@/features/portfolio/hooks/useScrollReveal";
import { useEvents } from "@/features/events/hooks/useEvents";
import { useEventsUI } from "@/features/events/store/eventsUIStore";
import { EventCard, EventCardSkeleton } from "@/features/events/components/EventCard";
import { EventDialog } from "@/features/events/components/EventDialog";
import { Carousel } from "./Carousel";

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

  const cta = <DetailCta href="/events" route="/events" />;

  return (
    <section id="events" ref={sectionRef} className="w-full py-12 md:py-[72px]">
      <div className="mx-5 md:mx-10 lg:mx-[120px] flex flex-col gap-6 md:gap-24">
        <div className="flex flex-col gap-2 md:gap-3">
          <SectionEyebrow>05 - EVENTS</SectionEyebrow>
          <SectionHeading>Events &amp; hackathons</SectionHeading>
        </div>

        {isLoading ? (
          <Carousel label="Events" action={cta}>
            {[0, 1, 2].map((i) => (
              <EventCardSkeleton key={i} />
            ))}
          </Carousel>
        ) : isError ? (
          <>
            <ErrorState onRetry={refetch} />
            {cta}
          </>
        ) : (
          <Carousel label="Events" action={cta}>
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </Carousel>
        )}
      </div>

      {selected && <EventDialog event={selected} onClose={() => setSelectedEventId(null)} />}
    </section>
  );
}
