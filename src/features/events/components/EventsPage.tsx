"use client";

import { useRef } from "react";
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
import { ShowcaseSkeleton } from "@/shared/components/ui/ShowcaseSkeleton";
import { ErrorState } from "@/shared/components/ui/ErrorState";
import { LoadMoreButton } from "@/shared/components/ui/LoadMoreButton";
import { useEventsInfinite } from "../hooks/useEvents";
import { useEventsUI } from "../store/eventsUIStore";
import { EventCard, EventCardSkeleton } from "./EventCard";
import { EventDialog } from "./EventDialog";
import { PinnedEventBlock } from "./PinnedEventBlock";

export function EventsPage() {
  const contentRef = useRef<HTMLDivElement>(null);
  const leadRef = useRef<HTMLParagraphElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const { selectedEventId, setSelectedEventId, filter, setFilter } = useEventsUI();
  const {
    events,
    total,
    featured: pinnedEvents,
    filters,
    isLoading,
    isFetching,
    isError,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useEventsInfinite(filter);
  const isSwitchingTab = isFetching && !isFetchingNextPage;
  const globalTotal = filters[0]?.count ?? total;
  const selected =
    events.find((event) => event.id === selectedEventId) ??
    pinnedEvents.find((event) => event.id === selectedEventId) ??
    null;
  const pageMeta = [
    { key: "SOURCE", value: "NARIHITO" },
    { key: "EVENTS", value: String(globalTotal) },
    { key: "SHOWING", value: `${events.length} / ${globalTotal}` },
  ];

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
      const container = pinnedRef.current;
      if (!container) return;

      const mm = gsap.matchMedia();

      mm.add(REDUCED_MOTION_QUERY, () => {
        gsap.set(container, { opacity: 1, y: 0 });
      });

      mm.add(NO_REDUCED_MOTION_QUERY, () => {
        gsap.fromTo(container, { opacity: 0, y: 24 }, {
          opacity: 1, y: 0, duration: 0.7, ease: ease.entrance,
          scrollTrigger: { trigger: container, start: "top 80%", once: true },
        });
      });

      return () => mm.revert();
    },
    { scope: contentRef, dependencies: [events] },
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
      backLink="Back To Portfolio"
      backHref="/"
      breadcrumb="HOME / EVENTS"
      eyebrow="05 - EVENTS"
      title="Events that made me better at this."
      deck="Hackathons, meetups, and programs I've joined, with how long each one ran and what I took away from it."
      meta={pageMeta}
      metaLoading={isLoading}
      metaError={isError}
      prev={{ direction: "← PREV", title: "Projects", href: "/projects" }}
      next={{ direction: "NEXT →", title: "Games", href: "/games" }}
    >
      <div ref={contentRef} className="flex flex-col gap-16">
        <p
          ref={leadRef}
          className="max-w-[960px] font-body fs-18 md:text-[20px] lg:text-[22px] leading-[1.55] text-text-primary"
        >
          Coding alone made me faster, but most of the rest I picked up working
          next to other people. These are the events worth mentioning.
        </p>

        {isLoading ? (
          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-9 w-[72px] rounded-full" />
            <Skeleton className="h-9 w-[150px] rounded-full" />
            <Skeleton className="h-9 w-[120px] rounded-full" />
          </div>
        ) : (
          <div ref={filtersRef} className="flex flex-wrap gap-3">
            {filters.map((tag) => (
              <button
                key={tag.label}
                type="button"
                onClick={() => setFilter(tag.label)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-[11px] tracking-[1px] transition-[color,background-color,border-color,transform] duration-200 active:scale-95 ${
                  filter === tag.label
                    ? "animate-chip-pop border-violet bg-violet font-medium text-wire"
                    : "border-border-glow-soft bg-surface text-text-secondary hover:border-violet hover:text-text-primary"
                }`}
              >
                <span>{tag.label}</span>
                <span className={filter === tag.label ? "text-wire/60" : "text-text-muted"}>({tag.count})</span>
              </button>
            ))}
          </div>
        )}

        {isLoading || isSwitchingTab ? (
          <>
            {(isLoading || filter === "All") && (
              <div className="flex flex-col gap-8 border-y border-border-glow py-9">
                <Skeleton className="h-3 w-24" />
                <ShowcaseSkeleton />
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-5 md:gap-6">
              <EventCardSkeleton />
              <EventCardSkeleton />
            </div>
          </>
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : events.length === 0 ? (
          <p className="font-body fs-15 text-text-muted">
            {filter === "All" ? "No events listed yet." : "No events of this type yet."}
          </p>
        ) : (
          <>
            {filter === "All" && pinnedEvents.length > 0 && (
              <div ref={pinnedRef} className="flex flex-col gap-8 border-y border-border-glow py-9">
                <span className="font-mono fs-15 md:text-[17px] font-medium tracking-[3px] text-violet">FEATURED</span>
                <div className="flex flex-col gap-12">
                  {pinnedEvents.map((event) => (
                    <PinnedEventBlock key={event.id} event={event} />
                  ))}
                </div>
              </div>
            )}

            {events.length > 0 && (
              <div
                id="events-grid"
                ref={cardsRef}
                className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-5 md:gap-6"
              >
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}

            {hasNextPage && (
              <LoadMoreButton
                onClick={() => fetchNextPage()}
                loading={isFetchingNextPage}
                label="LOAD MORE EVENTS"
              />
            )}
          </>
        )}
      </div>

      {selected && <EventDialog event={selected} onClose={() => setSelectedEventId(null)} />}
    </PageLayout>
  );
}
