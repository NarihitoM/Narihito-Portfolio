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
import { CardSkeleton } from "@/shared/components/ui/CardSkeleton";
import { ShowcaseSkeleton } from "@/shared/components/ui/ShowcaseSkeleton";
import { ErrorState } from "@/shared/components/ui/ErrorState";
import { LoadMoreButton } from "@/shared/components/ui/LoadMoreButton";
import { useGamesInfinite } from "../hooks/useGames";
import { useGamesUI } from "../store/gamesUIStore";
import { GameCard } from "./GameCard";
import { GameDialog } from "./GameDialog";
import { FavouriteBlock } from "./FavouriteBlock";

export function GamesPage() {
  const contentRef = useRef<HTMLDivElement>(null);
  const leadRef = useRef<HTMLParagraphElement>(null);
  const favouritesRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const { games, total, favourites, isLoading, isError, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useGamesInfinite();
  const { selectedGameId, setSelectedGameId } = useGamesUI();
  const selected = games.find((game) => game.id === selectedGameId) ?? null;
  const favouriteGames = games.filter((g) => (g.type ?? "").toLowerCase() === "favorite");
  const pageMeta = [
    { key: "SOURCE", value: "NARIHITO" },
    { key: "FAVOURITES", value: String(favourites) },
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
      const container = favouritesRef.current;
      if (!container || !container.children.length) return;

      const mm = gsap.matchMedia();

      mm.add(REDUCED_MOTION_QUERY, () => {
        gsap.set(container.children, { opacity: 1, y: 0 });
      });

      mm.add(NO_REDUCED_MOTION_QUERY, () => {
        gsap.fromTo(container.children, { opacity: 0, y: 20 }, {
          opacity: 1, y: 0, duration: 0.5, ease: ease.entrance, stagger: 0.08,
          scrollTrigger: { trigger: container, start: "top 85%", once: true },
        });
      });

      return () => mm.revert();
    },
    { scope: contentRef, dependencies: [favouriteGames] },
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
      eyebrow="06 - GAMES"
      title="What I play when I'm not writing code."
      deck="The games that still hold my attention after work, and the ones I keep going back to."
      meta={pageMeta}
      metaLoading={isLoading}
      metaError={isError}
      prev={{ direction: "← PREV", title: "Events", href: "/events" }}
      next={{ direction: "NEXT →", title: "Testimonials", href: "/testimonials" }}
    >
      <div ref={contentRef} className="flex flex-col gap-16">
        <p
          ref={leadRef}
          className="max-w-[960px] font-body fs-18 md:text-[20px] lg:text-[22px] leading-[1.55] text-text-primary"
        >
          I build software all day and still make time to play it.
          This is what&apos;s on my screen once work is done.
        </p>

        {isLoading ? (
          <div className="flex flex-col gap-8 border-y border-border-glow py-9">
            <Skeleton className="h-3 w-24" />
            <div className="flex flex-col gap-12">
              {Array.from({ length: 2 }, (_, i) => (
                <ShowcaseSkeleton key={i} />
              ))}
            </div>
          </div>
        ) : null}

        {favouriteGames.length > 0 && !isLoading && !isError && (
          <div ref={favouritesRef} className="flex flex-col gap-8 border-y border-border-glow py-9">
            <span className="font-mono fs-15 md:text-[17px] font-medium tracking-[3px] text-violet">FAVOURITE</span>
            <div className="flex flex-col gap-12">
              {favouriteGames.map((game) => (
                <FavouriteBlock key={`fav-${game.id}`} game={game} />
              ))}
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-5 md:gap-6">
            {Array.from({ length: 2 }, (_, i) => (
              <CardSkeleton key={i} imageClassName="h-[180px] md:h-[220px]" />
            ))}
          </div>
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : games.length === 0 ? (
          <p className="font-body fs-15 text-text-muted">No games listed yet.</p>
        ) : (
          <>
            <div
              id="games-grid"
              ref={cardsRef}
              className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-5 md:gap-6"
            >
              {[...games]
                .sort((a, b) => Number(b.type === "favorite") - Number(a.type === "favorite"))
                .map((game) => (
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
