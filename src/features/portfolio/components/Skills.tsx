"use client";

import { useRef } from "react";
import { SectionEyebrow, SectionHeading } from "@/shared/components/ui/SectionHeading";
import { DetailCta } from "@/shared/components/ui/DetailCta";
import { TechIcon } from "@/shared/components/ui/TechIcon";
import { useScrollReveal } from "@/features/portfolio/hooks/useScrollReveal";
import { useTilt } from "@/shared/hooks/useTilt";
import { useSkills } from "@/features/skills/hooks/useSkills";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { ErrorState } from "@/shared/components/ui/ErrorState";

export function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const { categories, isLoading, isError, refetch } = useSkills();
  const SKILLS = categories.flatMap((c) => c.tools).slice(0, 10);
  useScrollReveal(sectionRef, { selector: "[data-skill-card]", staggerAmount: 0.04, y: 16, dependencies: [SKILLS] });

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
              <SkillCard key={skill.id} skill={skill.name} />
            ))}
          </div>
        )}

        <DetailCta href="/skills" route="/skills" />
      </div>
    </section>
  );
}

function SkillCard({ skill }: { skill: string }) {
  const tilt = useTilt<HTMLDivElement>();

  return (
    <div
      {...tilt}
      data-skill-card
      className="flex flex-col gap-3 md:gap-3.5 bg-bg-panel p-[18px] md:p-6 rounded-[4px]"
    >
      <TechIcon name={skill} className="h-[22px] w-[22px] md:h-6 md:w-6 text-text-primary" />
      <span className="font-mono text-[13px] md:text-[14px] text-text-secondary">{skill}</span>
    </div>
  );
}
