"use client";

import { useRef } from "react";
import { gsap, ease } from "@/shared/lib/gsap";
import { Chip } from "@/shared/components/ui/Chip";

type Project = {
  name: string;
  title: string;
  description: string;
  tags: string[];
};

export function ProjectCard({ project }: { project: Project }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const reducedMotion = () =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion()) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;

    gsap.to(card, {
      rotateX: py * -8,
      rotateY: px * 8,
      duration: 0.3,
      ease: ease.interaction,
      transformPerspective: 800,
    });
  };

  const resetTilt = () => {
    gsap.to(cardRef.current, { rotateX: 0, rotateY: 0, duration: 0.4, ease: ease.interaction });
  };

  const handleTouchStart = () => {
    if (reducedMotion()) return;
    gsap.to(cardRef.current, { rotateX: -3, rotateY: 3, duration: 0.3, ease: ease.interaction });
  };

  return (
    <div
      ref={cardRef}
      data-project-card
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
      onTouchStart={handleTouchStart}
      onTouchEnd={resetTilt}
      className="flex flex-col bg-bg-panel rounded-[4px] overflow-hidden"
      style={{ willChange: "transform" }}
    >
      <div className="flex h-[170px] md:h-[200px] w-full items-center justify-center bg-media">
        <span className="font-mono text-[12px] uppercase text-text-muted">{project.name}</span>
      </div>
      <div className="flex flex-col gap-2.5 md:gap-3.5 p-[18px] md:p-6">
        <h3 className="font-display text-[20px] md:text-[22px] font-semibold text-text-primary">{project.title}</h3>
        <p className="font-body text-[14px] text-text-secondary">{project.description}</p>
        <div className="flex flex-wrap gap-2 pt-1 md:pt-0">
          {project.tags.map((tag) => (
            <Chip key={tag}>{tag}</Chip>
          ))}
        </div>
      </div>
    </div>
  );
}
