"use client";

import { useMemo, useRef, useState } from "react";
import { SectionEyebrow, SectionHeading } from "@/shared/components/ui/SectionHeading";
import { DetailCta } from "@/shared/components/ui/DetailCta";
import { TechIcon } from "@/shared/components/ui/TechIcon";
import { useScrollReveal } from "@/features/portfolio/hooks/useScrollReveal";
import { useTilt } from "@/shared/hooks/useTilt";
import { useSkills } from "@/features/skills/hooks/useSkills";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { ErrorState } from "@/shared/components/ui/ErrorState";
import { ProficiencyDialog } from "@/features/skills/components/ProficiencyDialog";
import type { Tool } from "@/features/skills/types/types";

function SkillCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 md:gap-3.5 bg-bg-panel p-[18px] md:p-6 rounded-[4px] border border-transparent">
      <Skeleton className="h-[22px] w-[22px] md:h-6 md:w-6" />
      <Skeleton className="h-[17px] md:h-[18px] w-20" />
    </div>
  );
}

export function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const { categories, isLoading, isError, refetch } = useSkills();
  const SKILLS = useMemo(() => {
    const allTools = categories.flatMap((c) => c.tools);
    return Array.from(new Map(allTools.map((t) => [t.name, t])).values()).slice(0, 10);
  }, [categories]);
  const [selected, setSelected] = useState<Tool | null>(null);
  useScrollReveal(sectionRef, { selector: "[data-skill-card]", staggerAmount: 0.04, y: 16, dependencies: [SKILLS, isLoading] });

  return (
    <section id="skills" ref={sectionRef} className="w-full py-12 md:py-[72px]">
      <div className="mx-5 md:mx-10 lg:mx-[120px] flex flex-col gap-6 md:gap-24">
        <div className="flex flex-col gap-2 md:gap-3">
          <SectionEyebrow>02 - SKILLS & TECH STACK</SectionEyebrow>
          <SectionHeading>Tools I work with</SectionHeading>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 2xl:grid-cols-7 gap-3 md:gap-4">
            {Array.from({ length: 10 }, (_, i) => (
              <SkillCardSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : SKILLS.length === 0 ? (
          <p className="font-body fs-14 text-text-muted">No skills yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 2xl:grid-cols-7 gap-3 md:gap-4">
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
      className="flex flex-col gap-3 md:gap-3.5 bg-bg-panel p-[18px] md:p-6 rounded-[4px] cursor-pointer border border-transparent transition-colors hover:border-border-glow-soft active:border-violet"
    >
      <TechIcon name={skill.name} className="h-[22px] w-[22px] md:h-6 md:w-6 text-text-primary" />
      <span className="font-mono fs-13 md:text-[14px] text-text-secondary">{skill.name}</span>
    </div>
  );
}