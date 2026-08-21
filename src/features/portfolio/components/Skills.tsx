"use client";

import { useRef, useState, useEffect } from "react";
import { SectionEyebrow, SectionHeading } from "@/shared/components/ui/SectionHeading";
import { DetailCta } from "@/shared/components/ui/DetailCta";
import { TechIcon } from "@/shared/components/ui/TechIcon";
import { useScrollReveal } from "@/features/portfolio/hooks/useScrollReveal";
import { useTilt } from "@/shared/hooks/useTilt";
import { useSkills } from "@/features/skills/hooks/useSkills";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { ErrorState } from "@/shared/components/ui/ErrorState";
import type { Tool } from "@/features/skills/types/types";

function ProficiencyDialog({ tool, onClose }: { tool: Tool; onClose: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(tool.proficiency), 100);
    return () => clearTimeout(timer);
  }, [tool.proficiency]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative flex flex-col gap-6 w-full max-w-[400px] rounded-[8px] border border-border-glow bg-bg-alt p-6 md:p-8 animate-in zoom-in-95 slide-in-from-bottom-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded border border-border-glow-soft text-text-muted transition-colors hover:text-text-primary"
        >
          &times;
        </button>

        <div className="flex items-center gap-4">
          <TechIcon name={tool.name} className="h-8 w-8 text-text-primary" />
          <h2 className="font-display text-[22px] font-semibold text-text-primary">{tool.name}</h2>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] tracking-[2px] text-text-muted">PROFICIENCY</span>
            <span className="font-mono text-[14px] font-medium text-violet">{progress}%</span>
          </div>
          <div className="relative h-3 w-full rounded-full bg-border-glow-soft overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-violet to-cyan transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-border-glow-soft">
          <span className="font-mono text-[10px] tracking-[1.5px] text-text-muted">
            {progress >= 80 ? "EXPERT" : progress >= 50 ? "ADVANCED" : progress >= 25 ? "INTERMEDIATE" : "BEGINNER"}
          </span>
        </div>
      </div>
    </div>
  );
}

export function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const { categories, isLoading, isError, refetch } = useSkills();
  const allTools = categories.flatMap((c) => c.tools);
  const SKILLS = Array.from(new Map(allTools.map((t) => [t.name, t])).values()).slice(0, 10);
  const [selected, setSelected] = useState<Tool | null>(null);
  useScrollReveal(sectionRef, { selector: "[data-skill-card]", staggerAmount: 0.04, y: 16, dependencies: [SKILLS, isLoading] });

  return (
    <section id="skills" ref={sectionRef} className="w-full bg-bg py-14 md:py-[140px]">
      <div className="mx-5 md:mx-10 lg:mx-[120px] flex flex-col gap-6 md:gap-24">
        <div className="flex flex-col gap-2 md:gap-3">
          <SectionEyebrow>02 — STACK</SectionEyebrow>
          <SectionHeading>Tools I reach for</SectionHeading>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {Array.from({ length: 10 }, (_, i) => (
              <Skeleton key={i} className="h-[92px] md:h-[104px] w-full" />
            ))}
          </div>
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {SKILLS.map((skill) => (
              <SkillCard key={skill.id} skill={skill} onClick={() => setSelected(skill)} />
            ))}
          </div>
        )}

        <DetailCta href="/skills" route="/skills" />
      </div>

      {selected && <ProficiencyDialog tool={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}

function SkillCard({ skill, onClick }: { skill: Tool; onClick: () => void }) {
  const tilt = useTilt<HTMLDivElement>();

  return (
    <div
      {...tilt}
      data-skill-card
      onClick={onClick}
      className="flex flex-col gap-3 md:gap-3.5 bg-bg-panel p-[18px] md:p-6 rounded-[4px] cursor-pointer border border-transparent hover:border-border-glow-soft transition-colors"
    >
      <TechIcon name={skill.name} className="h-[22px] w-[22px] md:h-6 md:w-6 text-text-primary" />
      <span className="font-mono text-[13px] md:text-[14px] text-text-secondary">{skill.name}</span>
    </div>
  );
}