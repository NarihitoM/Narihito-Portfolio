"use client";

import { useRef } from "react";
import { SectionEyebrow, SectionHeading } from "@/shared/components/ui/SectionHeading";
import { DetailCta } from "@/shared/components/ui/DetailCta";
import { ProjectCard } from "./ProjectCard";
import { useScrollReveal } from "@/features/portfolio/hooks/useScrollReveal";
import { useProjectsPreview } from "@/features/projects/hooks/useProjectsPreview";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { ErrorState } from "@/shared/components/ui/ErrorState";

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
    tags: p.chips,
  }));
  useScrollReveal(sectionRef, { selector: "[data-project-card]", y: 30, staggerAmount: 0.08, dependencies: [PROJECTS, isLoading] });

  return (
    <section id="projects" ref={sectionRef} className="w-full bg-bg py-14 md:py-[140px]">
      <div className="mx-5 md:mx-10 lg:mx-[120px] flex flex-col gap-6 md:gap-24">
        <div className="flex flex-col gap-2 md:gap-3">
          <SectionEyebrow>04 — PROJECTS</SectionEyebrow>
          <SectionHeading>Selected work</SectionHeading>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-7">
            <Skeleton className="h-[280px] w-full" />
            <Skeleton className="h-[280px] w-full" />
          </div>
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-7">
            {PROJECTS.map((project) => (
              <ProjectCard key={project.name} project={project} />
            ))}
          </div>
        )}

        <DetailCta href="/projects" route="/projects" />
      </div>
    </section>
  );
}
