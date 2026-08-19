"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import {
  ease,
  gsap,
  registerGsap,
  REDUCED_MOTION_QUERY,
  NO_REDUCED_MOTION_QUERY,
  SplitText,
} from "@/shared/lib/gsap";
import { PageLayout } from "@/shared/components/layout/PageLayout";
import { Chip } from "@/shared/components/ui/Chip";
import { useTilt } from "@/shared/hooks/useTilt";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { ErrorState } from "@/shared/components/ui/ErrorState";
import { useProjects } from "../hooks/useProjects";
import { useProjectsUI } from "../store/projectsUIStore";
import type { FeaturedProject, ProjectCard } from "../types/types";

function FeaturedBlock({ project }: { project: FeaturedProject }) {
  return (
    <div data-featured className="flex flex-col gap-8 border-t border-border-glow pt-9">
      <span className="font-mono text-[11px] font-medium tracking-[3px] text-violet">
        {project.eyebrow}
      </span>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-14">
        <div className="flex-1 flex flex-col gap-6">
          <div className="h-[240px] lg:h-[320px] w-full rounded-[6px] bg-surface border border-border-glow-soft flex items-center justify-center">
            <span className="font-mono text-[12px] tracking-[2px] text-text-muted">
              SANSIRI STAY
            </span>
          </div>
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
              <Chip key={chip}>{chip}</Chip>
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

function ProjectCardBlock({ project }: { project: ProjectCard }) {
  const tilt = useTilt<HTMLDivElement>();

  return (
    <div
      {...tilt}
      data-project-card
      className="group flex flex-col rounded-[6px] border border-border-glow-soft bg-surface overflow-hidden transition-colors hover:border-border-glow"
    >
      <div className="h-[200px] md:h-[230px] w-full flex items-center justify-center bg-bg-panel">
        <span className="font-mono text-[11px] tracking-[2px] text-text-muted uppercase">
          {project.title}
        </span>
      </div>
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
        <p className="font-body text-[14px] md:text-[15px] leading-[1.6] text-text-secondary">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.chips.map((chip) => (
            <Chip key={chip}>{chip}</Chip>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProjectsPage() {
  const contentRef = useRef<HTMLDivElement>(null);
  const { filters: FILTERS, featured: FEATURED, projects: allProjects, isLoading, isError, refetch } = useProjects();
  const { filter, setFilter } = useProjectsUI();
  const newestYear = allProjects
    .map((project) => project.year)
    .sort((a, b) => b.localeCompare(a))[0] ?? "Loading";
  const inBuildCount = allProjects.filter((project) => project.status.toLowerCase().includes("build")).length;
  const pageMeta = [
    { key: "INDEX", value: `${allProjects.length} PROJECTS` },
    { key: "FILTERS", value: `${Math.max(FILTERS.length - 1, 0)} TAGS` },
    { key: "NEWEST", value: newestYear },
    { key: "IN BUILD", value: String(inBuildCount) },
  ];

  const PROJECTS = filter === "All" ? allProjects : allProjects.filter((p) => p.category === filter);

  useGSAP(
    () => {
      registerGsap();
      const content = contentRef.current;
      if (!content) return;

      const mm = gsap.matchMedia();

      mm.add(REDUCED_MOTION_QUERY, () => {
        gsap.set("[data-projects-reveal]", { opacity: 1, y: 0 });
      });

      mm.add(NO_REDUCED_MOTION_QUERY, () => {
        const lead = content.querySelector("[data-lead]");
        if (lead) {
          const split = new SplitText(lead, { type: "lines" });
          gsap.from(split.lines, {
            opacity: 0,
            y: 20,
            duration: 0.6,
            ease: ease.entrance,
            stagger: 0.06,
            scrollTrigger: { trigger: lead },
          });
        }

        gsap.from("[data-filter-tag]", {
          opacity: 0,
          y: 12,
          duration: 0.4,
          ease: ease.entrance,
          stagger: 0.05,
          scrollTrigger: { trigger: "[data-filters]", start: "top 85%" },
        });

        gsap.from("[data-featured]", {
          opacity: 0,
          y: 24,
          duration: 0.7,
          ease: ease.entrance,
          scrollTrigger: { trigger: "[data-featured]", start: "top 80%" },
        });

        gsap.from("[data-project-card]", {
          opacity: 0,
          y: 24,
          duration: 0.6,
          ease: ease.entrance,
          stagger: 0.08,
          scrollTrigger: { trigger: "[data-grid]", start: "top 75%" },
        });

        return undefined;
      });

      return () => mm.revert();
    },
    { scope: contentRef, dependencies: [PROJECTS, FEATURED, FILTERS] },
  );

  return (
    <PageLayout
      backLink="Back to Home"
      backHref="/"
      breadcrumb="HOME / PROJECTS"
      eyebrow="[ 04 — PROJECTS ]"
      title="Eleven builds, and what each one was actually solving."
      deck="The full index — client work, contract builds, and two things I made because nobody asked me to. Filter by discipline or read straight through."
      meta={pageMeta}
      prev={{ direction: "← HOME", title: "Experience", href: "/experience" }}
      next={{ direction: "NEXT →", title: "Testimonials", href: "/testimonials" }}
    >
      <div ref={contentRef} className="flex flex-col gap-16">
        <p
          data-lead
          className="max-w-[960px] font-body text-[18px] md:text-[20px] lg:text-[22px] leading-[1.55] text-text-primary"
        >
          I keep a running index of every project that shipped or got close enough
          to teach me something. The ones that did not work are here too — usually
          the lessons were bigger on those.
        </p>

        <div
          data-filters
          className="flex flex-wrap gap-3"
        >
          {FILTERS.map((tag) => (
            <button
              key={tag.label}
              data-filter-tag
              type="button"
              onClick={() => setFilter(tag.label)}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-[11px] tracking-[1px] transition-colors hover:border-violet hover:text-text-primary ${
                filter === tag.label
                  ? "border-violet bg-surface text-text-primary"
                  : "border-border-glow-soft bg-surface text-text-secondary"
              }`}
            >
              <span>{tag.label}</span>
              <span className="text-text-muted">({tag.count})</span>
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            <Skeleton className="h-[280px] w-full" />
            <Skeleton className="h-[280px] w-full" />
            <Skeleton className="h-[280px] w-full" />
            <Skeleton className="h-[280px] w-full" />
          </div>
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : (
          <>
            {FEATURED && <FeaturedBlock project={FEATURED} />}

            <div
              data-grid
              className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6"
            >
              {PROJECTS.map((project) => (
                <ProjectCardBlock key={project.title} project={project} />
              ))}
            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
}
