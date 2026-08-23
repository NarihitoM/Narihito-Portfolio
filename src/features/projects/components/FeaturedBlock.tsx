import { Chip } from "@/shared/components/ui/Chip";
import type { FeaturedProject } from "../types/types";

export function FeaturedBlock({ project }: { project: FeaturedProject }) {
  return (
    <div data-featured className="flex flex-col gap-8 border-t border-border-glow pt-9">
      <span className="font-mono text-[11px] font-medium tracking-[3px] text-violet">
        {project.eyebrow}
      </span>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-14">
        <div className="flex-1 flex flex-col gap-6">
          {project.projectimg ? (
            <div className="h-[240px] lg:h-[320px] w-full rounded-[6px] bg-surface border border-border-glow-soft overflow-hidden">
              <img
                src={project.projectimg}
                alt={project.title}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="h-[240px] lg:h-[320px] w-full rounded-[6px] bg-surface border border-border-glow-soft flex items-center justify-center">
              <span className="font-mono text-[12px] tracking-[2px] text-text-muted">
                {project.title}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col gap-6">
          <h2 className="font-display text-[28px] md:text-[34px] font-semibold leading-[1.15] tracking-[-0.8px] text-text-primary">
            {project.title}
          </h2>

          <p className="font-body text-[15px] md:text-[16px] leading-[1.7] text-text-secondary">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2.5">
            {project.chips.map((chip) => (
              <Chip key={chip} icon={chip}>{chip}</Chip>
            ))}
          </div>

          <div className="flex flex-col gap-2 pt-4 border-t border-border-glow-soft">
            {Object.entries(project.meta).map(([key, value]) => (
              <div key={key} className="flex items-center gap-4">
                <span className="font-mono text-[10px] tracking-[2px] text-text-muted w-[80px] shrink-0 uppercase">
                  {key}
                </span>
                <span className="font-mono text-[12px] text-text-secondary">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
