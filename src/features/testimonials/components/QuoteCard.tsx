import { SocialIcon, socialLabel } from "@/shared/components/ui/SocialIcon";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import type { Testimonial } from "../types/types";

export function QuoteCard({ testimonial, onClick }: { testimonial: Testimonial; onClick: () => void }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      data-quote-card
      className="flex cursor-pointer flex-col gap-6 rounded-[6px] border border-border-glow-soft bg-surface p-6 md:p-8 text-left transition-colors hover:border-border-glow active:border-violet active:bg-chip/30"
    >
      <p className="font-body text-[15px] md:text-[16px] leading-[1.7] text-text-primary italic line-clamp-3">
        &ldquo;{testimonial.quote}&rdquo;
      </p>
      <div className="flex items-center gap-4 border-t border-border-glow-soft pt-5">
        {testimonial.profilePic ? (
          <img src={testimonial.profilePic} alt={testimonial.name} className="h-10 w-10 shrink-0 rounded-full object-cover" />
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-chip font-mono text-[13px] font-medium text-text-primary">
            {testimonial.initials}
          </div>
        )}
        <div className="flex flex-col gap-1">
          <span className="font-body text-[14px] font-medium text-text-primary">
            {testimonial.name}
          </span>
          <span className="font-mono text-[11px] tracking-[0.5px] text-text-muted">
            {testimonial.role}
          </span>
        </div>
      </div>
      <p className="font-body text-[13px] leading-[1.6] text-text-secondary line-clamp-2">
        {testimonial.context}
      </p>

      {testimonial.socials?.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {testimonial.socials.map((social) => (
            <a
              key={social.type + social.url}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label={`${testimonial.name} on ${socialLabel(social.type)}`}
              className="flex h-9 w-9 items-center justify-center rounded border border-border-glow-soft text-text-secondary transition-colors hover:border-violet hover:text-violet"
            >
              <SocialIcon type={social.type} />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export function QuoteCardSkeleton() {
  return (
    <div className="flex flex-col gap-6 rounded-[6px] border border-border-glow-soft bg-surface p-6 md:p-8">
      <Skeleton className="h-[77px] md:h-[82px] w-full" />
      <div className="flex items-center gap-4 border-t border-border-glow-soft pt-5">
        <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
        <div className="flex flex-col gap-1">
          <Skeleton className="h-[18px] w-32" />
          <Skeleton className="h-[13px] w-40" />
        </div>
      </div>
      <Skeleton className="h-[42px] w-full" />
      <div className="flex flex-wrap items-center gap-2 pt-2">
        <Skeleton className="h-9 w-9" />
        <Skeleton className="h-9 w-9" />
      </div>
    </div>
  );
}
