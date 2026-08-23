import type { Testimonial } from "../types/types";

export function QuoteCard({ testimonial, onClick }: { testimonial: Testimonial; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-quote-card
      className="flex flex-col gap-6 rounded-[6px] border border-border-glow-soft bg-surface p-6 md:p-8 text-left transition-colors hover:border-border-glow"
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
    </button>
  );
}
