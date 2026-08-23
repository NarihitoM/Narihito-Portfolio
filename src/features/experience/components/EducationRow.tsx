import type { Education } from "@/features/experience/types/types";

export function EducationRow({ edu }: { edu: Education }) {
  return (
    <div
      data-edu-row
      className="flex flex-col md:flex-row md:items-center gap-1.5 md:gap-7 border-t border-border-glow-soft py-3.5"
    >
      <span className="md:w-[70px] md:shrink-0 font-mono text-[12px] tracking-[1px] text-text-muted">
        {edu.year}
      </span>
      <span className="md:flex-1 font-body text-[15px] md:text-[17px] font-medium text-text-primary">
        {edu.name}
      </span>
      <span className="md:w-[340px] md:shrink-0 md:text-right font-mono text-[11px] tracking-[0.6px] text-text-muted">
        {edu.org}
      </span>
    </div>
  );
}
