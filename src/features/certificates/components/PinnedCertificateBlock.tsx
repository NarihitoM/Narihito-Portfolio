"use client";

import { useState } from "react";
import { ImageLightbox } from "@/shared/components/ui/ImageLightbox";
import { CertificateMeta } from "./CertificateMeta";
import { CertificateSkills } from "./CertificateSkills";
import { CredentialLink } from "./CredentialLink";
import type { Certificate } from "../types/types";

export function PinnedCertificateBlock({ certificate }: { certificate: Certificate }) {
  const [zoomed, setZoomed] = useState(false);

  return (
    <div data-pinned className="flex flex-col lg:flex-row gap-8 lg:gap-14">
      <div className="flex-1">
        {certificate.image ? (
          <button
            type="button"
            aria-label={`View ${certificate.title} certificate`}
            onClick={() => setZoomed(true)}
            className="block h-[240px] lg:h-[320px] w-full cursor-zoom-in overflow-hidden rounded-[6px] border border-border-glow-soft bg-chip p-4 transition-colors hover:border-violet"
          >
            <img src={certificate.image} alt={certificate.title} className="h-full w-full object-contain" />
          </button>
        ) : (
          <div className="flex h-[240px] lg:h-[320px] w-full items-center justify-center rounded-[6px] border border-border-glow-soft bg-surface">
            <span className="font-mono text-[12px] tracking-[2px] text-text-muted">{certificate.issuer.toUpperCase()}</span>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col gap-6">
        <h2 className="font-display fs-28 md:text-[34px] font-semibold leading-[1.15] tracking-[-0.8px] text-text-primary">
          {certificate.title}
        </h2>
        {certificate.description && (
          <p className="font-body fs-15 md:text-[16px] leading-[1.7] text-text-secondary">{certificate.description}</p>
        )}
        <CertificateSkills certificate={certificate} />
        <CertificateMeta certificate={certificate} />
        <CredentialLink certificate={certificate} />
      </div>

      {zoomed && certificate.image && (
        <ImageLightbox src={certificate.image} alt={certificate.title} onClose={() => setZoomed(false)} />
      )}
    </div>
  );
}
