"use client";

import { useTilt } from "@/shared/hooks/useTilt";
import { Chip } from "@/shared/components/ui/Chip";
import type { Project } from "@/features/portfolio/types/types";

export function ProjectCard({ project }: { project: Project }) {
  const tilt = useTilt<HTMLDivElement>();

  return (
    <div
      {...tilt}
      data-project-card
      className="flex flex-col bg-bg-panel rounded-[4px] overflow-hidden"
    >
      <div className="flex h-[170px] md:h-[200px] w-full items-center justify-center bg-media">
        <span className="font-mono text-[12px] uppercase text-text-muted">{project.name}</span>
      </div>
      <div className="flex flex-col gap-2.5 md:gap-3.5 p-[18px] md:p-6">
        <h3 className="font-display text-[20px] md:text-[22px] font-semibold text-text-primary">{project.title}</h3>
        <p className="font-body text-[14px] text-text-secondary">{project.description}</p>
        <div className="flex flex-wrap gap-2 pt-1 md:pt-0">
          {project.tags.map((tag) => (
            <Chip key={tag}>{tag}</Chip>
          ))}
        </div>
      </div>
    </div>
  );
}
