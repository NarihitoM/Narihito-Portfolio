"use client";

import { useTilt } from "@/shared/hooks/useTilt";
import { Chip } from "@/shared/components/ui/Chip";
import { TechIcon } from "@/shared/components/ui/TechIcon";
import { Globe } from "lucide-react";
import type { Project } from "@/features/portfolio/types/types";

export function ProjectCard({ project }: { project: Project }) {
  const tilt = useTilt<HTMLDivElement>();

  return (
    <div
      {...tilt}
      data-project-card
      className="group flex flex-col bg-bg-panel rounded-[4px] overflow-hidden"
    >
      {project.projectimg ? (
        <div className="h-[170px] md:h-[200px] w-full overflow-hidden bg-media">
          <img
            src={project.projectimg}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="flex h-[170px] md:h-[200px] w-full items-center justify-center bg-media">
          <span className="font-mono text-[12px] uppercase text-text-muted">{project.name}</span>
        </div>
      )}
      <div className="flex flex-col gap-2.5 md:gap-3.5 p-[18px] md:p-6">
        <h3 className="font-display text-[20px] md:text-[22px] font-semibold text-text-primary">{project.title}</h3>
        <p className="font-body text-[14px] text-text-secondary">{project.description}</p>
        <div className="flex flex-wrap gap-2 pt-1 md:pt-0">
          {project.tags.map((tag) => (
            <Chip key={tag}>{tag}</Chip>
          ))}
        </div>
        <div className="flex items-center gap-2 pt-1">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} on GitHub`}
              className="flex h-8 w-8 items-center justify-center rounded border border-border-glow-soft text-text-secondary transition-colors hover:border-violet hover:text-violet"
            >
              <TechIcon name="github" className="h-3.5 w-3.5" />
            </a>
          )}
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${project.title}`}
              className="flex h-8 w-8 items-center justify-center rounded border border-border-glow-soft text-text-secondary transition-colors hover:border-violet hover:text-violet"
            >
              <Globe size={14} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
