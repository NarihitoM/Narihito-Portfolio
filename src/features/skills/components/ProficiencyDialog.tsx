"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { TechIcon } from "@/shared/components/ui/TechIcon";
import { DialogCloseButton } from "@/shared/components/ui/DialogCloseButton";
import { useLenisLock } from "@/shared/hooks/useLenisLock";
import {
  ease,
  gsap,
  registerGsap,
  REDUCED_MOTION_QUERY,
  NO_REDUCED_MOTION_QUERY,
} from "@/shared/lib/gsap";
import type { Tool } from "../types/types";

export function ProficiencyDialog({ tool, onClose }: { tool: Tool; onClose: () => void }) {
  const [progress, setProgress] = useState(0);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  useLenisLock(true);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(tool.proficiency), 100);
    return () => clearTimeout(timer);
  }, [tool.proficiency]);

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
    <div ref={overlayRef} className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={handleClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        ref={panelRef}
        className="relative flex flex-col gap-6 w-full max-w-[400px] rounded-[8px] border border-border-glow bg-bg-alt p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogCloseButton onClick={handleClose} />

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
