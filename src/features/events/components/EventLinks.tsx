import { SocialIcon, socialLabel } from "@/shared/components/ui/SocialIcon";
import type { Event } from "../types/types";

export function EventLinks({ event, className = "" }: { event: Event; className?: string }) {
  if (!event.links?.length) return null;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {event.links.map((link) => (
        <a
          key={link.type + link.url}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          aria-label={`${event.title} on ${socialLabel(link.type)}`}
          className="flex h-9 w-9 items-center justify-center rounded border border-border-glow-soft text-text-secondary transition-colors hover:border-violet hover:text-violet"
        >
          <SocialIcon type={link.type} />
        </a>
      ))}
    </div>
  );
}
