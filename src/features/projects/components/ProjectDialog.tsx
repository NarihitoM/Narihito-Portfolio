"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import {
  ease,
  gsap,
  registerGsap,
  REDUCED_MOTION_QUERY,
  NO_REDUCED_MOTION_QUERY,
} from "@/shared/lib/gsap";
import { Chip } from "@/shared/components/ui/Chip";
import { TechIcon } from "@/shared/components/ui/TechIcon";
import { ExternalLink } from "lucide-react";
import { DialogCloseButton } from "@/shared/components/ui/DialogCloseButton";
import { ImageLightbox } from "@/shared/components/ui/ImageLightbox";
import { useLenisLock } from "@/shared/hooks/useLenisLock";
import type { ProjectCard } from "../types/types";

export function ProjectDialog({ project, onClose }: { project: ProjectCard; onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [zoomed, setZoomed] = useState(false);
  useLenisLock(true);

  useGSAP(
    () => {
      registerGsap();
      const overlay = overlayRef.current;
      const panel = panelRef.current;
      if (!overlay || !panel) return;

      const mm = gsap.matchMedia();

      mm.add(REDUCED_MOTION_QUERY, () => {
        gsap.set(overlay, { opacity: 1 });
        gsap.set(panel, { opacity: 1, scale: 1, y: 0 });
      });

      mm.add(NO_REDUCED_MOTION_QUERY, () => {
        gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: "power2.out" });
        gsap.fromTo(panel, { opacity: 0, scale: 0.92, y: 30 }, {
          opacity: 1, scale: 1, y: 0, duration: 0.4, ease: ease.entrance,
        });
      });

      return () => mm.revert();
    },
    { scope: panelRef },
  );

  const handleClose = () => {
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (!overlay || !panel) { onClose(); return; }

    const mm = gsap.matchMedia();
    mm.add(REDUCED_MOTION_QUERY, () => { onClose(); });

    mm.add(NO_REDUCED_MOTION_QUERY, () => {
      gsap.to(panel, { opacity: 0, scale: 0.9, y: 24, duration: 0.35, ease: "power2.in" });
      gsap.to(overlay, { opacity: 0, duration: 0.35, delay: 0.05, ease: "power2.in", onComplete: onClose });
    });

    setTimeout(() => mm.revert(), 500);
  };

  return (
    <>
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        ref={panelRef}
        className="relative flex flex-col gap-6 w-full max-w-[720px] max-h-[85vh] overflow-y-auto rounded-[8px] border border-border-glow bg-bg-alt p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogCloseButton onClick={handleClose} />

        {project.projectimg && (
          <button
            type="button"
            aria-label={`View ${project.title} image`}
            onClick={() => setZoomed(true)}
            className="w-full h-[240px] md:h-[320px] cursor-zoom-in rounded-[6px] overflow-hidden bg-surface border border-border-glow-soft transition-colors hover:border-violet"
          >
            <img
              src={project.projectimg}
              alt={project.title}
              className="h-full w-full object-cover"
            />
          </button>
        )}

        <div className="flex flex-col gap-3">
          <h2 className="font-display text-[26px] md:text-[32px] font-semibold leading-[1.15] tracking-[-0.8px] text-text-primary">
            {project.title}
          </h2>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-mono text-[11px] tracking-[1.5px] text-text-muted">
              {project.year}
            </span>
            <span className="font-mono text-[11px] tracking-[1.5px] text-text-muted">
              {project.category}
            </span>
            <span className="font-mono text-[11px] tracking-[1.5px] text-text-muted">
              {project.role}
            </span>
            <span className="font-mono text-[11px] tracking-[1.5px] text-violet font-medium">
              {project.status}
            </span>
          </div>
        </div>

        <p className="font-body text-[15px] md:text-[16px] leading-[1.7] text-text-secondary">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {project.chips.map((chip) => (
            <Chip key={chip} icon={chip}>{chip}</Chip>
          ))}
        </div>

        <div className="flex items-center gap-3 pt-2 border-t border-border-glow-soft">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 items-center gap-2 rounded border border-border-glow-soft px-4 font-mono text-[12px] text-text-secondary transition-colors hover:border-violet hover:text-violet"
            >
              <TechIcon name="github" className="h-4 w-4" />
              GitHub
            </a>
          )}
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 items-center gap-2 rounded border border-border-glow-soft px-4 font-mono text-[12px] text-text-secondary transition-colors hover:border-violet hover:text-violet"
            >
              <ExternalLink size={14} />
              Live Demo
            </a>
          )}
        </div>
      </div>
    </div>

    {zoomed && project.projectimg && (
      <ImageLightbox
        src={project.projectimg}
        alt={project.title}
        onClose={() => setZoomed(false)}
      />
    )}
    </>
  );
}
