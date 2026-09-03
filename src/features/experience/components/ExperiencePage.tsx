"use client";

import { useRef } from "react";
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
import { ErrorState } from "@/shared/components/ui/ErrorState";
import { LoadMoreButton } from "@/shared/components/ui/LoadMoreButton";
import { useExperienceRoles, useEducation } from "@/features/experience/hooks/useExperience";
import { useExperienceUI } from "@/features/experience/store/experienceUIStore";
import { useStats } from "@/features/about/hooks/useAbout";
import { yearsOfExperience } from "@/shared/lib/experience";
import { RoleBlock, RoleBlockSkeleton } from "./RoleBlock";
import { EducationRow, EducationRowSkeleton } from "./EducationRow";

export function ExperiencePage() {
  const contentRef = useRef<HTMLDivElement>(null);
  const leadRef = useRef<HTMLParagraphElement>(null);
  const rolesRef = useRef<HTMLDivElement>(null);
  const eduRef = useRef<HTMLDivElement>(null);
  const {
    roles: ROLES,
    total: rolesTotal,
    isLoading: rolesLoading,
    isError: rolesError,
    refetch: refetchRoles,
    hasNextPage: hasMoreRoles,
    isFetchingNextPage: loadingMoreRoles,
    fetchNextPage: loadMoreRoles,
  } = useExperienceRoles();
  const {
    education: EDUCATION,
    total: eduTotal,
    isLoading: eduLoading,
    isError: eduError,
    refetch: refetchEducation,
    hasNextPage: hasMoreEducation,
    isFetchingNextPage: loadingMoreEducation,
    fetchNextPage: loadMoreEducation,
  } = useEducation();
  const { collapsedRoles, toggleRole } = useExperienceUI();
  const { data: stats } = useStats();
  const isLoading = rolesLoading || eduLoading;
  const isError = rolesError || eduError;
  const currentRole = ROLES.find((role) => role.pinned) ?? ROLES.find((role) => role.period.toLowerCase().includes("present")) ?? ROLES[0];
  const pageMeta = [
    { key: "ROLES", value: String(rolesTotal) },
    { key: "CURRENT", value: currentRole?.title.toUpperCase() ?? "Loading" },
    { key: "EDUCATION", value: String(eduTotal) },
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
      backLink="Back To Portfolio"
      backHref="/"
      breadcrumb="HOME / EXPERIENCE"
      eyebrow="[ 03 - EXPERIENCE ]"
      title={`${yearsOfExperience(stats?.yearsExperience ?? 0)} of building for the web apps and products, role by role.`}
      deck="Every role with its responsibilities and outcomes spelled out, plus where the formal training came from."
      meta={pageMeta}
      metaLoading={isLoading}
      metaError={isError}
      prev={{ direction: "← PREV", title: "Skills & tech stack", href: "/skills" }}
      next={{ direction: "NEXT →", title: "Projects", href: "/projects" }}
    >
      <div ref={contentRef} className="flex flex-col gap-20">
        <p
          ref={leadRef}
          className="max-w-[960px] font-body text-[18px] md:text-[20px] lg:text-[22px] leading-[1.55] text-text-primary"
        >
          Job titles always undersold what I ended up doing, so each entry
          below describes the work itself: what I owned, what constrained
          it, and what came out the other side.
        </p>

        {rolesLoading ? (
          <div>
            <RoleBlockSkeleton />
            <RoleBlockSkeleton />
          </div>
        ) : rolesError ? (
          <ErrorState onRetry={refetchRoles} />
        ) : (
          <>
            <div ref={rolesRef}>
              {ROLES.map((role) => (
                <RoleBlock
                  key={role.id}
                  role={role}
                  collapsed={collapsedRoles.has(role.title)}
                  onToggle={() => toggleRole(role.title)}
                />
              ))}
            </div>
            {hasMoreRoles && (
              <LoadMoreButton onClick={() => loadMoreRoles()} loading={loadingMoreRoles} label="LOAD MORE ROLES" />
            )}
          </>
        )}

        <div ref={eduRef} className="flex flex-col gap-5 border-t border-border-glow-soft pt-9">
          <span className="font-mono text-[11px] font-medium tracking-[3px] text-violet">
            EDUCATION
          </span>
          {eduLoading ? (
            <>
              <EducationRowSkeleton />
              <EducationRowSkeleton />
              <EducationRowSkeleton />
            </>
          ) : eduError ? (
            <ErrorState onRetry={refetchEducation} />
          ) : (
            <>
              {EDUCATION.map((edu) => (
                <EducationRow key={edu.id} edu={edu} />
              ))}
              {hasMoreEducation && (
                <LoadMoreButton
                  onClick={() => loadMoreEducation()}
                  loading={loadingMoreEducation}
                  label="LOAD MORE EDUCATION"
                />
              )}
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
}