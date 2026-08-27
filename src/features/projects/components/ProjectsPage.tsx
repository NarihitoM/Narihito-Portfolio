"use client";

import { useRef, useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import {
  ease,
  gsap,
  registerGsap,
  REDUCED_MOTION_QUERY,
  NO_REDUCED_MOTION_QUERY,
  ScrollTrigger,
} from "@/shared/lib/gsap";
import { PageLayout } from "@/shared/components/layout/PageLayout";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { ErrorState } from "@/shared/components/ui/ErrorState";
import { LoadMoreButton } from "@/shared/components/ui/LoadMoreButton";
import { useProjectsInfinite } from "../hooks/useProjects";
import { useProjectsUI } from "../store/projectsUIStore";
import { FeaturedBlock } from "./FeaturedBlock";
import { ProjectCardBlock } from "./ProjectCardBlock";
import { ProjectDialog } from "./ProjectDialog";
import type { ProjectCard } from "../types/types";

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

export function ProjectsPage() {
  const contentRef = useRef<HTMLDivElement>(null);
  const leadRef = useRef<HTMLParagraphElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<ProjectCard | null>(null);
  const { filter, setFilter } = useProjectsUI();
  const {
    filters: FILTERS,
    featured: FEATURED,
    projects: PROJECTS,
    total,
    isLoading,
    isError,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useProjectsInfinite(filter);
  const globalTotal = FILTERS[0]?.count ?? total;
  const pageMeta = [
    { key: "INDEX", value: `${globalTotal} PROJECTS` },
    { key: "FILTERS", value: `${Math.max(FILTERS.length - 1, 0)} TAGS` },
    { key: "SHOWING", value: `${PROJECTS.length} / ${globalTotal}` },
  ];
  const projectCountWord = NUMBER_WORDS[globalTotal] ?? String(globalTotal);

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
      title={`${projectCountWord} builds, from client briefs to weekend experiments.`}
      deck="The complete index. Filter by tag to find the slice you care about, or scroll through all of them in order."
      meta={pageMeta}
      metaLoading={isLoading}
      metaError={isError}
      prev={{ direction: "← HOME", title: "Experience", href: "/experience" }}
      next={{ direction: "NEXT →", title: "Events", href: "/events" }}
    >
      <div ref={contentRef} className="flex flex-col gap-16">
        <p
          ref={leadRef}
          className="max-w-[960px] font-body text-[18px] md:text-[20px] lg:text-[22px] leading-[1.55] text-text-primary"
        >
          Everything here either shipped or taught me something while trying
          to. The failures stay listed too, those lessons were usually
          the bigger ones.
        </p>

        {isLoading ? (
          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-9 w-[72px] rounded-full" />
            <Skeleton className="h-9 w-[172px] rounded-full" />
            <Skeleton className="h-9 w-[136px] rounded-full" />
            <Skeleton className="h-9 w-[188px] rounded-full" />
          </div>
        ) : (
          <div
            id="projects-grid"
            ref={filtersRef}
            className="flex flex-wrap gap-3"
          >
            {FILTERS.map((tag) => (
              <button
                key={tag.label}
                type="button"
                onClick={() => setFilter(tag.label)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-[11px] tracking-[1px] transition-[color,border-color,transform] hover:border-violet hover:text-text-primary active:scale-95 ${
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
        )}

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
            {filter === "All" && FEATURED && (
              <div ref={featuredRef}>
                <FeaturedBlock project={FEATURED} />
              </div>
            )}

            {PROJECTS.length === 0 ? (
              <p className="font-body text-[15px] text-text-muted">
                No projects in this category yet.
              </p>
            ) : (
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
            )}

            {hasNextPage && (
              <LoadMoreButton
                onClick={() => fetchNextPage()}
                loading={isFetchingNextPage}
                label="LOAD MORE PROJECTS"
              />
            )}
          </>
        )}
      </div>

      {selected && (
        <ProjectDialog project={selected} onClose={() => setSelected(null)} />
      )}
    </PageLayout>
  );
}