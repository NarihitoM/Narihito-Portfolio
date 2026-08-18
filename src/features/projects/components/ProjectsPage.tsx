"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import {
  ease,
  gsap,
  registerGsap,
  REDUCED_MOTION_QUERY,
  NO_REDUCED_MOTION_QUERY,
  SplitText,
} from "@/shared/lib/gsap";
import { PageLayout } from "@/shared/components/layout/PageLayout";
import { Chip } from "@/shared/components/ui/Chip";
import { useTilt } from "@/shared/hooks/useTilt";
import type { FeaturedProject, FilterTag, ProjectCard } from "../types/types";

const FILTERS: FilterTag[] = [
  { label: "All", count: 11 },
  { label: "Product UI", count: 4 },
  { label: "Marketing site", count: 3 },
  { label: "Motion", count: 2 },
  { label: "Internal tool", count: 2 },
];

const FEATURED: FeaturedProject = {
  eyebrow: "FEATURED — 2026",
  title: "Sansiri Stay — booking platform",
  description:
    "A six-week rebuild of a hotel group's reservation flow. The old funnel lost people at the date picker; the new one keeps the price summary pinned and never re-renders the calendar on selection. Checkout completion rose 18% in the first month.",
  chips: ["Next.js", "TypeScript", "GSAP", "Prisma", "PostgreSQL", "Vercel"],
  meta: {
    year: "2026",
    role: "Lead frontend + motion",
    stack: "Next.js · Prisma",
    status: "Live",
    duration: "6 weeks",
  },
};

const PROJECTS: ProjectCard[] = [
  {
    title: "Thanaphan Dispatch",
    year: "2025",
    category: "INTERNAL TOOL",
    role: "LEAD FRONTEND",
    status: "LIVE",
    description:
      "Freight dispatch dashboard rebuilt around a single realtime table. Report page went from 40 seconds to under two.",
    chips: ["React", "TypeScript", "Redis", "Docker"],
  },
  {
    title: "Ora Studio",
    year: "2025",
    category: "MARKETING SITE",
    role: "DESIGN + BUILD",
    status: "LIVE",
    description:
      "Portfolio site for a ceramics studio. Scroll-linked kiln sequence, and a product grid that loads in under a second on 3G.",
    chips: ["Next.js", "GSAP", "Sanity"],
  },
  {
    title: "Fieldnote",
    year: "2025",
    category: "PRODUCT UI",
    role: "FRONTEND",
    status: "IN BUILD",
    description:
      "Note-taking app for field researchers. Offline-first, conflict resolution on sync, no spinner anywhere in the app.",
    chips: ["React", "IndexedDB", "TanStack"],
  },
  {
    title: "Bangkok Coffee Index",
    year: "2024",
    category: "MOTION",
    role: "SOLO PROJECT",
    status: "LIVE",
    description:
      "A map of 240 independent cafés. Built to learn WebGL clustering; kept because people actually use it.",
    chips: ["Three.js", "Mapbox", "Vite"],
  },
  {
    title: "Lamphu Rentals",
    year: "2024",
    category: "PRODUCT UI",
    role: "FRONTEND",
    status: "LIVE",
    description:
      "Property management console. Bulk actions, keyboard-first tables, and a permissions model the client can edit themselves.",
    chips: ["React", "Node", "PostgreSQL"],
  },
  {
    title: "Nimbus Agency Site",
    year: "2024",
    category: "MARKETING SITE",
    role: "FRONTEND + MOTION",
    status: "LIVE",
    description:
      "The studio's own site. Pinned case-study sections and a type-scale that survives translation into Thai.",
    chips: ["Next.js", "GSAP", "Tailwind"],
  },
  {
    title: "Sook Health",
    year: "2023",
    category: "PRODUCT UI",
    role: "FRONTEND",
    status: "LIVE",
    description:
      "Patient intake flow for a clinic group. Reduced form abandonment by cutting eleven fields to four.",
    chips: ["React", "Zod", "Express"],
  },
  {
    title: "Ratchada Night Market",
    year: "2023",
    category: "MARKETING SITE",
    role: "DESIGN + BUILD",
    status: "ARCHIVED",
    description:
      "One-page site for a market operator. Shipped in nine days, ran for two seasons.",
    chips: ["Astro", "Tailwind"],
  },
  {
    title: "Pace",
    year: "2023",
    category: "MOTION",
    role: "SOLO PROJECT",
    status: "IN BUILD",
    description:
      "A running-pace visualiser. Every animation on the page is driven by real GPS data, not easing curves I invented.",
    chips: ["Three.js", "D3", "TypeScript"],
  },
  {
    title: "Krungthep Freight API Console",
    year: "2022",
    category: "INTERNAL TOOL",
    role: "FULL-STACK",
    status: "ARCHIVED",
    description:
      "Admin console for an internal shipping API. First thing I built that other developers depended on daily.",
    chips: ["PHP", "MySQL", "jQuery"],
  },
];

function FeaturedBlock({ project }: { project: FeaturedProject }) {
  return (
    <div data-featured className="flex flex-col gap-8 border-t border-border-glow pt-9">
      <span className="font-mono text-[11px] font-medium tracking-[3px] text-violet">
        {project.eyebrow}
      </span>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-14">
        <div className="flex-1 flex flex-col gap-6">
          <div className="h-[240px] lg:h-[320px] w-full rounded-[6px] bg-surface border border-border-glow-soft flex items-center justify-center">
            <span className="font-mono text-[12px] tracking-[2px] text-text-muted">
              SANSIRI STAY
            </span>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-6">
          <h2 className="font-display text-[28px] md:text-[34px] font-semibold leading-[1.15] tracking-[-0.8px] text-text-primary">
            {project.title}
          </h2>

          <p className="font-body text-[15px] md:text-[16px] leading-[1.7] text-text-secondary">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2.5">
            {project.chips.map((chip) => (
              <Chip key={chip}>{chip}</Chip>
            ))}
          </div>

          <div className="flex flex-col gap-2 pt-4 border-t border-border-glow-soft">
            {Object.entries(project.meta).map(([key, value]) => (
              <div key={key} className="flex items-center gap-4">
                <span className="font-mono text-[10px] tracking-[2px] text-text-muted w-[80px] shrink-0 uppercase">
                  {key}
                </span>
                <span className="font-mono text-[12px] text-text-secondary">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectCardBlock({ project }: { project: ProjectCard }) {
  const tilt = useTilt<HTMLDivElement>();

  return (
    <div
      {...tilt}
      data-project-card
      className="group flex flex-col rounded-[6px] border border-border-glow-soft bg-surface overflow-hidden transition-colors hover:border-border-glow"
    >
      <div className="h-[200px] md:h-[230px] w-full flex items-center justify-center bg-bg-panel">
        <span className="font-mono text-[11px] tracking-[2px] text-text-muted uppercase">
          {project.title}
        </span>
      </div>
      <div className="flex flex-col gap-4 p-5 md:p-6">
        <div className="flex items-center gap-3">
          <h3 className="font-display text-[18px] md:text-[20px] font-semibold text-text-primary">
            {project.title}
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="font-mono text-[10px] tracking-[1.5px] text-text-muted">
            {project.year}
          </span>
          <span className="font-mono text-[10px] tracking-[1.5px] text-text-muted">
            {project.category}
          </span>
          <span className="font-mono text-[10px] tracking-[1.5px] text-text-muted">
            {project.role}
          </span>
          <span className="font-mono text-[10px] tracking-[1.5px] text-violet">
            {project.status}
          </span>
        </div>
        <p className="font-body text-[14px] md:text-[15px] leading-[1.6] text-text-secondary">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.chips.map((chip) => (
            <Chip key={chip}>{chip}</Chip>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProjectsPage() {
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const content = contentRef.current;
      if (!content) return;

      const mm = gsap.matchMedia();

      mm.add(REDUCED_MOTION_QUERY, () => {
        gsap.set("[data-projects-reveal]", { opacity: 1, y: 0 });
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

        gsap.from("[data-filter-tag]", {
          opacity: 0,
          y: 12,
          duration: 0.4,
          ease: ease.entrance,
          stagger: 0.05,
          scrollTrigger: { trigger: "[data-filters]", start: "top 85%" },
        });

        gsap.from("[data-featured]", {
          opacity: 0,
          y: 24,
          duration: 0.7,
          ease: ease.entrance,
          scrollTrigger: { trigger: "[data-featured]", start: "top 80%" },
        });

        gsap.from("[data-project-card]", {
          opacity: 0,
          y: 24,
          duration: 0.6,
          ease: ease.entrance,
          stagger: 0.08,
          scrollTrigger: { trigger: "[data-grid]", start: "top 75%" },
        });

        return undefined;
      });

      return () => mm.revert();
    },
    { scope: contentRef },
  );

  return (
    <PageLayout
      backLink="Back to Home"
      backHref="/"
      breadcrumb="HOME / PROJECTS"
      eyebrow="[ 04 — PROJECTS ]"
      title="Eleven builds, and what each one was actually solving."
      deck="The full index — client work, contract builds, and two things I made because nobody asked me to. Filter by discipline or read straight through."
      meta={[
        { key: "INDEX", value: "11 PROJECTS" },
        { key: "FILTERS", value: "5 TAGS" },
        { key: "NEWEST", value: "MAR 2026" },
        { key: "STATUS", value: "2 IN BUILD" },
      ]}
      prev={{ direction: "← HOME", title: "Experience", href: "/experience" }}
      next={{ direction: "NEXT →", title: "Testimonials", href: "/testimonials" }}
    >
      <div ref={contentRef} className="flex flex-col gap-16">
        <p
          data-lead
          className="max-w-[960px] font-body text-[18px] md:text-[20px] lg:text-[22px] leading-[1.55] text-text-primary"
        >
          I keep a running index of every project that shipped or got close enough
          to teach me something. The ones that did not work are here too — usually
          the lessons were bigger on those.
        </p>

        <div
          data-filters
          className="flex flex-wrap gap-3"
        >
          {FILTERS.map((filter) => (
            <button
              key={filter.label}
              data-filter-tag
              type="button"
              className="flex items-center gap-2 rounded-full border border-border-glow-soft bg-surface px-4 py-2 font-mono text-[11px] tracking-[1px] text-text-secondary transition-colors hover:border-violet hover:text-text-primary"
            >
              <span>{filter.label}</span>
              <span className="text-text-muted">({filter.count})</span>
            </button>
          ))}
        </div>

        <FeaturedBlock project={FEATURED} />

        <div
          data-grid
          className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6"
        >
          {PROJECTS.map((project) => (
            <ProjectCardBlock key={project.title} project={project} />
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
