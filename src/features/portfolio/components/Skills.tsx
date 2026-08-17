"use client";

import { useRef } from "react";
import { SectionEyebrow, SectionHeading } from "@/shared/components/ui/SectionHeading";
import { DetailCta } from "@/shared/components/ui/DetailCta";
import { useScrollReveal } from "@/features/portfolio/hooks/useScrollReveal";

const SKILLS = [
  "React",
  "TypeScript",
  "Node.js",
  "Next.js",
  "PostgreSQL",
  "GraphQL",
  "Three.js",
  "GSAP",
  "Docker",
  "AWS",
];

export function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef, { selector: "[data-skill-card]", staggerAmount: 0.04, y: 16 });

  return (
    <section id="skills" ref={sectionRef} className="w-full bg-bg py-14 md:py-[140px]">
      <div className="mx-5 md:mx-[120px] flex flex-col gap-6 md:gap-24">
        <div className="flex flex-col gap-2.5 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-2 md:gap-3">
            <SectionEyebrow>02 — STACK</SectionEyebrow>
            <SectionHeading>Tools I reach for</SectionHeading>
          </div>
          <p className="hidden md:block font-mono text-[11px] text-text-muted max-w-[340px]">
            ◆ GSAP — staggered fade-and-rise on scroll, ~40ms stagger per icon
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
          {SKILLS.map((skill) => (
            <div
              key={skill}
              data-skill-card
              className="flex flex-col gap-3 md:gap-3.5 bg-bg-panel p-[18px] md:p-6 rounded-[4px]"
            >
              <span className="flex h-[22px] w-[22px] md:h-6 md:w-6 items-center justify-center rounded-[3px] bg-chip font-mono text-[10px] text-text-primary">
                {skill[0]}
              </span>
              <span className="font-mono text-[13px] md:text-[14px] text-text-secondary">{skill}</span>
            </div>
          ))}
        </div>

        <p className="md:hidden font-mono text-[10px] text-text-muted">
          ◆ GSAP — staggered fade-and-rise on scroll, ~40ms stagger per icon
        </p>

        <DetailCta href="/tools" route="/tools" />
      </div>
    </section>
  );
}
