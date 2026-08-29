"use client";

import { useTilt } from "@/shared/hooks/useTilt";
import { SocialIcon, socialLabel } from "@/shared/components/ui/SocialIcon";
import { useGamesUI } from "../store/gamesUIStore";
import type { Game } from "../types/types";

export function GameCard({ game }: { game: Game }) {
  const { ref: tiltRef, style: tiltStyle, onMouseMove, onMouseLeave, onTouchStart, onTouchEnd } = useTilt<HTMLDivElement>();
  const setSelectedGameId = useGamesUI((s) => s.setSelectedGameId);

  return (
    <div
      data-game-card
      role="button"
      tabIndex={0}
      onClick={() => setSelectedGameId(game.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") setSelectedGameId(game.id);
      }}
      ref={tiltRef}
      style={tiltStyle}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className="flex cursor-pointer flex-col overflow-hidden rounded-[6px] border border-border-glow-soft bg-surface transition-colors hover:border-border-glow active:border-violet active:bg-chip/40"
    >
      {game.pic ? (
        <img
          src={game.pic}
          alt={game.name}
          className="h-[180px] md:h-[220px] w-full object-cover"
        />
      ) : (
        <div className="h-[180px] md:h-[220px] w-full bg-chip" />
      )}

      <div className="flex flex-col gap-2.5 p-5 md:p-6">
        <span className="font-mono text-[11px] font-medium tracking-[2px] text-violet uppercase">
          {game.type}
        </span>
        <h3 className="font-display text-[20px] md:text-[24px] font-semibold leading-[1.2] tracking-[-0.5px] text-text-primary">
          {game.name}
        </h3>
        <p className="font-body text-[14px] md:text-[15px] leading-[1.6] text-text-secondary line-clamp-3">
          {game.description}
        </p>
        {game.links?.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {game.links.map((link) => (
              <a
                key={link.type + link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                aria-label={`${game.name} on ${socialLabel(link.type)}`}
                className="flex h-9 w-9 items-center justify-center rounded border border-border-glow-soft text-text-secondary transition-colors hover:border-violet hover:text-violet"
              >
                <SocialIcon type={link.type} />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
