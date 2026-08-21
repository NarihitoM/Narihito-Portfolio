"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { X } from "lucide-react";
import {
  ease,
  gsap,
  registerGsap,
  REDUCED_MOTION_QUERY,
  NO_REDUCED_MOTION_QUERY,
} from "@/shared/lib/gsap";
import type { Testimonial } from "../types/types";

export function TestimonialDialog({ testimonial, onClose }: { testimonial: Testimonial; onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

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
      gsap.to(panel, { opacity: 0, scale: 0.95, y: 16, duration: 0.2, ease: "power2.in" });
      gsap.to(overlay, { opacity: 0, duration: 0.2, ease: "power2.in", onComplete: onClose });
    });

    setTimeout(() => mm.revert(), 300);
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        ref={panelRef}
        className="relative flex flex-col gap-6 w-full max-w-[640px] max-h-[85vh] overflow-y-auto rounded-[8px] border border-border-glow bg-bg-alt p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded border border-border-glow-soft text-text-muted transition-colors hover:text-text-primary"
        >
          <X size={16} />
        </button>

        <p className="font-body text-[16px] md:text-[18px] leading-[1.7] text-text-primary italic">
          &ldquo;{testimonial.quote}&rdquo;
        </p>

        <div className="flex items-center gap-4 border-t border-border-glow-soft pt-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-chip font-mono text-[13px] font-medium text-text-primary">
            {testimonial.initials}
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-body text-[14px] font-medium text-text-primary">
              {testimonial.name}
            </span>
            <span className="font-mono text-[11px] tracking-[0.5px] text-text-muted">
              {testimonial.role}
            </span>
          </div>
        </div>

        <span className="font-mono text-[11px] leading-[1.7] tracking-[0.5px] text-text-muted">
          {testimonial.context}
        </span>
      </div>
    </div>
  );
}
