"use client";

import { useRef } from "react";
import { SectionEyebrow, SectionHeading } from "@/shared/components/ui/SectionHeading";
import { DetailCta } from "@/shared/components/ui/DetailCta";
import { ProjectCard } from "./ProjectCard";
import { useScrollReveal } from "@/features/portfolio/hooks/useScrollReveal";

const PROJECTS = [
  {
    name: "Orbit",
    title: "Orbit",
    description: "Real-time collaborative whiteboard with CRDT sync and WebGL rendering.",
    tags: ["React", "WebGL", "CRDT"],
  },
  {
    name: "Ledgerline",
    title: "Ledgerline",
    description: "A ledger-grade finance dashboard with anomaly detection on transaction streams.",
    tags: ["Next.js", "Node", "Postgres"],
  },
  {
    name: "Kinet",
    title: "Kinet",
    description: "Motion-first component library used across six production products.",
    tags: ["TypeScript", "GSAP", "Storybook"],
  },
  {
    name: "Fathom",
    title: "Fathom",
    description: "Self-hosted analytics with sub-100ms query latency at 10M events/day.",
    tags: ["Rust", "ClickHouse", "Next.js"],
  },
];

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef, { selector: "[data-project-card]", y: 30, staggerAmount: 0.08 });

  return (
    <section id="projects" ref={sectionRef} className="w-full bg-bg py-14 md:py-[140px]">
      <div className="mx-5 md:mx-[120px] flex flex-col gap-6 md:gap-24">
        <div className="flex flex-col gap-2.5 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-2 md:gap-3">
            <SectionEyebrow>04 — PROJECTS</SectionEyebrow>
            <SectionHeading>Selected work</SectionHeading>
          </div>
          <p className="font-mono text-[10px] md:text-[11px] text-text-muted max-w-[360px]">
            <span className="hidden md:inline">
              ◆ Hover: card tilts toward cursor (tilt.js/GSAP) + violet-cyan glow follows pointer
            </span>
            <span className="md:hidden">
              ◆ GSAP — Cards rise and settle on scroll; press-and-hold tilts the card toward the touch point.
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-7">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>

        <DetailCta href="/projects" route="/projects" />
      </div>
    </section>
  );
}
