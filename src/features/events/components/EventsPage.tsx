"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import {
  ease,
  gsap,
  registerGsap,
  REDUCED_MOTION_QUERY,
  NO_REDUCED_MOTION_QUERY,
  ScrollTrigger,
} from "@/shared/lib/gsap";
import { PageLayout } from "@/shared/components/layout/PageLayout";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { ErrorState } from "@/shared/components/ui/ErrorState";
import { Pagination } from "@/shared/components/ui/Pagination";
import { scrollToTarget } from "@/shared/lib/lenis";
import { useEventsPaged } from "../hooks/useEvents";
import { useEventsUI } from "../store/eventsUIStore";
import { EventCard } from "./EventCard";
import { EventDialog } from "./EventDialog";

export function EventsPage() {
  const contentRef = useRef<HTMLDivElement>(null);
  const leadRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const { events, total, totalPages, isLoading, isError, refetch } = useEventsPaged(page);
  const { selectedEventId, setSelectedEventId } = useEventsUI();
  const selected = events.find((event) => event.id === selectedEventId) ?? null;
  const pageMeta = [
    { key: "SOURCE", value: "NARIHITO" },
    { key: "EVENTS", value: String(total) },
    { key: "SHOWING", value: `PAGE ${page} / ${totalPages}` },
  ];

  const goToPage = (next: number) => {
    setPage(next);
    scrollToTarget("#events-grid", -100);
  };

  useGSAP(
    () => {
      registerGsap();
      const lead = leadRef.current;
      if (!lead) return;

      const mm = gsap.matchMedia();

      mm.add(REDUCED_MOTION_QUERY, () => {
        gsap.set(lead, { opacity: 1, y: 0 });
      });

      mm.add(NO_REDUCED_MOTION_QUERY, () => {
        gsap.fromTo(lead, { opacity: 0, y: 20 }, {
          opacity: 1, y: 0, duration: 0.6, ease: ease.entrance,
          scrollTrigger: { trigger: lead, once: true },
        });
      });

      return () => mm.revert();
    },
    { scope: contentRef },
  );

  useGSAP(
    () => {
      registerGsap();
      const container = cardsRef.current;
      if (!container || !container.children.length) return;

      const mm = gsap.matchMedia();

      mm.add(REDUCED_MOTION_QUERY, () => {
        gsap.set(container.children, { opacity: 1, y: 0 });
      });

      mm.add(NO_REDUCED_MOTION_QUERY, () => {
        gsap.fromTo(container.children, { opacity: 0, y: 24 }, {
          opacity: 1, y: 0, duration: 0.6, ease: ease.entrance, stagger: 0.1,
          scrollTrigger: { trigger: container, start: "top 75%", once: true },
        });
      });

      const t = window.setTimeout(() => ScrollTrigger.refresh(), 100);
      return () => { window.clearTimeout(t); mm.revert(); };
    },
    { scope: contentRef, dependencies: [events] },
  );

  return (
    <PageLayout
      backLink="Back to Home"
      backHref="/"
      breadcrumb="HOME / EVENTS"
      eyebrow="[ 05 - EVENTS ]"
      title="The rooms I showed up in, and what I took away."
      deck="Hackathons, meetups, and programs I joined, with how long each ran and what it actually taught me."
      meta={pageMeta}
      metaLoading={isLoading}
      metaError={isError}
      prev={{ direction: "← HOME", title: "Projects", href: "/projects" }}
      next={{ direction: "NEXT →", title: "Testimonials", href: "/testimonials" }}
    >
      <div ref={contentRef} className="flex flex-col gap-16">
        <p
          ref={leadRef}
          className="max-w-[960px] font-body text-[18px] md:text-[20px] lg:text-[22px] leading-[1.55] text-text-primary"
        >
          Most of what I know came from building alone, but the parts that stuck
          came from rooms full of people building at the same time. These are the
          ones worth listing.
        </p>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            <Skeleton className="h-[320px] w-full" />
            <Skeleton className="h-[320px] w-full" />
          </div>
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : events.length === 0 ? (
          <p className="font-body text-[15px] text-text-muted">No events listed yet.</p>
        ) : (
          <>
            <div
              id="events-grid"
              ref={cardsRef}
              className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6"
            >
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            <Pagination page={page} totalPages={totalPages} onChange={goToPage} />
          </>
        )}
      </div>

      {selected && <EventDialog event={selected} onClose={() => setSelectedEventId(null)} />}
    </PageLayout>
  );
}
