"use client";

import { useRef } from "react";
import { SectionEyebrow, SectionHeading } from "@/shared/components/ui/SectionHeading";
import { DetailCta } from "@/shared/components/ui/DetailCta";
import { ErrorState } from "@/shared/components/ui/ErrorState";
import { useScrollReveal } from "@/features/portfolio/hooks/useScrollReveal";
import { useCertificates } from "@/features/certificates/hooks/useCertificates";
import { useCertificatesUI } from "@/features/certificates/store/certificatesUIStore";
import { CertificateCard, CertificateCardSkeleton } from "@/features/certificates/components/CertificateCard";
import { CertificateDialog } from "@/features/certificates/components/CertificateDialog";
import { Carousel } from "./Carousel";

export function Certificates() {
  const sectionRef = useRef<HTMLElement>(null);
  const { certificates, isLoading, isError, refetch } = useCertificates(4);
  const { selectedCertificateId, setSelectedCertificateId } = useCertificatesUI();
  const selected = certificates.find((certificate) => certificate.id === selectedCertificateId) ?? null;
  useScrollReveal(sectionRef, {
    selector: "[data-certificate-card]",
    y: 30,
    staggerAmount: 0.08,
    dependencies: [certificates, isLoading],
  });

  if (!isLoading && !isError && certificates.length === 0) return null;

  const cta = <DetailCta href="/certificates" route="/certificates" />;

  return (
    <section id="certificates" ref={sectionRef} className="w-full py-12 md:py-[72px]">
      <div className="mx-5 md:mx-10 lg:mx-[120px] flex flex-col gap-6 md:gap-12">
        <div className="flex flex-col gap-2 md:gap-3">
          <SectionEyebrow>06 - CERTIFICATES</SectionEyebrow>
          <SectionHeading>Certificates &amp; credentials</SectionHeading>
        </div>

        {isLoading ? (
          <Carousel label="Certificates" action={cta}>
            {[0, 1, 2].map((i) => (
              <CertificateCardSkeleton key={i} />
            ))}
          </Carousel>
        ) : isError ? (
          <>
            <ErrorState onRetry={refetch} />
            {cta}
          </>
        ) : (
          <Carousel label="Certificates" action={cta}>
            {certificates.map((certificate) => (
              <CertificateCard key={certificate.id} certificate={certificate} />
            ))}
          </Carousel>
        )}
      </div>

      {selected && <CertificateDialog certificate={selected} onClose={() => setSelectedCertificateId(null)} />}
    </section>
  );
}
