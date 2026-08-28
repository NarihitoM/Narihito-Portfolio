"use client";

import { useMemo, useRef } from "react";
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
import { TechIcon } from "@/shared/components/ui/TechIcon";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { ErrorState } from "@/shared/components/ui/ErrorState";
import { LoadMoreButton } from "@/shared/components/ui/LoadMoreButton";
import { useSkills, useLearning } from "../hooks/useSkills";
import { useSkillsUI } from "../store/skillsUIStore";
import { CategorySection } from "./CategorySection";

export function SkillsPage() {
  const contentRef = useRef<HTMLDivElement>(null);
  const leadRef = useRef<HTMLParagraphElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const learningRef = useRef<HTMLDivElement>(null);
  const { categories: allCategories, isLoading, isError, refetch } = useSkills();
  const {
    items: learningItems,
    total: learningTotal,
    isLoading: learningLoading,
    isError: learningError,
    refetch: refetchLearning,
    hasNextPage: hasMoreLearning,
    isFetchingNextPage: loadingMoreLearning,
    fetchNextPage: loadMoreLearning,
  } = useLearning();
  const { activeCategory, setActiveCategory } = useSkillsUI();
  const toolCount = allCategories.reduce((total, category) => total + category.tools.length, 0);
  const primaryStack = allCategories[0]?.tools.slice(0, 2).map((tool) => tool.name).join(" + ") || "Loading";
  const pageMeta = [
    { key: "SOURCE", value: "NARIHITO" },
    { key: "CATEGORIES", value: String(allCategories.length) },
    { key: "TOOLS LISTED", value: String(toolCount) },
    { key: "PRIMARY", value: primaryStack.toUpperCase() },
  ];

  const CATEGORIES = useMemo(
    () => (activeCategory === "All" ? allCategories : allCategories.filter((c) => c.eyebrow === activeCategory)),
    [allCategories, activeCategory],
  );

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
        gsap.fromTo(
          lead,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: ease.entrance,
            scrollTrigger: { trigger: lead, once: true },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: contentRef },
  );

  useGSAP(
    () => {
      registerGsap();
      const cats = categoriesRef.current;
      if (!cats || !cats.children.length) return;

      const mm = gsap.matchMedia();

      mm.add(REDUCED_MOTION_QUERY, () => {
        gsap.set(cats.children, { opacity: 1, y: 0 });
      });

      mm.add(NO_REDUCED_MOTION_QUERY, () => {
        gsap.fromTo(
          cats.children,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: ease.entrance,
            stagger: 0.1,
            scrollTrigger: { trigger: cats, start: "top 80%", once: true },
          },
        );
      });

      const t = window.setTimeout(() => ScrollTrigger.refresh(), 100);
      return () => {
        window.clearTimeout(t);
        mm.revert();
      };
    },
    { scope: categoriesRef, dependencies: [CATEGORIES] },
  );

  useGSAP(
    () => {
      registerGsap();
      const learn = learningRef.current;
      if (!learn || !learn.children.length) return;

      const mm = gsap.matchMedia();

      mm.add(REDUCED_MOTION_QUERY, () => {
        gsap.set(learn.children, { opacity: 1, y: 0 });
      });

      mm.add(NO_REDUCED_MOTION_QUERY, () => {
        gsap.fromTo(
          learn.children,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: ease.entrance,
            stagger: 0.08,
            scrollTrigger: { trigger: learn, start: "top 80%", once: true },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: contentRef, dependencies: [learningItems] },
  );

  return (
    <PageLayout
      backLink="Back To Portfolio"
      backHref="/"
      breadcrumb="HOME / SKILLS"
      eyebrow="[ 02 - SKILLS & TECH STACK ]"
      title="The stack behind my projects, category by category."
      deck="Each tool lists where it fits in my workflow and how confident I am with it, plus everything still on the learning list."
      meta={pageMeta}
      metaLoading={isLoading}
      metaError={isError}
      prev={{ direction: "← HOME", title: "About", href: "/about" }}
      next={{ direction: "NEXT →", title: "Experience", href: "/experience" }}
    >
      <div ref={contentRef} className="flex flex-col gap-20">
        <p
          ref={leadRef}
          className="max-w-[960px] font-body text-[18px] md:text-[20px] lg:text-[22px] leading-[1.55] text-text-primary"
        >
          Depth beats breadth. Five tools I know inside out are worth more
          than fifty logos I recognize, so anything new has to earn its
          place on this page.
        </p>

        {!isLoading && !isError && allCategories.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {["All", ...allCategories.map((c) => c.eyebrow)].map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => setActiveCategory(label)}
                className={`rounded-full border px-4 py-2 font-mono text-[11px] tracking-[1px] transition-[color,border-color,transform] hover:border-violet hover:text-text-primary active:scale-95 ${
                  activeCategory === label
                    ? "border-violet bg-surface text-text-primary"
                    : "border-border-glow-soft bg-surface text-text-secondary"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[200px] w-full" />
          </div>
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : (
          <div ref={categoriesRef} className="flex flex-col gap-20">
            {CATEGORIES.map((cat) => (
              <CategorySection key={cat.id} category={cat} />
            ))}
          </div>
        )}

        {learningLoading ? (
          <Skeleton className="h-[140px] w-full" />
        ) : learningError ? (
          <ErrorState onRetry={refetchLearning} />
        ) : learningTotal > 0 ? (
          <div
            ref={learningRef}
            className="flex flex-col gap-8 rounded border border-border-glow-soft bg-surface p-6 md:flex-row md:gap-16 md:p-10"
          >
            <div className="flex flex-col gap-3.5 md:w-[320px] md:shrink-0">
              <span className="font-mono text-[11px] font-medium tracking-[3px] text-violet">
                CURRENTLY LEARNING
              </span>
              <p className="font-body text-[15px] leading-[1.7] text-text-secondary">
                {learningTotal} thing{learningTotal === 1 ? "" : "s"} in
                progress right now. Kept public so the stack above never oversells itself.
              </p>
            </div>
            <div className="flex flex-1 flex-col gap-4">
              {learningItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-1.5 border-b border-border-glow-soft pb-3.5 md:flex-row md:gap-5"
                >
                  <div className="flex items-center gap-2.5 md:w-[170px] md:shrink-0">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[4px] bg-chip">
                      <TechIcon
                        name={item.name.toLowerCase().replace(/\s+/g, "-")}
                        className="h-[15px] w-[15px] text-text-primary"
                      />
                    </div>
                    <span className="font-body text-[16px] font-medium text-text-primary">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-body text-[15px] leading-[1.6] text-text-secondary">
                    {item.desc}
                  </span>
                </div>
              ))}
              {hasMoreLearning && (
                <LoadMoreButton
                  onClick={() => loadMoreLearning()}
                  loading={loadingMoreLearning}
                  label="LOAD MORE"
                />
              )}
            </div>
          </div>
        ) : null}
      </div>
    </PageLayout>
  );
}