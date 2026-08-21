"use client";

import { useRef, useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import {
  duration,
  ease,
  gsap,
  registerGsap,
  REDUCED_MOTION_QUERY,
  NO_REDUCED_MOTION_QUERY,
  ScrollTrigger,
} from "@/shared/lib/gsap";
import { PageLayout } from "@/shared/components/layout/PageLayout";
import { Chip } from "@/shared/components/ui/Chip";
import { TechIcon } from "@/shared/components/ui/TechIcon";
import { X, ExternalLink, Globe } from "lucide-react";
import { useTilt } from "@/shared/hooks/useTilt";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { ErrorState } from "@/shared/components/ui/ErrorState";
import { useProjects } from "../hooks/useProjects";
import { useProjectsUI } from "../store/projectsUIStore";
import type { FeaturedProject, ProjectCard } from "../types/types";

const NUMBER_WORDS: Record<number, string> = {
  0: "Zero",
  1: "One",
  2: "Two",
  3: "Three",
  4: "Four",
  5: "Five",
  6: "Six",
  7: "Seven",
  8: "Eight",
  9: "Nine",
  10: "Ten",
  11: "Eleven",
  12: "Twelve",
};

function FeaturedBlock({ project }: { project: FeaturedProject }) {
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

function ProjectCardBlock({ project, onView }: { project: ProjectCard; onView: () => void }) {
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
          <button
            type="button"
            onClick={onView}
            className="flex h-9 items-center gap-1.5 rounded border border-violet bg-violet/10 px-3 font-mono text-[11px] tracking-[1px] text-violet transition-colors hover:bg-violet/20"
          >
            VIEW
          </button>
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
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
              aria-label={`Open ${project.title}`}
              className="flex h-9 w-9 items-center justify-center rounded border border-border-glow-soft text-text-secondary transition-colors hover:border-violet hover:text-violet"
            >
              <Globe size={16} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function Dialog({ project, onClose }: { project: ProjectCard; onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const overlay = overlayRef.current;
      const panel = panelRef.current;
      if (!overlay || !panel) return;

      const mm = gsap.matchMedia();

      mm.add(REDUCED_MOTION_QUERY, () => {
        gsap.set(overlay, { opacity: 1 });
        gsap.set(panel, { opacity: 1, scale: 1, y: 0 });
      });

      mm.add(NO_REDUCED_MOTION_QUERY, () => {
        gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: "power2.out" });
        gsap.fromTo(panel, { opacity: 0, scale: 0.92, y: 30 }, {
          opacity: 1, scale: 1, y: 0, duration: 0.4, ease: ease.entrance,
        });
      });

      return () => mm.revert();
    },
    { scope: panelRef },
  );

  const handleClose = () => {
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (!overlay || !panel) { onClose(); return; }

    const mm = gsap.matchMedia();
    mm.add(REDUCED_MOTION_QUERY, () => { onClose(); });

    mm.add(NO_REDUCED_MOTION_QUERY, () => {
      gsap.to(panel, { opacity: 0, scale: 0.95, y: 16, duration: 0.2, ease: "power2.in" });
      gsap.to(overlay, { opacity: 0, duration: 0.2, ease: "power2.in", onComplete: onClose });
    });

    setTimeout(() => mm.revert(), 300);
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        ref={panelRef}
        className="relative flex flex-col gap-6 w-full max-w-[720px] max-h-[85vh] overflow-y-auto rounded-[8px] border border-border-glow bg-bg-alt p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded border border-border-glow-soft text-text-muted transition-colors hover:text-text-primary"
        >
          <X size={16} />
        </button>

        {project.projectimg && (
          <div className="w-full h-[240px] md:h-[320px] rounded-[6px] overflow-hidden bg-surface border border-border-glow-soft">
            <img
              src={project.projectimg}
              alt={project.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="flex flex-col gap-3">
          <h2 className="font-display text-[26px] md:text-[32px] font-semibold leading-[1.15] tracking-[-0.8px] text-text-primary">
            {project.title}
          </h2>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-mono text-[11px] tracking-[1.5px] text-text-muted">
              {project.year}
            </span>
            <span className="font-mono text-[11px] tracking-[1.5px] text-text-muted">
              {project.category}
            </span>
            <span className="font-mono text-[11px] tracking-[1.5px] text-text-muted">
              {project.role}
            </span>
            <span className="font-mono text-[11px] tracking-[1.5px] text-violet font-medium">
              {project.status}
            </span>
          </div>
        </div>

        <p className="font-body text-[15px] md:text-[16px] leading-[1.7] text-text-secondary">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {project.chips.map((chip) => (
            <Chip key={chip} icon={chip}>{chip}</Chip>
          ))}
        </div>

        <div className="flex items-center gap-3 pt-2 border-t border-border-glow-soft">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 items-center gap-2 rounded border border-border-glow-soft px-4 font-mono text-[12px] text-text-secondary transition-colors hover:border-violet hover:text-violet"
            >
              <TechIcon name="github" className="h-4 w-4" />
              GitHub
            </a>
          )}
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 items-center gap-2 rounded border border-border-glow-soft px-4 font-mono text-[12px] text-text-secondary transition-colors hover:border-violet hover:text-violet"
            >
              <ExternalLink size={14} />
              Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProjectsPage() {
  const contentRef = useRef<HTMLDivElement>(null);
  const leadRef = useRef<HTMLParagraphElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<ProjectCard | null>(null);
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
  const projectCountWord = NUMBER_WORDS[allProjects.length] ?? String(allProjects.length);

  const PROJECTS = filter === "All" ? allProjects : allProjects.filter((p) => p.category === filter);

  useGSAP(
    () => {
      registerGsap();
      const lead = leadRef.current;
      if (!lead) return;

      const mm = gsap.matchMedia();

      mm.add(REDUCED_MOTION_QUERY, () => {
        gsap.set(lead, { opacity: 1, y: 0 });
      });

      mm.add(NO_REDUCED_MOTION_QUERY, () => {
        gsap.fromTo(lead, { opacity: 0, y: 20 }, {
          opacity: 1, y: 0, duration: 0.6, ease: ease.entrance,
          scrollTrigger: { trigger: lead, once: true },
        });
      });

      return () => mm.revert();
    },
    { scope: contentRef },
  );

  useGSAP(
    () => {
      registerGsap();
      const container = filtersRef.current;
      if (!container || !container.children.length) return;

      const mm = gsap.matchMedia();

      mm.add(REDUCED_MOTION_QUERY, () => {
        gsap.set(container.children, { opacity: 1, y: 0 });
      });

      mm.add(NO_REDUCED_MOTION_QUERY, () => {
        gsap.fromTo(container.children, { opacity: 0, y: 12 }, {
          opacity: 1, y: 0, duration: 0.4, ease: ease.entrance, stagger: 0.05,
          scrollTrigger: { trigger: container, start: "top 85%", once: true },
        });
      });

      return () => mm.revert();
    },
    { scope: contentRef },
  );

  useGSAP(
    () => {
      registerGsap();
      const container = featuredRef.current;
      if (!container) return;

      const mm = gsap.matchMedia();

      mm.add(REDUCED_MOTION_QUERY, () => {
        gsap.set(container, { opacity: 1, y: 0 });
      });

      mm.add(NO_REDUCED_MOTION_QUERY, () => {
        gsap.fromTo(container, { opacity: 0, y: 24 }, {
          opacity: 1, y: 0, duration: 0.7, ease: ease.entrance,
          scrollTrigger: { trigger: container, start: "top 80%", once: true },
        });
      });

      return () => mm.revert();
    },
    { scope: contentRef, dependencies: [FEATURED] },
  );

  useGSAP(
    () => {
      registerGsap();
      const container = gridRef.current;
      if (!container || !container.children.length) return;

      const mm = gsap.matchMedia();

      mm.add(REDUCED_MOTION_QUERY, () => {
        gsap.set(container.children, { opacity: 1, y: 0 });
      });

      mm.add(NO_REDUCED_MOTION_QUERY, () => {
        gsap.fromTo(container.children, { opacity: 0, y: 24 }, {
          opacity: 1, y: 0, duration: 0.6, ease: ease.entrance, stagger: 0.08,
          scrollTrigger: { trigger: container, start: "top 75%", once: true },
        });
      });

      const t = window.setTimeout(() => ScrollTrigger.refresh(), 100);
      return () => { window.clearTimeout(t); mm.revert(); };
    },
    { scope: contentRef, dependencies: [PROJECTS] },
  );

  useEffect(() => {
    if (!isLoading) {
      const t = window.setTimeout(() => ScrollTrigger.refresh(), 500);
      return () => window.clearTimeout(t);
    }
  }, [isLoading]);

  return (
    <PageLayout
      backLink="Back to Home"
      backHref="/"
      breadcrumb="HOME / PROJECTS"
      eyebrow="[ 04 - PROJECTS ]"
      title={`${projectCountWord} builds, and what each one was actually solving.`}
      deck="The full index, client work, contract builds, and two things I made because nobody asked me to. Filter by discipline or read straight through."
      meta={pageMeta}
      metaLoading={isLoading}
      metaError={isError}
      prev={{ direction: "← HOME", title: "Experience", href: "/experience" }}
      next={{ direction: "NEXT →", title: "Testimonials", href: "/testimonials" }}
    >
      <div ref={contentRef} className="flex flex-col gap-16">
        <p
          ref={leadRef}
          className="max-w-[960px] font-body text-[18px] md:text-[20px] lg:text-[22px] leading-[1.55] text-text-primary"
        >
          I keep a running index of every project that shipped or got close enough
          to teach me something. The ones that did not work are here too, usually
          the lessons were bigger on those.
        </p>

        <div
          ref={filtersRef}
          className="flex flex-wrap gap-3"
        >
          {FILTERS.map((tag) => (
            <button
              key={tag.label}
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
            {FEATURED && (
              <div ref={featuredRef}>
                <FeaturedBlock project={FEATURED} />
              </div>
            )}

            <div
              ref={gridRef}
              className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6"
            >
              {PROJECTS.map((project) => (
                <ProjectCardBlock
                  key={project.title}
                  project={project}
                  onView={() => setSelected(project)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {selected && (
        <Dialog project={selected} onClose={() => setSelected(null)} />
      )}
    </PageLayout>
  );
}