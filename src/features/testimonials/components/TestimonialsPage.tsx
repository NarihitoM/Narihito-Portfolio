"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import {
  ease,
  gsap,
  registerGsap,
  REDUCED_MOTION_QUERY,
  NO_REDUCED_MOTION_QUERY,
  ScrollTrigger,
} from "@/shared/lib/gsap";
import { PageLayout } from "@/shared/components/layout/PageLayout";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { ErrorState } from "@/shared/components/ui/ErrorState";
import { LoadMoreButton } from "@/shared/components/ui/LoadMoreButton";
import { useTestimonialsInfinite } from "../hooks/useTestimonials";
import { TestimonialDialog } from "./TestimonialDialog";
import { StatBlock } from "./StatBlock";
import { QuoteCard } from "./QuoteCard";
import type { Testimonial } from "../types/types";

function pluralize(count: number, singular: string, plural: string) {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function TestimonialsPage() {
  const contentRef = useRef<HTMLDivElement>(null);
  const leadRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const {
    stats,
    testimonials,
    total,
    isLoading,
    isError,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useTestimonialsInfinite();
  const [selected, setSelected] = useState<Testimonial | null>(null);
  const clientsRepresented = stats.find((stat) => stat.label === "CLIENTS REPRESENTED")?.value ?? "0";
  const pageMeta = [
    { key: "SOURCE", value: "NARIHITO" },
    { key: "VOICES", value: String(total) },
    { key: "CLIENTS", value: clientsRepresented },
  ];
  const feedbackLabel = `ALL FEEDBACK - ${pluralize(total, "VOICE", "VOICES")}`;

  useGSAP(
    () => {
      registerGsap();
      const lead = leadRef.current;
      if (!lead) return;

      const mm = gsap.matchMedia();

      mm.add(REDUCED_MOTION_QUERY, () => {
        gsap.set(lead, { opacity: 1, y: 0 });
      });

      mm.add(NO_REDUCED_MOTION_QUERY, () => {
        gsap.fromTo(lead, { opacity: 0, y: 20 }, {
          opacity: 1, y: 0, duration: 0.6, ease: ease.entrance,
          scrollTrigger: { trigger: lead, once: true },
        });
      });

      return () => mm.revert();
    },
    { scope: contentRef },
  );

  useGSAP(
    () => {
      registerGsap();
      const container = statsRef.current;
      if (!container || !container.children.length) return;

      const mm = gsap.matchMedia();

      mm.add(REDUCED_MOTION_QUERY, () => {
        gsap.set(container.children, { opacity: 1, y: 0 });
      });

      mm.add(NO_REDUCED_MOTION_QUERY, () => {
        gsap.fromTo(container.children, { opacity: 0, y: 20 }, {
          opacity: 1, y: 0, duration: 0.5, ease: ease.entrance, stagger: 0.08,
          scrollTrigger: { trigger: container, start: "top 80%", once: true },
        });
      });

      const t = window.setTimeout(() => ScrollTrigger.refresh(), 100);
      return () => { window.clearTimeout(t); mm.revert(); };
    },
    { scope: contentRef, dependencies: [stats] },
  );

  useGSAP(
    () => {
      registerGsap();
      const container = cardsRef.current;
      if (!container || !container.children.length) return;

      const mm = gsap.matchMedia();

      mm.add(REDUCED_MOTION_QUERY, () => {
        gsap.set(container.children, { opacity: 1, y: 0 });
      });

      mm.add(NO_REDUCED_MOTION_QUERY, () => {
        gsap.fromTo(container.children, { opacity: 0, y: 24 }, {
          opacity: 1, y: 0, duration: 0.6, ease: ease.entrance, stagger: 0.1,
          scrollTrigger: { trigger: container, start: "top 75%", once: true },
        });
      });

      const t = window.setTimeout(() => ScrollTrigger.refresh(), 100);
      return () => { window.clearTimeout(t); mm.revert(); };
    },
    { scope: contentRef, dependencies: [testimonials] },
  );

  return (
    <PageLayout
      backLink="Back to Home"
      backHref="/"
      breadcrumb="HOME / TESTIMONIALS"
      eyebrow="[ 06 - TESTIMONIALS ]"
      title="Feedback from the people I have worked with."
      deck="Quotes from clients and teammates, kept unedited, each tied to the project it came from."
      meta={pageMeta}
      metaLoading={isLoading}
      metaError={isError}
      prev={{ direction: "← HOME", title: "Events", href: "/events" }}
      next={{ direction: "NEXT →", title: "About", href: "/about" }}
    >
      <div ref={contentRef} className="flex flex-col gap-16">
        <p
          ref={leadRef}
          className="max-w-[960px] font-body text-[18px] md:text-[20px] lg:text-[22px] leading-[1.55] text-text-primary"
        >
          Feedback changed how I work more than any tutorial ever did. These
          are the reviews I keep coming back to, the flattering ones and the
          ones that made me fix a process.
        </p>

        <div
          ref={statsRef}
          className="flex flex-col sm:flex-row gap-8 sm:gap-6"
        >
          {isLoading ? (
            <>
              <Skeleton className="h-[80px] flex-1" />
              <Skeleton className="h-[80px] flex-1" />
            </>
          ) : (
            stats.map((stat) => (
              <StatBlock key={stat.label} stat={stat} />
            ))
          )}
        </div>

        <div className="border-t border-border-glow-soft pt-8">
          <span className="font-mono text-[11px] font-medium tracking-[3px] text-violet">
            {feedbackLabel}
          </span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            <Skeleton className="h-[220px] w-full" />
            <Skeleton className="h-[220px] w-full" />
          </div>
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : (
          <>
            <div
              id="testimonials-grid"
              ref={cardsRef}
              className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6"
            >
              {testimonials.map((testimonial) => (
                <QuoteCard
                  key={testimonial.name}
                  testimonial={testimonial}
                  onClick={() => setSelected(testimonial)}
                />
              ))}
            </div>

            {hasNextPage && (
              <LoadMoreButton
                onClick={() => fetchNextPage()}
                loading={isFetchingNextPage}
                label="LOAD MORE TESTIMONIALS"
              />
            )}
          </>
        )}
      </div>

      {selected && <TestimonialDialog testimonial={selected} onClose={() => setSelected(null)} />}
    </PageLayout>
  );
}