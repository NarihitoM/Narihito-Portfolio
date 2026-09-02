import { Chip } from "@/shared/components/ui/Chip";
import { TechIcon } from "@/shared/components/ui/TechIcon";
import { Globe } from "lucide-react";
import { useTilt } from "@/shared/hooks/useTilt";
import type { ProjectCard } from "../types/types";

export function ProjectCardBlock({ project, onView }: { project: ProjectCard; onView: () => void }) {
  const tilt = useTilt<HTMLDivElement>();

  return (
    <div
      {...tilt}
      data-project-card
      role="button"
      tabIndex={0}
      onClick={onView}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onView();
      }}
      className="group flex cursor-pointer flex-col rounded-[6px] border border-border-glow-soft bg-surface overflow-hidden transition-colors hover:border-border-glow active:border-violet active:bg-chip/40"
    >
      {project.projectimg ? (
        <div className="h-[200px] md:h-[230px] w-full overflow-hidden bg-bg-panel">
          <img
            src={project.projectimg}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="h-[200px] md:h-[230px] w-full flex items-center justify-center bg-bg-panel">
          <span className="font-mono text-[11px] tracking-[2px] text-text-muted uppercase">
            {project.title}
          </span>
        </div>
      )}
      <div className="flex flex-col gap-4 p-5 md:p-6">
        <div className="flex items-center gap-3">
          <h3 className="font-display text-[18px] md:text-[20px] font-semibold text-text-primary">
            {project.title}
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="font-mono text-[10px] tracking-[1.5px] text-text-muted">
            {project.year}
          </span>
          <span className="font-mono text-[10px] tracking-[1.5px] text-text-muted">
            {project.category}
          </span>
          <span className="font-mono text-[10px] tracking-[1.5px] text-text-muted">
            {project.role}
          </span>
          <span className="font-mono text-[10px] tracking-[1.5px] text-violet">
            {project.status}
          </span>
        </div>
        <p className="font-body text-[14px] md:text-[15px] leading-[1.6] text-text-secondary line-clamp-3">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.chips.map((chip) => (
            <Chip key={chip} icon={chip}>{chip}</Chip>
          ))}
        </div>
        <div className="flex items-center gap-2 pt-2">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label={`${project.title} on GitHub`}
              className="flex h-9 w-9 items-center justify-center rounded border border-border-glow-soft text-text-secondary transition-colors hover:border-violet hover:text-violet"
            >
              <TechIcon name="github" className="h-4 w-4" />
            </a>
          )}
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label={`Open ${project.title}`}
              className="flex h-9 w-9 items-center justify-center rounded border border-border-glow-soft text-text-secondary transition-colors hover:border-violet hover:text-violet"
            >
              <Globe size={16} />
            </a>
          )}
          {project.pkg && (
            <a
              href={project.pkg}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label={`${project.title} package`}
              className="flex h-9 w-9 items-center justify-center rounded border border-border-glow-soft text-text-secondary transition-colors hover:border-violet hover:text-violet"
            >
              <TechIcon name={project.pkg.includes("pypi.org") ? "pypi" : "npm"} className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
