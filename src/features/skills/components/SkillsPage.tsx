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
import { TechIcon } from "@/shared/components/ui/TechIcon";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { ErrorState } from "@/shared/components/ui/ErrorState";
import { useSkills } from "../hooks/useSkills";
import { useSkillsUI } from "../store/skillsUIStore";
import { Tool } from "../types/types";

const LEARNING = [
  { name: "Rust", desc: "Reading the book slowly, writing small CLI tools. Not in production, not pretending otherwise." },
  { name: "WebGPU", desc: "Following the spec settle. Curious what it does to the Three.js workflow." },
  { name: "Motion accessibility", desc: "Auditing my own sites against prefers-reduced-motion and vestibular guidance." },
];

function ProficiencyBar({ level }: { level: number }) {
  return (
    <div className="flex gap-[5px] items-center">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          data-proficiency-seg
          className="block h-1 w-[18px] rounded-sm bg-violet"
          style={{ opacity: i < level ? 1 : 0.15 }}
        />
      ))}
    </div>
  );
}

function ToolRow({ tool }: { tool: Tool }) {
  return (
    <div
      data-tool-row
      className="group flex flex-col gap-3 border-t border-border-glow-soft py-4 transition-colors hover:bg-chip/30 md:flex-row md:items-center md:gap-7"
    >
      <div className="flex items-center gap-3 md:w-[290px] md:shrink-0">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[4px] bg-chip">
          <TechIcon name={tool.icon} className="h-[18px] w-[18px] text-text-primary" />
        </div>
        <span className="font-body text-[18px] font-medium text-text-primary">
          {tool.name}
        </span>
      </div>
      <span className="font-body text-[15px] leading-[1.6] text-text-secondary md:flex-1">
        {tool.note}
      </span>
      <div className="flex items-center justify-between gap-4 md:contents">
        <span className="font-mono text-[11px] tracking-[2px] text-text-muted md:w-[110px] md:shrink-0 md:text-right">
          {tool.frequency}
        </span>
        <ProficiencyBar level={tool.proficiency} />
      </div>
    </div>
  );
}

export function SkillsPage() {
  const contentRef = useRef<HTMLDivElement>(null);
  const { categories: allCategories, isLoading, isError, refetch } = useSkills();
  const { activeCategory, setActiveCategory } = useSkillsUI();
  const toolCount = allCategories.reduce((total, category) => total + category.tools.length, 0);
  const primaryStack = allCategories[0]?.tools.slice(0, 2).map((tool) => tool.name).join(" + ") || "Loading";
  const pageMeta = [
    { key: "SOURCE", value: "DASHBOARD API" },
    { key: "CATEGORIES", value: String(allCategories.length) },
    { key: "TOOLS LISTED", value: String(toolCount) },
    { key: "PRIMARY", value: primaryStack.toUpperCase() },
  ];

  const CATEGORIES =
    activeCategory === "All" ? allCategories : allCategories.filter((c) => c.eyebrow === activeCategory);

  useGSAP(
    () => {
      registerGsap();
      const content = contentRef.current;
      if (!content) return;

      const mm = gsap.matchMedia();

      mm.add(REDUCED_MOTION_QUERY, () => {
        gsap.set("[data-tools-reveal]", { opacity: 1, y: 0 });
        gsap.set("[data-proficiency-seg]", { scaleX: 1 });
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

        gsap.from("[data-tools-category]", {
          opacity: 0,
          y: 24,
          duration: 0.6,
          ease: ease.entrance,
          stagger: 0.1,
          scrollTrigger: { trigger: content, start: "top 70%" },
        });

        gsap.from("[data-proficiency-seg]", {
          scaleX: 0,
          transformOrigin: "left",
          duration: 0.45,
          ease: "power2.out",
          stagger: { each: 0.06, from: "start" },
          scrollTrigger: { trigger: content, start: "top 60%", once: true },
        });

        gsap.from("[data-learning-item]", {
          opacity: 0,
          y: 16,
          duration: 0.5,
          ease: ease.entrance,
          stagger: 0.08,
          scrollTrigger: { trigger: "[data-learning]", start: "top 80%" },
        });

        return undefined;
      });

      return () => mm.revert();
    },
    { scope: contentRef, dependencies: [CATEGORIES] },
  );

  return (
    <PageLayout
      backLink="Back to Home"
      backHref="/"
      breadcrumb="HOME / SKILLS"
      eyebrow="[ 02 — SKILLS & TECH STACK ]"
      title="The tools I reach for, and the ones I reach for first."
      deck="A working inventory rather than a badge wall — what each tool is actually used for, how often, and where I am still learning."
      meta={pageMeta}
      metaLoading={isLoading}
      prev={{ direction: "← HOME", title: "About", href: "/about" }}
      next={{ direction: "NEXT →", title: "Experience", href: "/experience" }}
    >
      <div ref={contentRef} className="flex flex-col gap-20">
        <p
          data-lead
          className="max-w-[960px] font-body text-[18px] md:text-[20px] lg:text-[22px] leading-[1.55] text-text-primary"
        >
          I keep the stack small on purpose. Four or five tools I know deeply
          beat a dozen I have only skimmed the docs for — and the bar for adding
          a dependency is that it saves more than the few lines it replaces.
        </p>

        {!isLoading && !isError && allCategories.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {["All", ...allCategories.map((c) => c.eyebrow)].map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => setActiveCategory(label)}
                className={`rounded-full border px-4 py-2 font-mono text-[11px] tracking-[1px] transition-colors hover:border-violet hover:text-text-primary ${
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
          CATEGORIES.map((cat) => (
            <div key={cat.eyebrow} data-tools-category className="flex flex-col gap-[18px]">
              <div className="flex items-center gap-5 border-b border-border-glow-soft pb-1">
                <span className="font-mono text-[11px] font-medium tracking-[3px] text-violet">
                  {cat.eyebrow}
                </span>
                <span className="font-body text-[15px] text-text-muted">
                  {cat.note}
                </span>
              </div>
              {cat.tools.map((tool) => (
                <ToolRow key={tool.name} tool={tool} />
              ))}
            </div>
          ))
        )}

        <div
          data-learning
          className="flex flex-col gap-8 rounded border border-border-glow-soft bg-surface p-6 md:flex-row md:gap-16 md:p-10"
        >
          <div className="flex flex-col gap-3.5 md:w-[320px] md:shrink-0">
            <span className="font-mono text-[11px] font-medium tracking-[3px] text-violet">
              CURRENTLY LEARNING
            </span>
            <p className="font-body text-[15px] leading-[1.7] text-text-secondary">
              Three things on the bench this quarter. Listed here so the stack
              above stays honest.
            </p>
          </div>
          <div className="flex flex-1 flex-col gap-4">
            {LEARNING.map((item) => (
              <div
                key={item.name}
                data-learning-item
                className="flex flex-col gap-1.5 border-b border-border-glow-soft pb-3.5 md:flex-row md:gap-5"
              >
                <span className="font-body text-[16px] font-medium text-text-primary md:w-[170px] md:shrink-0">
                  {item.name}
                </span>
                <span className="font-body text-[15px] leading-[1.6] text-text-secondary">
                  {item.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
