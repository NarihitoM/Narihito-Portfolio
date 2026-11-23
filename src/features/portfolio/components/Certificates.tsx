"use client";

import { useRef } from "react";
import { SectionEyebrow, SectionHeading } from "@/shared/components/ui/SectionHeading";
import { DetailCta } from "@/shared/components/ui/DetailCta";
import { ErrorState } from "@/shared/components/ui/ErrorState";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { ShowcaseSkeleton } from "@/shared/components/ui/ShowcaseSkeleton";
import { useScrollReveal } from "@/features/portfolio/hooks/useScrollReveal";
import { useCertificates } from "@/features/certificates/hooks/useCertificates";
import { useCertificatesUI } from "@/features/certificates/store/certificatesUIStore";
import { CertificateCard, CertificateCardSkeleton } from "@/features/certificates/components/CertificateCard";
import { CertificateDialog } from "@/features/certificates/components/CertificateDialog";
import { PinnedCertificateBlock } from "@/features/certificates/components/PinnedCertificateBlock";
import { Carousel } from "./Carousel";

const EYEBROW = "font-mono fs-15 md:text-[17px] font-medium tracking-[3px] text-violet";

export function Certificates() {
  const sectionRef = useRef<HTMLElement>(null);
  const { certificates, isLoading, isError, refetch } = useCertificates(5);
  const { selectedCertificateId, setSelectedCertificateId } = useCertificatesUI();
  const selected = certificates.find((certificate) => certificate.id === selectedCertificateId) ?? null;
  const pinned = certificates.find((certificate) => certificate.pinned);
  const others = certificates.filter((certificate) => certificate !== pinned).slice(0, 4);
  useScrollReveal(sectionRef, {
    selector: "[data-pinned], [data-certificate-card]",
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
          <div className="flex flex-col gap-12 md:gap-16">
            <div className="flex flex-col gap-8">
              <Skeleton className="h-[22px] md:h-[25px] w-28" />
              <ShowcaseSkeleton />
            </div>
            <div className="flex flex-col gap-8">
              <Skeleton className="h-[22px] md:h-[25px] w-44" />
              <Carousel label="Certificates" action={cta}>
                {[0, 1, 2].map((i) => (
                  <CertificateCardSkeleton key={i} />
                ))}
              </Carousel>
            </div>
          </div>
        ) : isError ? (
          <>
            <ErrorState onRetry={refetch} />
            {cta}
          </>
        ) : (
          <div className="flex flex-col gap-12 md:gap-16">
            {pinned && (
              <div className="flex flex-col gap-8">
                <span className={EYEBROW}>PINNED</span>
                <PinnedCertificateBlock certificate={pinned} />
              </div>
            )}
            {others.length > 0 ? (
              <div className="flex flex-col gap-8">
                {pinned && <span className={EYEBROW}>MORE CERTIFICATES</span>}
                <Carousel label="Certificates" action={cta}>
                  {others.map((certificate) => (
                    <CertificateCard key={certificate.id} certificate={certificate} />
                  ))}
                </Carousel>
              </div>
            ) : (
              cta
            )}
          </div>
        )}
      </div>

      {selected && <CertificateDialog certificate={selected} onClose={() => setSelectedCertificateId(null)} />}
    </section>
  );
}
