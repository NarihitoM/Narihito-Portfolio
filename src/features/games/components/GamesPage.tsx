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
import { ErrorState } from "@/shared/components/ui/ErrorState";
import { LoadMoreButton } from "@/shared/components/ui/LoadMoreButton";
import { useGamesInfinite } from "../hooks/useGames";
import { useGamesUI } from "../store/gamesUIStore";
import { GameCard } from "./GameCard";
import { GameDialog } from "./GameDialog";

export function GamesPage() {
  const contentRef = useRef<HTMLDivElement>(null);
  const leadRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const { games, total, isLoading, isError, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useGamesInfinite();
  const { selectedGameId, setSelectedGameId } = useGamesUI();
  const selected = games.find((game) => game.id === selectedGameId) ?? null;
  const pageMeta = [
    { key: "SOURCE", value: "NARIHITO" },
    { key: "GAMES", value: String(total) },
    { key: "SHOWING", value: `${games.length} / ${total}` },
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
    { scope: contentRef, dependencies: [games] },
  );

  return (
    <PageLayout
      backLink="Back To Portfolio"
      backHref="/"
      breadcrumb="HOME / GAMES"
      eyebrow="[ 06 - GAMES ]"
      title="Side quests that shipped anyway."
      deck="Small games I built for the fun of it, jams, and a few for clients. Play them, don't just read about them."
      meta={pageMeta}
      metaLoading={isLoading}
      metaError={isError}
      prev={{ direction: "← PREV", title: "Events", href: "/events" }}
      next={{ direction: "NEXT →", title: "Testimonials", href: "/testimonials" }}
    >
      <div ref={contentRef} className="flex flex-col gap-16">
        <p
          ref={leadRef}
          className="max-w-[960px] font-body text-[18px] md:text-[20px] lg:text-[22px] leading-[1.55] text-text-primary"
        >
          Code doesn&apos;t have to solve a problem to be worth writing. Some of
          these came out of a weekend jam, some out of just wanting to see
          if an idea would actually be fun. All of them are playable.
        </p>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            <Skeleton className="h-[320px] w-full" />
            <Skeleton className="h-[320px] w-full" />
          </div>
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : games.length === 0 ? (
          <p className="font-body text-[15px] text-text-muted">No games listed yet.</p>
        ) : (
          <>
            <div
              id="games-grid"
              ref={cardsRef}
              className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6"
            >
              {games.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>

            {hasNextPage && (
              <LoadMoreButton
                onClick={() => fetchNextPage()}
                loading={isFetchingNextPage}
                label="LOAD MORE GAMES"
              />
            )}
          </>
        )}
      </div>

      {selected && <GameDialog game={selected} onClose={() => setSelectedGameId(null)} />}
    </PageLayout>
  );
}
