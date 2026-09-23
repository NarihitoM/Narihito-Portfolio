import type { Duty } from "@/features/experience/types/types";

export function DutyRow({ duty }: { duty: Duty }) {
  return (
    <div
      data-duty
      className="flex items-start gap-4 md:gap-[18px] border-t border-border-glow-soft py-3"
    >
      <span className="shrink-0 font-mono fs-13 text-text-muted">
        {duty.index}
      </span>
      <span className="font-body fs-14 md:text-[15px] leading-[1.6] text-text-secondary">
        {duty.text}
      </span>
    </div>
  );
}
