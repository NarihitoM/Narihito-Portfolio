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
import { Chip } from "@/shared/components/ui/Chip";
import { SocialIcon } from "@/shared/components/ui/SocialIcon";

export function GamesPage() {
  const contentRef = useRef<HTMLDivElement>(null);
  const leadRef = useRef<HTMLParagraphElement>(null);
  const favouritesRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const { games, total, favourites, isLoading, isError, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useGamesInfinite();
  const { selectedGameId, setSelectedGameId } = useGamesUI();
  const selected = games.find((game) => game.id === selectedGameId) ?? null;
  const favouriteGames = games.filter((g) => g.type.toLowerCase() === "favorite");
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
      eyebrow="[ 06 - GAMES ]"
      title="What I'm playing when I'm not shipping code."
      deck="The games that actually hold my attention outside of work. Favorites, current obsessions and the ones I keep coming back to."
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
          Building software all day does not leave much room for playing it,
          but I make room anyway. This is the other side of the screen,
          what I load up when the work is done for the day.
        </p>

        {favouriteGames.length > 0 && !isLoading && !isError && (
          <div ref={favouritesRef} className="flex flex-col gap-12">
            {favouriteGames.map((game) => (
              <div key={`fav-${game.id}`} data-favourite className="flex flex-col gap-8 border-t border-border-glow pt-9">
                <span className="font-mono text-[11px] font-medium tracking-[3px] text-violet">
                  FAVOURITE — {new Date().getFullYear()}
                </span>
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-14">
                  <div className="flex-1">
                    {game.pic ? (
                      <div className="h-[240px] lg:h-[320px] w-full rounded-[6px] bg-surface border border-border-glow-soft overflow-hidden">
                        <img src={game.pic} alt={game.name} className="h-full w-full object-cover" />
                      </div>
                    ) : (
                      <div className="h-[240px] lg:h-[320px] w-full rounded-[6px] bg-surface border border-border-glow-soft flex items-center justify-center">
                        <span className="font-mono text-[12px] tracking-[2px] text-text-muted">{game.name}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col gap-6">
                    <h2 className="font-display text-[28px] md:text-[34px] font-semibold leading-[1.15] tracking-[-0.8px] text-text-primary">
                      {game.name}
                    </h2>
                    <p className="font-body text-[15px] md:text-[16px] leading-[1.7] text-text-secondary">{game.description}</p>
                    {game.chips?.length > 0 && (
                      <div className="flex flex-wrap gap-2.5">
                        {game.chips.map((chip) => (
                          <Chip key={chip.name}>{chip.name}</Chip>
                        ))}
                      </div>
                    )}
                    <div className="flex flex-col gap-2 pt-4 border-t border-border-glow-soft">
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-[10px] tracking-[2px] text-text-muted w-[80px] shrink-0">TYPE</span>
                        <span className="font-mono text-[12px] text-text-secondary uppercase">{game.type}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-[10px] tracking-[2px] text-text-muted w-[80px] shrink-0">GENRE</span>
                        <span className="font-mono text-[12px] text-text-secondary">{game.chips?.length ? game.chips.map((c) => c.name).join(", ") : "—"}</span>
                      </div>
                      {game.links?.length ? (
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-[10px] tracking-[2px] text-text-muted w-[80px] shrink-0">LINKS</span>
                          <span className="font-mono text-[12px] text-text-secondary">{game.links.length} platforms</span>
                        </div>
                      ) : null}
                    </div>
                    {game.links?.length ? (
                      <div className="flex flex-wrap items-center gap-2 pt-2">
                        {game.links.map((link) => (
                          <a
                            key={link.type + link.url}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex h-9 w-9 items-center justify-center rounded border border-border-glow-soft text-text-secondary transition-colors hover:border-violet hover:text-violet"
                          >
                            <SocialIcon type={link.type as any} />
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

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
