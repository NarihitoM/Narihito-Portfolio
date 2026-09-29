import Image from "next/image";
import { Chip } from "@/shared/components/ui/Chip";
import { SocialIcon, socialLabel } from "@/shared/components/ui/SocialIcon";
import type { Game } from "../types/types";

export function FavouriteBlock({ game }: { game: Game }) {
  return (
    <div data-favourite className="flex flex-col lg:flex-row gap-8 lg:gap-14">
      <div className="flex-1">
        {game.pic ? (
          <div className="relative h-[240px] lg:h-[320px] w-full rounded-[6px] bg-surface border border-border-glow-soft overflow-hidden">
            <Image src={game.pic} alt={game.name} fill unoptimized className="object-cover" />
          </div>
        ) : (
          <div className="h-[240px] lg:h-[320px] w-full rounded-[6px] bg-surface border border-border-glow-soft flex items-center justify-center">
            <span className="font-mono text-[12px] tracking-[2px] text-text-muted">{game.name}</span>
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col gap-6">
        <h2 className="font-display fs-28 md:text-[34px] font-semibold leading-[1.15] tracking-[-0.8px] text-text-primary">
          {game.name}
        </h2>
        <p className="font-body fs-15 md:text-[16px] leading-[1.7] text-text-secondary">{game.description}</p>
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
                aria-label={`${game.name} on ${socialLabel(link.type)}`}
                className="flex h-9 w-9 items-center justify-center rounded border border-border-glow-soft text-text-secondary transition-colors hover:border-violet hover:text-violet"
              >
                <SocialIcon type={link.type} />
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
