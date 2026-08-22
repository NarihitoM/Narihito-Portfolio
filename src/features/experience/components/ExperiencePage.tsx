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
  ScrollTrigger,
} from "@/shared/lib/gsap";
import { PageLayout } from "@/shared/components/layout/PageLayout";
import { Chip } from "@/shared/components/ui/Chip";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { ErrorState } from "@/shared/components/ui/ErrorState";
import { useExperience } from "@/features/experience/hooks/useExperience";
import { useExperienceUI } from "@/features/experience/store/experienceUIStore";
import { yearsOfExperience } from "@/shared/lib/experience";
import type { Duty, Metric, Role } from "@/features/experience/types/types";

function DutyRow({ duty }: { duty: Duty }) {
  return (
    <div
      data-duty
      className="flex items-start gap-4 md:gap-[18px] border-t border-border-glow-soft py-3"
    >
      <span className="shrink-0 font-mono text-[13px] text-text-muted">
        {duty.index}
      </span>
      <span className="font-body text-[14px] md:text-[15px] leading-[1.6] text-text-secondary">
        {duty.text}
      </span>
    </div>
  );
}

function MetricBlock({ metric }: { metric: Metric }) {
  return (
    <div data-metric className="flex-1 flex flex-col gap-2 pt-6">
      <span className="font-display text-[28px] md:text-[34px] font-semibold tracking-[-1px] text-text-primary">
        {metric.value}
      </span>
      <span className="font-mono text-[10px] tracking-[2.4px] text-text-muted">
        {metric.label}
      </span>
    </div>
  );
}

function RoleBlock({ role, collapsed, onToggle }: { role: Role; collapsed: boolean; onToggle: () => void }) {
  return (
    <div
      data-role
      className="flex flex-col md:flex-row gap-6 md:gap-14 border-t border-border-glow pt-9"
    >
      <div className="md:w-[240px] md:shrink-0 flex flex-row md:flex-col gap-2.5">
        <span className="font-mono text-[11px] font-medium tracking-[3px] text-violet">
          {role.period}
        </span>
        <span className="font-mono text-[11px] tracking-[2px] text-text-muted">
          {role.type}
        </span>
      </div>

      <div className="flex-1 flex flex-col gap-5 md:gap-[26px]">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-[26px] md:text-[34px] font-semibold leading-[1.15] tracking-[-0.8px] md:tracking-[-1.2px] text-text-primary">
            {role.title}
          </h3>
          <button
            type="button"
            onClick={onToggle}
            className="shrink-0 font-mono text-[11px] tracking-[1px] text-text-muted transition-colors hover:text-text-primary"
          >
            {collapsed ? "SHOW DETAILS" : "HIDE DETAILS"}
          </button>
        </div>
        <span className="font-mono text-[13px] tracking-[0.6px] text-text-secondary">
          {role.org}
        </span>
        <p className="max-w-[820px] font-body text-[15px] md:text-[16px] leading-[1.7] text-text-secondary">
          {role.desc}
        </p>

        {!collapsed && (
          <>
            <div className="flex flex-col">
              {role.duties.map((duty) => (
                <DutyRow key={duty.index} duty={duty} />
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-6 pt-2">
              {role.impact.map((metric) => (
                <MetricBlock key={metric.label} metric={metric} />
              ))}
            </div>

            <div className="flex flex-wrap gap-2.5">
              {role.chips.map((chip) => (
                <Chip key={chip}>{chip}</Chip>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function ExperiencePage() {
  const contentRef = useRef<HTMLDivElement>(null);
  const leadRef = useRef<HTMLParagraphElement>(null);
  const rolesRef = useRef<HTMLDivElement>(null);
  const eduRef = useRef<HTMLDivElement>(null);
  const { roles: ROLES, education: EDUCATION, isLoading, isError, refetch } = useExperience();
  const { collapsedRoles, toggleRole } = useExperienceUI();
  const currentRole = ROLES.find((role) => role.period.toLowerCase().includes("present")) ?? ROLES[0];
  const pageMeta = [
    { key: "ROLES", value: String(ROLES.length) },
    { key: "CURRENT", value: currentRole?.title.toUpperCase() ?? "Loading" },
    { key: "EDUCATION", value: String(EDUCATION.length) },
  ];

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
      const container = rolesRef.current;
      if (!container || !container.children.length) return;

      const mm = gsap.matchMedia();

      mm.add(REDUCED_MOTION_QUERY, () => {
        gsap.set(container.children, { opacity: 1, y: 0 });
      });

      mm.add(NO_REDUCED_MOTION_QUERY, () => {
        gsap.fromTo(container.children, { opacity: 0, y: 24 }, {
          opacity: 1, y: 0, duration: 0.6, ease: ease.entrance, stagger: 0.12,
          scrollTrigger: { trigger: container, start: "top 70%", once: true },
        });
      });

      const t = window.setTimeout(() => ScrollTrigger.refresh(), 100);
      return () => { window.clearTimeout(t); mm.revert(); };
    },
    { scope: contentRef, dependencies: [ROLES] },
  );

  useGSAP(
    () => {
      registerGsap();
      const container = eduRef.current;
      if (!container || !container.children.length) return;

      const mm = gsap.matchMedia();

      mm.add(REDUCED_MOTION_QUERY, () => {
        gsap.set(container.querySelectorAll("[data-edu-row]"), { opacity: 1, y: 0 });
      });

      mm.add(NO_REDUCED_MOTION_QUERY, () => {
        const rows = container.querySelectorAll("[data-edu-row]");
        if (rows.length) {
          gsap.fromTo(rows, { opacity: 0, y: 16 }, {
            opacity: 1, y: 0, duration: 0.5, ease: ease.entrance, stagger: 0.06,
            scrollTrigger: { trigger: container, start: "top 80%", once: true },
          });
        }
      });

      const t = window.setTimeout(() => ScrollTrigger.refresh(), 100);
      return () => { window.clearTimeout(t); mm.revert(); };
    },
    { scope: contentRef, dependencies: [EDUCATION] },
  );

  return (
    <PageLayout
      backLink="Back to Home"
      backHref="/"
      breadcrumb="HOME / EXPERIENCE"
      eyebrow="[ 03 - EXPERIENCE ]"
      title={`${yearsOfExperience()} in the industry of working with full stack development.`}
      deck="Full role histories with what I owned, what shipped, and the numbers that moved, plus where the formal training came from."
      meta={pageMeta}
      metaLoading={isLoading}
      metaError={isError}
      prev={{ direction: "← HOME", title: "Skills & tech stack", href: "/skills" }}
      next={{ direction: "NEXT →", title: "Projects", href: "/projects" }}
    >
      <div ref={contentRef} className="flex flex-col gap-20">
        <p
          ref={leadRef}
          className="max-w-[960px] font-body text-[18px] md:text-[20px] lg:text-[22px] leading-[1.55] text-text-primary"
        >
          I have never had a job title that matched what I actually did. What
          follows is the honest version: the work I owned, the constraints I
          worked inside, and the results I can still point at.
        </p>

        {isLoading ? (
          <div className="flex flex-col gap-6">
            <Skeleton className="h-[240px] w-full" />
            <Skeleton className="h-[240px] w-full" />
          </div>
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : (
          <div ref={rolesRef}>
            {ROLES.map((role) => (
              <RoleBlock
                key={role.title}
                role={role}
                collapsed={collapsedRoles.has(role.title)}
                onToggle={() => toggleRole(role.title)}
              />
            ))}
          </div>
        )}

        <div ref={eduRef} className="flex flex-col gap-5 border-t border-border-glow pt-9">
          <span className="font-mono text-[11px] font-medium tracking-[3px] text-violet">
            EDUCATION & CERTIFICATIONS
          </span>
          {EDUCATION.map((edu) => (
            <div
              key={edu.name}
              data-edu-row
              className="flex flex-col md:flex-row md:items-center gap-1 md:gap-7 border-t border-border-glow-soft py-3.5"
            >
              <span className="w-[70px] shrink-0 font-mono text-[12px] tracking-[1px] text-text-muted">
                {edu.year}
              </span>
              <span className="flex-1 font-body text-[15px] md:text-[17px] font-medium text-text-primary">
                {edu.name}
              </span>
              <span className="md:w-[340px] md:shrink-0 md:text-right font-mono text-[11px] tracking-[0.6px] text-text-muted">
                {edu.org}
              </span>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}