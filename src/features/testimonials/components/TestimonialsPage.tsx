"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import {
  duration,
  ease,
  gsap,
  registerGsap,
  REDUCED_MOTION_QUERY,
  NO_REDUCED_MOTION_QUERY,
  SplitText,
} from "@/shared/lib/gsap";
import { PageLayout } from "@/shared/components/layout/PageLayout";
import { parseCountable } from "@/shared/lib/countUp";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { ErrorState } from "@/shared/components/ui/ErrorState";
import { useTestimonials } from "../hooks/useTestimonials";
import type { Stat, Testimonial } from "../types/types";

function StatBlock({ stat }: { stat: Stat }) {
  const countable = parseCountable(stat.value);

  return (
    <div data-stat className="flex-1 flex flex-col gap-2">
      <span className="font-display text-[36px] md:text-[44px] lg:text-[52px] font-semibold tracking-[-1px] text-text-primary">
        {countable ? (
          <span
            data-count-to={countable.target}
            data-count-prefix={countable.prefix}
            data-count-suffix={countable.suffix}
            data-count-decimals={countable.decimals}
          >
            {countable.prefix}0{countable.suffix}
          </span>
        ) : (
          stat.value
        )}
      </span>
      <span className="font-mono text-[10px] tracking-[2.4px] text-text-muted">
        {stat.label}
      </span>
    </div>
  );
}

function QuoteCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div
      data-quote-card
      className="flex flex-col gap-6 rounded-[6px] border border-border-glow-soft bg-surface p-6 md:p-8 transition-colors hover:border-border-glow"
    >
      <p className="font-body text-[15px] md:text-[16px] leading-[1.7] text-text-primary italic">
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
      <span className="font-mono text-[10px] tracking-[1.5px] text-text-muted">
        CONTEXT — {testimonial.context}
      </span>
    </div>
  );
}

function pluralize(count: number, singular: string, plural: string) {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function TestimonialsPage() {
  const contentRef = useRef<HTMLDivElement>(null);
  const { stats, testimonials, isLoading, isError, refetch } = useTestimonials();
  const testimonialCount = testimonials.length;
  const clientsRepresented = stats.find((stat) => stat.label === "CLIENTS REPRESENTED")?.value ?? "0";
  const pageMeta = [
    { key: "SOURCE", value: "DASHBOARD API" },
    { key: "VOICES", value: String(testimonialCount) },
    { key: "CLIENTS", value: clientsRepresented },
  ];
  const feedbackLabel = `ALL FEEDBACK - ${pluralize(testimonialCount, "VOICE", "VOICES")}`;

  useGSAP(
    () => {
      registerGsap();
      const content = contentRef.current;
      if (!content) return;

      const mm = gsap.matchMedia();

      mm.add(REDUCED_MOTION_QUERY, () => {
        gsap.set("[data-testimonials-reveal]", { opacity: 1, y: 0 });

        gsap.utils.toArray<HTMLElement>("[data-count-to]").forEach((el) => {
          el.textContent = `${el.dataset.countPrefix}${el.dataset.countTo}${el.dataset.countSuffix}`;
        });
      });

      mm.add(NO_REDUCED_MOTION_QUERY, () => {
        const lead = content.querySelector("[data-lead]");
        if (lead) {
          const split = new SplitText(lead, { type: "lines" });
          gsap.from(split.lines, {
            opacity: 0,
            y: 20,
            duration: 0.6,
            ease: ease.entrance,
            stagger: 0.06,
            scrollTrigger: { trigger: lead },
          });
        }

        gsap.from("[data-stat]", {
          opacity: 0,
          y: 20,
          duration: 0.5,
          ease: ease.entrance,
          stagger: 0.08,
          scrollTrigger: { trigger: "[data-stats]", start: "top 80%" },
        });

        gsap.utils.toArray<HTMLElement>("[data-count-to]").forEach((el) => {
          const target = parseFloat(el.dataset.countTo || "0");
          const prefix = el.dataset.countPrefix || "";
          const suffix = el.dataset.countSuffix || "";
          const decimals = parseInt(el.dataset.countDecimals || "0", 10);
          const counter = { val: 0 };

          gsap.to(counter, {
            val: target,
            duration: duration.countUp,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
            onUpdate: () => {
              el.textContent = `${prefix}${counter.val.toFixed(decimals)}${suffix}`;
            },
          });
        });

        gsap.from("[data-quote-card]", {
          opacity: 0,
          y: 24,
          duration: 0.6,
          ease: ease.entrance,
          stagger: 0.1,
          scrollTrigger: { trigger: "[data-list]", start: "top 75%" },
        });

        return undefined;
      });

      return () => mm.revert();
    },
    { scope: contentRef, dependencies: [stats, testimonials] },
  );

  return (
    <PageLayout
      backLink="Back to Home"
      backHref="/"
      breadcrumb="HOME / TESTIMONIALS"
      eyebrow="[ 05 — TESTIMONIALS ]"
      title="What the people who paid the invoice said afterwards."
      deck="Unedited feedback from clients and colleagues, with the project each one came from — including the parts that were not entirely flattering."
      meta={pageMeta}
      metaLoading={isLoading}
      prev={{ direction: "← HOME", title: "Projects", href: "/projects" }}
      next={{ direction: "NEXT →", title: "About", href: "/about" }}
    >
      <div ref={contentRef} className="flex flex-col gap-16">
        <p
          data-lead
          className="max-w-[960px] font-body text-[18px] md:text-[20px] lg:text-[22px] leading-[1.55] text-text-primary"
        >
          I collect feedback the way some people collect stamps — regularly and
          with a critical eye. What follows is every review that shaped how I
          work, including the ones that made me change a process.
        </p>

        <div
          data-stats
          className="flex flex-col sm:flex-row gap-8 sm:gap-6"
        >
          {stats.map((stat) => (
            <StatBlock key={stat.label} stat={stat} />
          ))}
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
          <div
            data-list
            className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6"
          >
            {testimonials.map((testimonial) => (
              <QuoteCard key={testimonial.name} testimonial={testimonial} />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
