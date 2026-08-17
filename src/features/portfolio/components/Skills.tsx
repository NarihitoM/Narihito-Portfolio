"use client";

import { useRef } from "react";
import { SectionEyebrow, SectionHeading } from "@/shared/components/ui/SectionHeading";
import { DetailCta } from "@/shared/components/ui/DetailCta";
import { TechIcon } from "@/shared/components/ui/TechIcon";
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
        <div className="flex flex-col gap-2 md:gap-3">
          <SectionEyebrow>02 — STACK</SectionEyebrow>
          <SectionHeading>Tools I reach for</SectionHeading>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
          {SKILLS.map((skill) => (
            <div
              key={skill}
              data-skill-card
              className="flex flex-col gap-3 md:gap-3.5 bg-bg-panel p-[18px] md:p-6 rounded-[4px]"
            >
              <TechIcon
                name={skill}
                className="h-[22px] w-[22px] md:h-6 md:w-6 text-text-primary"
              />
              <span className="font-mono text-[13px] md:text-[14px] text-text-secondary">{skill}</span>
            </div>
          ))}
        </div>

        <DetailCta href="/tools" route="/tools" />
      </div>
    </section>
  );
}
