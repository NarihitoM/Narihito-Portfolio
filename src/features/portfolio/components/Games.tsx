"use client";

import { useRef } from "react";
import { SectionEyebrow, SectionHeading } from "@/shared/components/ui/SectionHeading";
import { DetailCta } from "@/shared/components/ui/DetailCta";
import { CardSkeleton } from "@/shared/components/ui/CardSkeleton";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { ShowcaseSkeleton } from "@/shared/components/ui/ShowcaseSkeleton";
import { ErrorState } from "@/shared/components/ui/ErrorState";
import { useScrollReveal } from "@/features/portfolio/hooks/useScrollReveal";
import { useGames } from "@/features/games/hooks/useGames";
import { useGamesUI } from "@/features/games/store/gamesUIStore";
import { GameCard } from "@/features/games/components/GameCard";
import { GameDialog } from "@/features/games/components/GameDialog";
import { FavouriteBlock } from "@/features/games/components/FavouriteBlock";
import { Carousel } from "./Carousel";

const EYEBROW = "font-mono fs-15 md:text-[17px] font-medium tracking-[3px] text-violet";

export function Games() {
  const sectionRef = useRef<HTMLElement>(null);
  const { games, isLoading, isError, refetch } = useGames(5);
  const { selectedGameId, setSelectedGameId } = useGamesUI();
  const selected = games.find((game) => game.id === selectedGameId) ?? null;
  const favourite = games.find((game) => (game.type ?? "").toLowerCase() === "favorite");
  const others = games.filter((game) => game !== favourite).slice(0, 4);
  useScrollReveal(sectionRef, { y: 30, staggerAmount: 0.08, dependencies: [games, isLoading] });

  if (!isLoading && !isError && games.length === 0) return null;

  const cta = <DetailCta href="/games" route="/games" />;

  return (
    <section id="games" ref={sectionRef} className="w-full py-12 md:py-[72px]">
      <div className="mx-5 md:mx-10 lg:mx-[120px] flex flex-col gap-6 md:gap-12">
        <div className="flex flex-col gap-2 md:gap-3">
          <SectionEyebrow>06 - GAMES</SectionEyebrow>
          <SectionHeading>Games I&apos;m into</SectionHeading>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-12 md:gap-16">
            <div className="flex flex-col gap-8">
              <Skeleton className="h-[22px] md:h-[25px] w-28" />
              <ShowcaseSkeleton />
            </div>
            <div className="flex flex-col gap-8">
              <Skeleton className="h-[22px] md:h-[25px] w-32" />
              <Carousel label="Games" action={cta}>
                {[0, 1, 2].map((i) => (
                  <CardSkeleton key={i} imageClassName="h-[180px] md:h-[220px]" />
                ))}
              </Carousel>
            </div>
          </div>
        ) : isError ? (
          <>
            <ErrorState onRetry={refetch} />
            {cta}
          </>
        ) : (
          <div data-reveal className="flex flex-col gap-12 md:gap-16">
            {favourite && (
              <div className="flex flex-col gap-8">
                <span className={EYEBROW}>FAVOURITE</span>
                <FavouriteBlock game={favourite} />
              </div>
            )}
            {others.length > 0 ? (
              <div className="flex flex-col gap-8">
                {favourite && <span className={EYEBROW}>MORE GAMES</span>}
                <Carousel label="Games" action={cta}>
                  {others.map((game) => (
                    <GameCard key={game.id} game={game} />
                  ))}
                </Carousel>
              </div>
            ) : (
              cta
            )}
          </div>
        )}
      </div>

      {selected && <GameDialog game={selected} onClose={() => setSelectedGameId(null)} />}
    </section>
  );
}
