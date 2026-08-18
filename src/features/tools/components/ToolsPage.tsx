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
import { TechIcon } from "@/shared/components/ui/TechIcon";
import { Category, Tool } from "../types/types";

const CATEGORIES: Category[] = [
  {
    eyebrow: "FRONTEND",
    note: "The layer I spend most of the week in.",
    tools: [
      { name: "React", icon: "react", note: "Component architecture, hooks, and server components in Next.js app router.", frequency: "DAILY", proficiency: 5 },
      { name: "TypeScript", icon: "typescript", note: "Strict mode, no escape hatches. Types as the first line of documentation.", frequency: "DAILY", proficiency: 5 },
      { name: "Next.js", icon: "next.js", note: "App router, server actions, route-level loading and error states.", frequency: "WEEKLY", proficiency: 4 },
      { name: "Tailwind CSS", icon: "tailwind", note: "Token-driven utility work, paired with a small set of shared primitives.", frequency: "DAILY", proficiency: 5 },
      { name: "Zustand / TanStack Query", icon: "zustand", note: "Client state kept thin; server state kept where it belongs.", frequency: "WEEKLY", proficiency: 4 },
    ],
  },
  {
    eyebrow: "BACKEND",
    note: "Where I started, and still comfortable.",
    tools: [
      { name: "Node + Express", icon: "node.js", note: "REST services split by feature module: controller, service, route, validation.", frequency: "WEEKLY", proficiency: 4 },
      { name: "PHP", icon: "php", note: "Two years of production work. Still the fastest way to ship a small CMS-backed site.", frequency: "OCCASIONAL", proficiency: 3 },
      { name: "REST + Zod", icon: "rest", note: "Contract-first endpoints with runtime validation at the trust boundary.", frequency: "WEEKLY", proficiency: 4 },
    ],
  },
  {
    eyebrow: "DATABASE",
    note: "Modelling before migrating.",
    tools: [
      { name: "PostgreSQL", icon: "postgresql", note: "Relational modelling, indexing, and query plans when a page gets slow.", frequency: "WEEKLY", proficiency: 4 },
      { name: "Prisma", icon: "prisma", note: "Schema split by domain, typed access, migrations reviewed before they run.", frequency: "WEEKLY", proficiency: 4 },
      { name: "MySQL", icon: "mysql", note: "Legacy estates and reporting queries.", frequency: "OCCASIONAL", proficiency: 3 },
      { name: "Redis", icon: "redis", note: "Session storage and rate limiting. Nothing that cannot be rebuilt.", frequency: "OCCASIONAL", proficiency: 3 },
    ],
  },
  {
    eyebrow: "DEVOPS",
    note: "Enough to own what I ship.",
    tools: [
      { name: "Docker", icon: "docker", note: "Compose files for local parity; single-stage images unless size actually hurts.", frequency: "WEEKLY", proficiency: 3 },
      { name: "GitHub Actions", icon: "github", note: "Lint, typecheck, test, deploy. Fails loudly and early.", frequency: "WEEKLY", proficiency: 4 },
      { name: "Vercel / Railway", icon: "vercel", note: "Preview deployments on every branch so review happens on the real thing.", frequency: "WEEKLY", proficiency: 4 },
    ],
  },
  {
    eyebrow: "MOTION",
    note: "The part clients remember.",
    tools: [
      { name: "GSAP", icon: "gsap", note: "ScrollTrigger sequences, timeline choreography, and pinned sections.", frequency: "DAILY", proficiency: 5 },
      { name: "Three.js", icon: "three.js", note: "Lightweight WebGL scenes — never more geometry than the story needs.", frequency: "OCCASIONAL", proficiency: 3 },
      { name: "Lenis", icon: "lenis", note: "Smooth scroll that respects reduced-motion and never hijacks input.", frequency: "WEEKLY", proficiency: 4 },
      { name: "Framer Motion", icon: "framer", note: "Component-level state transitions where GSAP would be overkill.", frequency: "WEEKLY", proficiency: 4 },
    ],
  },
];

const LEARNING = [
  { name: "Rust", desc: "Reading the book slowly, writing small CLI tools. Not in production, not pretending otherwise." },
  { name: "WebGPU", desc: "Following the spec settle. Curious what it does to the Three.js workflow." },
  { name: "Motion accessibility", desc: "Auditing my own sites against prefers-reduced-motion and vestibular guidance." },
];

function ProficiencyBar({ level }: { level: number }) {
  return (
    <div className="flex gap-[5px] items-center">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          data-proficiency-seg
          className="block h-1 w-[18px] rounded-sm bg-violet"
          style={{ opacity: i < level ? 1 : 0.15 }}
        />
      ))}
    </div>
  );
}

function ToolRow({ tool }: { tool: Tool }) {
  return (
    <div
      data-tool-row
      className="group flex items-center gap-7 border-t border-border-glow-soft py-4 transition-colors hover:bg-chip/30"
    >
      <div className="flex w-[290px] shrink-0 items-center gap-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[4px] bg-chip">
          <TechIcon name={tool.icon} className="h-[18px] w-[18px] text-text-primary" />
        </div>
        <span className="font-body text-[18px] font-medium text-text-primary">
          {tool.name}
        </span>
      </div>
      <span className="flex-1 font-body text-[15px] leading-[1.6] text-text-secondary">
        {tool.note}
      </span>
      <span className="w-[110px] shrink-0 text-right font-mono text-[11px] tracking-[2px] text-text-muted">
        {tool.frequency}
      </span>
      <ProficiencyBar level={tool.proficiency} />
    </div>
  );
}

export function ToolsPage() {
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const content = contentRef.current;
      if (!content) return;

      const mm = gsap.matchMedia();

      mm.add(REDUCED_MOTION_QUERY, () => {
        gsap.set("[data-tools-reveal]", { opacity: 1, y: 0 });
        gsap.set("[data-proficiency-seg]", { scaleX: 1 });
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

        gsap.from("[data-tools-category]", {
          opacity: 0,
          y: 24,
          duration: 0.6,
          ease: ease.entrance,
          stagger: 0.1,
          scrollTrigger: { trigger: content, start: "top 70%" },
        });

        gsap.from("[data-proficiency-seg]", {
          scaleX: 0,
          transformOrigin: "left",
          duration: 0.45,
          ease: "power2.out",
          stagger: { each: 0.06, from: "start" },
          scrollTrigger: { trigger: content, start: "top 60%", once: true },
        });

        gsap.from("[data-learning-item]", {
          opacity: 0,
          y: 16,
          duration: 0.5,
          ease: ease.entrance,
          stagger: 0.08,
          scrollTrigger: { trigger: "[data-learning]", start: "top 80%" },
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
      breadcrumb="HOME / SKILLS"
      eyebrow="[ 02 — SKILLS & TECH STACK ]"
      title="The tools I reach for, and the ones I reach for first."
      deck="A working inventory rather than a badge wall — what each tool is actually used for, how often, and where I am still learning."
      meta={[
        { key: "UPDATED", value: "MAR 2026" },
        { key: "CATEGORIES", value: "FIVE" },
        { key: "TOOLS LISTED", value: "24" },
        { key: "PRIMARY", value: "TS + REACT" },
      ]}
      prev={{ direction: "← HOME", title: "About", href: "/about" }}
      next={{ direction: "NEXT →", title: "Experience", href: "/experience" }}
    >
      <div ref={contentRef} className="flex flex-col gap-20">
        <p
          data-lead
          className="max-w-[960px] font-body text-[18px] md:text-[20px] lg:text-[22px] leading-[1.55] text-text-primary"
        >
          I keep the stack small on purpose. Four or five tools I know deeply
          beat a dozen I have only skimmed the docs for — and the bar for adding
          a dependency is that it saves more than the few lines it replaces.
        </p>

        {CATEGORIES.map((cat) => (
          <div key={cat.eyebrow} data-tools-category className="flex flex-col gap-[18px]">
            <div className="flex items-center gap-5 border-b border-border-glow-soft pb-1">
              <span className="font-mono text-[11px] font-medium tracking-[3px] text-violet">
                {cat.eyebrow}
              </span>
              <span className="font-body text-[15px] text-text-muted">
                {cat.note}
              </span>
            </div>
            {cat.tools.map((tool) => (
              <ToolRow key={tool.name} tool={tool} />
            ))}
          </div>
        ))}

        <div
          data-learning
          className="flex gap-16 rounded border border-border-glow-soft bg-surface p-10"
        >
          <div className="w-[320px] shrink-0 flex flex-col gap-3.5">
            <span className="font-mono text-[11px] font-medium tracking-[3px] text-violet">
              CURRENTLY LEARNING
            </span>
            <p className="font-body text-[15px] leading-[1.7] text-text-secondary">
              Three things on the bench this quarter. Listed here so the stack
              above stays honest.
            </p>
          </div>
          <div className="flex flex-col gap-4 flex-1">
            {LEARNING.map((item) => (
              <div
                key={item.name}
                data-learning-item
                className="flex gap-5 border-b border-border-glow-soft pb-3.5"
              >
                <span className="w-[170px] shrink-0 font-body text-[16px] font-medium text-text-primary">
                  {item.name}
                </span>
                <span className="font-body text-[15px] leading-[1.6] text-text-secondary">
                  {item.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
