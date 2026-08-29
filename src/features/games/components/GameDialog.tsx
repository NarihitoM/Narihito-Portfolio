"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { DialogCloseButton } from "@/shared/components/ui/DialogCloseButton";
import { ImageLightbox } from "@/shared/components/ui/ImageLightbox";
import {
  ease,
  gsap,
  registerGsap,
  REDUCED_MOTION_QUERY,
  NO_REDUCED_MOTION_QUERY,
} from "@/shared/lib/gsap";
import type { Game } from "../types/types";

export function GameDialog({ game, onClose }: { game: Game; onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [zoomed, setZoomed] = useState(false);

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
        className="relative flex flex-col gap-6 w-full max-w-[640px] max-h-[85vh] overflow-y-auto rounded-[8px] border border-border-glow bg-bg-alt p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogCloseButton onClick={handleClose} />

        {game.pic && (
          <button
            type="button"
            aria-label={`View ${game.name} image`}
            onClick={() => setZoomed(true)}
            className="w-full h-[240px] md:h-[320px] cursor-zoom-in overflow-hidden rounded-[6px] border border-border-glow-soft bg-surface transition-colors hover:border-violet"
          >
            <img src={game.pic} alt={game.name} className="h-full w-full object-cover" />
          </button>
        )}

        <div className="flex flex-col gap-3">
          <span className="font-mono text-[11px] font-medium tracking-[2px] text-violet uppercase">
            {game.type}
          </span>
          <h2 className="font-display text-[26px] md:text-[32px] font-semibold leading-[1.15] tracking-[-0.8px] text-text-primary">
            {game.name}
          </h2>
        </div>

        <p className="font-body text-[14px] md:text-[15px] leading-[1.7] text-text-secondary">
          {game.description}
        </p>

        {game.url && (
          <a
            href={game.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="self-start rounded-[4px] border border-border-glow-soft px-5 py-2.5 font-mono text-[12px] tracking-[1px] text-text-primary transition-colors hover:border-violet hover:text-violet"
          >
            PLAY →
          </a>
        )}
      </div>
    </div>

    {zoomed && game.pic && (
      <ImageLightbox
        src={game.pic}
        alt={game.name}
        onClose={() => setZoomed(false)}
      />
    )}
    </>
  );
}
