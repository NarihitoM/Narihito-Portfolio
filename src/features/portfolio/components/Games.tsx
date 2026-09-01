"use client";

import { useRef } from "react";
import { SectionEyebrow, SectionHeading } from "@/shared/components/ui/SectionHeading";
import { DetailCta } from "@/shared/components/ui/DetailCta";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { ErrorState } from "@/shared/components/ui/ErrorState";
import { useScrollReveal } from "@/features/portfolio/hooks/useScrollReveal";
import { useGames } from "@/features/games/hooks/useGames";
import { useGamesUI } from "@/features/games/store/gamesUIStore";
import { GameCard } from "@/features/games/components/GameCard";
import { GameDialog } from "@/features/games/components/GameDialog";

export function Games() {
  const sectionRef = useRef<HTMLElement>(null);
  const { games, isLoading, isError, refetch } = useGames(4);
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
    <section data-snap id="games" ref={sectionRef} className="w-full bg-bg py-12 md:py-[72px]">
      <div className="mx-5 md:mx-10 lg:mx-[120px] flex flex-col gap-6 md:gap-24">
        <div className="flex flex-col gap-2 md:gap-3">
          <SectionEyebrow>06 - GAMES</SectionEyebrow>
          <SectionHeading>Games I&apos;m into</SectionHeading>
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
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}

        <DetailCta href="/games" route="/games" />
      </div>

      {selected && <GameDialog game={selected} onClose={() => setSelectedGameId(null)} />}
    </section>
  );
}
