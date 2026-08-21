"use client";

import { useState } from "react";
import { useTilt } from "@/shared/hooks/useTilt";
import { Chip } from "@/shared/components/ui/Chip";
import { TechIcon } from "@/shared/components/ui/TechIcon";
import { Globe, X, ExternalLink } from "lucide-react";
import type { Project } from "@/features/portfolio/types/types";

function Dialog({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative flex flex-col gap-6 w-full max-w-[720px] max-h-[85vh] overflow-y-auto rounded-[8px] border border-border-glow bg-bg-alt p-6 md:p-8 animate-in zoom-in-95 slide-in-from-bottom-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded border border-border-glow-soft text-text-muted transition-colors hover:text-text-primary"
        >
          <X size={16} />
        </button>

        {project.projectimg && (
          <div className="w-full h-[240px] md:h-[320px] rounded-[6px] overflow-hidden bg-surface border border-border-glow-soft">
            <img src={project.projectimg} alt={project.title} className="h-full w-full object-cover" />
          </div>
        )}

        <div className="flex flex-col gap-3">
          <h2 className="font-display text-[26px] md:text-[32px] font-semibold leading-[1.15] tracking-[-0.8px] text-text-primary">
            {project.title}
          </h2>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-mono text-[11px] tracking-[1.5px] text-text-muted">{project.year}</span>
            <span className="font-mono text-[11px] tracking-[1.5px] text-text-muted">{project.category}</span>
            <span className="font-mono text-[11px] tracking-[1.5px] text-text-muted">{project.role}</span>
            <span className="font-mono text-[11px] tracking-[1.5px] text-violet font-medium">{project.status}</span>
          </div>
        </div>

        <p className="font-body text-[15px] md:text-[16px] leading-[1.7] text-text-secondary">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {project.tags.map((chip) => (
            <Chip key={chip} icon={chip}>{chip}</Chip>
          ))}
        </div>

        <div className="flex items-center gap-3 pt-2 border-t border-border-glow-soft">
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer"
              className="flex h-10 items-center gap-2 rounded border border-border-glow-soft px-4 font-mono text-[12px] text-text-secondary transition-colors hover:border-violet hover:text-violet">
              <TechIcon name="github" className="h-4 w-4" />
              GitHub
            </a>
          )}
          {project.url && (
            <a href={project.url} target="_blank" rel="noopener noreferrer"
              className="flex h-10 items-center gap-2 rounded border border-border-glow-soft px-4 font-mono text-[12px] text-text-secondary transition-colors hover:border-violet hover:text-violet">
              <ExternalLink size={14} />
              Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  const tilt = useTilt<HTMLDivElement>();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        {...tilt}
        data-project-card
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setOpen(true);
        }}
        className="group flex cursor-pointer flex-col rounded-[6px] border border-border-glow-soft bg-surface overflow-hidden transition-colors hover:border-border-glow"
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
            <span className="font-mono text-[11px] tracking-[2px] text-text-muted uppercase">{project.title}</span>
          </div>
        )}
        <div className="flex flex-col gap-4 p-5 md:p-6">
          <div className="flex items-center gap-3">
            <h3 className="font-display text-[18px] md:text-[20px] font-semibold text-text-primary">{project.title}</h3>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-mono text-[10px] tracking-[1.5px] text-text-muted">{project.year}</span>
            <span className="font-mono text-[10px] tracking-[1.5px] text-text-muted">{project.category}</span>
            <span className="font-mono text-[10px] tracking-[1.5px] text-text-muted">{project.role}</span>
            <span className="font-mono text-[10px] tracking-[1.5px] text-violet">{project.status}</span>
          </div>
          <p className="font-body text-[14px] md:text-[15px] leading-[1.6] text-text-secondary line-clamp-3">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((chip) => (
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
          </div>
        </div>
      </div>

      {open && <Dialog project={project} onClose={() => setOpen(false)} />}
    </>
  );
}