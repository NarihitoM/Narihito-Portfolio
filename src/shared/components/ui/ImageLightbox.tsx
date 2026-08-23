"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { DialogCloseButton } from "./DialogCloseButton";
import {
  ease,
  gsap,
  registerGsap,
  REDUCED_MOTION_QUERY,
  NO_REDUCED_MOTION_QUERY,
} from "@/shared/lib/gsap";

export function ImageLightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
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
        gsap.fromTo(panel, { opacity: 0, scale: 0.9, y: 30 }, {
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
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div
        ref={panelRef}
        className="relative w-full max-w-[560px] max-h-[85vh] aspect-[3/4] overflow-hidden rounded-[8px] border border-border-glow bg-bg-alt"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogCloseButton onClick={handleClose} />
        <Image src={src} alt={alt} fill className="object-cover" sizes="560px" />
      </div>
    </div>
  );
}
