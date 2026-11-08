"use client";

import { useTilt } from "@/shared/hooks/useTilt";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { useCertificatesUI } from "../store/certificatesUIStore";
import { CertificateMeta } from "./CertificateMeta";
import { CredentialLink } from "./CredentialLink";
import type { Certificate } from "../types/types";

export function CertificateCard({ certificate }: { certificate: Certificate }) {
  const { ref: tiltRef, style: tiltStyle, onMouseMove, onMouseLeave, onTouchStart, onTouchEnd } = useTilt<HTMLDivElement>();
  const setSelectedCertificateId = useCertificatesUI((s) => s.setSelectedCertificateId);

  return (
    <div
      data-certificate-card
      role="button"
      tabIndex={0}
      onClick={() => setSelectedCertificateId(certificate.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") setSelectedCertificateId(certificate.id);
      }}
      ref={tiltRef}
      style={tiltStyle}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className="flex cursor-pointer flex-col overflow-hidden rounded-[6px] border border-border-glow-soft bg-surface transition-colors hover:border-border-glow active:border-violet active:bg-chip/40"
    >
      {certificate.image ? (
        <div className="h-[180px] md:h-[220px] w-full bg-chip p-3">
          <img src={certificate.image} alt={certificate.title} className="h-full w-full object-contain" />
        </div>
      ) : (
        <div className="flex h-[180px] md:h-[220px] w-full items-center justify-center bg-chip">
          <span className="font-mono text-[11px] tracking-[2px] text-text-muted">{certificate.issuer.toUpperCase()}</span>
        </div>
      )}

      <div className="flex flex-1 flex-col gap-2.5 p-5 md:p-6">
        <h3 className="font-display fs-20 md:text-[24px] font-semibold leading-[1.2] tracking-[-0.5px] text-text-primary line-clamp-2">
          {certificate.title}
        </h3>
        {certificate.description && (
          <p className="font-body fs-14 md:text-[15px] leading-[1.6] text-text-secondary line-clamp-3">
            {certificate.description}
          </p>
        )}
        <CertificateMeta certificate={certificate} divider={false} showId={false} className="mt-auto pt-2" />
        <CredentialLink certificate={certificate} className="mt-2" />
      </div>
    </div>
  );
}

export function CertificateCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-[6px] border border-border-glow-soft bg-surface">
      <Skeleton className="h-[180px] md:h-[220px] w-full rounded-none border-0" />
      <div className="flex flex-col gap-2.5 p-5 md:p-6">
        <Skeleton className="h-6 md:h-7 w-4/5" />
        <Skeleton className="h-[67px] md:h-[72px] w-full" />
        <div className="flex flex-col gap-2 pt-2">
          <Skeleton className="h-[18px] w-44" />
          <Skeleton className="h-[18px] w-36" />
        </div>
        <Skeleton className="mt-2 h-10 w-[180px]" />
      </div>
    </div>
  );
}
