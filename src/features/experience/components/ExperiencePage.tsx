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
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { ErrorState } from "@/shared/components/ui/ErrorState";
import { useExperience } from "@/features/experience/hooks/useExperience";
import { useExperienceUI } from "@/features/experience/store/experienceUIStore";
import { yearsOfExperience } from "@/shared/lib/experience";
import { RoleBlock } from "./RoleBlock";
import { EducationRow } from "./EducationRow";

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
          {isLoading ? (
            <Skeleton className="h-[140px] w-full" />
          ) : EDUCATION.map((edu) => <EducationRow key={edu.name} edu={edu} />)}
        </div>
      </div>
    </PageLayout>
  );
}