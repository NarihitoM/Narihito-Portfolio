"use client";

import { useRef, useState } from "react";
import { SectionEyebrow, SectionHeading } from "@/shared/components/ui/SectionHeading";
import { DetailCta } from "@/shared/components/ui/DetailCta";
import { Chip } from "@/shared/components/ui/Chip";
import { TechIcon } from "@/shared/components/ui/TechIcon";
import { Globe } from "lucide-react";
import { ProjectDialog } from "@/features/projects/components/ProjectDialog";
import { useScrollReveal } from "@/features/portfolio/hooks/useScrollReveal";
import { useTilt } from "@/shared/hooks/useTilt";
import { useProjectsPreview } from "@/features/projects/hooks/useProjectsPreview";
import { CardSkeleton } from "@/shared/components/ui/CardSkeleton";
import { ErrorState } from "@/shared/components/ui/ErrorState";
import type { Project } from "@/features/portfolio/types/types";

function ProjectCard({ project }: { project: Project }) {
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

      {open && (
        <ProjectDialog
          project={{ ...project, featured: false, chips: project.tags }}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const { projects: previewProjects, isLoading, isError, refetch } = useProjectsPreview(4);
  const PROJECTS = previewProjects.map((p) => ({
    projectimg: p.projectimg,
    name: p.title,
    title: p.title,
    year: p.year,
    category: p.category,
    role: p.role,
    status: p.status,
    description: p.description,
    url: p.url,
    github: p.github,
    pkg: p.pkg,
    tags: p.chips,
  }));
  useScrollReveal(sectionRef, { selector: "[data-project-card]", y: 30, staggerAmount: 0.08, dependencies: [PROJECTS, isLoading] });

  return (
    <section id="projects" ref={sectionRef} className="w-full bg-bg py-12 md:py-[72px]">
      <div className="mx-5 md:mx-10 lg:mx-[120px] flex flex-col gap-6 md:gap-24">
        <div className="flex flex-col gap-2 md:gap-3">
          <SectionEyebrow>04 - PROJECTS</SectionEyebrow>
          <SectionHeading>Selected work</SectionHeading>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-7">
            <CardSkeleton imageClassName="h-[200px] md:h-[230px]" />
            <CardSkeleton imageClassName="h-[200px] md:h-[230px]" />
          </div>
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : PROJECTS.length === 0 ? (
          <p className="font-body text-[14px] text-text-muted">No projects yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-7">
            {PROJECTS.map((project) => (
              <ProjectCard key={`${project.title}-${project.year}`} project={project} />
            ))}
          </div>
        )}

        <DetailCta href="/projects" route="/projects" />
      </div>
    </section>
  );
}
