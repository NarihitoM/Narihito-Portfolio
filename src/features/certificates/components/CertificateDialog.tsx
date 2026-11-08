"use client";

import { useRef, useState } from "react";
import { createPortal } from "react-dom";
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
import { useLenisLock } from "@/shared/hooks/useLenisLock";
import { CertificateMeta } from "./CertificateMeta";
import { CertificateSkills } from "./CertificateSkills";
import { CredentialLink } from "./CredentialLink";
import type { Certificate } from "../types/types";

export function CertificateDialog({ certificate, onClose }: { certificate: Certificate; onClose: () => void }) {
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

  return createPortal(
    <>
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        ref={panelRef}
        data-lenis-prevent
        className="relative flex flex-col gap-6 w-full max-w-[640px] max-h-[85dvh] overflow-y-auto overscroll-contain rounded-[8px] border border-border-glow bg-bg-alt p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogCloseButton onClick={handleClose} />

        {certificate.image && (
          <button
            type="button"
            aria-label={`View ${certificate.title} certificate`}
            onClick={() => setZoomed(true)}
            className="w-full h-[240px] md:h-[320px] shrink-0 cursor-zoom-in overflow-hidden rounded-[6px] border border-border-glow-soft bg-chip p-4 transition-colors hover:border-violet"
          >
            <img src={certificate.image} alt={certificate.title} className="h-full w-full object-contain" />
          </button>
        )}

        <h2 className="font-display fs-26 md:text-[32px] font-semibold leading-[1.15] tracking-[-0.8px] text-text-primary">
          {certificate.title}
        </h2>

        {certificate.description && (
          <p className="font-body fs-14 md:text-[15px] leading-[1.7] text-text-secondary">
            {certificate.description}
          </p>
        )}

        <CertificateSkills certificate={certificate} />
        <CertificateMeta certificate={certificate} divider={false} />
        <CredentialLink certificate={certificate} />
      </div>
    </div>

    {zoomed && certificate.image && (
      <ImageLightbox
        src={certificate.image}
        alt={certificate.title}
        onClose={() => setZoomed(false)}
      />
    )}
    </>,
    document.body,
  );
}
