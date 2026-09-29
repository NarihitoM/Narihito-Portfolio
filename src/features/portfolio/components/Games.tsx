"use client";

import { useRef } from "react";
import { SectionEyebrow, SectionHeading } from "@/shared/components/ui/SectionHeading";
import { DetailCta } from "@/shared/components/ui/DetailCta";
import { CardSkeleton } from "@/shared/components/ui/CardSkeleton";
import { ErrorState } from "@/shared/components/ui/ErrorState";
import { useScrollReveal } from "@/features/portfolio/hooks/useScrollReveal";
import { useGames } from "@/features/games/hooks/useGames";
import { useGamesUI } from "@/features/games/store/gamesUIStore";
import { GameCard } from "@/features/games/components/GameCard";
import { GameDialog } from "@/features/games/components/GameDialog";
import { Carousel } from "./Carousel";

export function Games() {
  const sectionRef = useRef<HTMLElement>(null);
  const { games, isLoading, isError, refetch } = useGames(6);
  const { selectedGameId, setSelectedGameId } = useGamesUI();
  const selected = games.find((game) => game.id === selectedGameId) ?? null;
  useScrollReveal(sectionRef, {
    selector: "[data-game-card]",
    y: 30,
    staggerAmount: 0.08,
    dependencies: [games, isLoading],
  });

  if (!isLoading && !isError && games.length === 0) return null;

  return (
    <section id="games" ref={sectionRef} className="w-full py-12 md:py-[72px]">
      <div className="mx-5 md:mx-10 lg:mx-[120px] flex flex-col gap-6 md:gap-24">
        <div className="flex flex-col gap-2 md:gap-3">
          <SectionEyebrow>06 - GAMES</SectionEyebrow>
          <SectionHeading>Games I&apos;m into</SectionHeading>
        </div>

        {isLoading ? (
          <Carousel label="Games">
            {[0, 1, 2].map((i) => (
              <CardSkeleton key={i} imageClassName="h-[180px] md:h-[220px]" />
            ))}
          </Carousel>
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : (
          <Carousel label="Games">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </Carousel>
        )}

        <DetailCta href="/games" route="/games" />
      </div>

      {selected && <GameDialog game={selected} onClose={() => setSelectedGameId(null)} />}
    </section>
  );
}
