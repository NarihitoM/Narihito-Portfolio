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
import { Chip } from "@/shared/components/ui/Chip";
import type { Duty, Metric, Role } from "@/features/experience/types/types";

const ROLES: Role[] = [
  {
    period: "2024 — PRESENT",
    type: "Freelance",
    title: "Independent Frontend Developer",
    org: "Contract · Remote / Bangkok",
    desc: "I work directly with product teams that need an interface built properly the first time. Typical engagement is six to twelve weeks: audit, rebuild the front end, hand it back with documentation the team can actually maintain.",
    duties: [
      { index: "01", text: "Own the full frontend delivery — architecture, component system, animation, and deploy pipeline." },
      { index: "02", text: "Run a performance budget on every project and refuse features that break it." },
      { index: "03", text: "Write the handover docs and pair with the in-house team for two weeks after launch." },
      { index: "04", text: "Say no to scope that would ship late and half-finished." },
    ],
    impact: [
      { value: "11", label: "PROJECTS DELIVERED" },
      { value: "100%", label: "ON-TIME HANDOVER" },
      { value: "0", label: "POST-LAUNCH ROLLBACKS" },
    ],
    chips: ["TypeScript", "React", "Next.js", "GSAP", "Tailwind", "Vercel"],
  },
  {
    period: "2023 — 2024",
    type: "Agency",
    title: "Frontend Developer",
    org: "Nimbus Digital · Bangkok",
    desc: "Agency work for hospitality and retail clients. High volume, short timelines, and the first place I was trusted with motion as a deliverable rather than a garnish.",
    duties: [
      { index: "01", text: "Built eight client sites from Figma handoff to production in a shared component library." },
      { index: "02", text: "Introduced the GSAP + ScrollTrigger pattern the studio still uses as its motion baseline." },
      { index: "03", text: "Cut the average Lighthouse performance gap by moving the team off unnecessary carousel and slider dependencies." },
      { index: "04", text: "Reviewed junior developers' pull requests and wrote the internal accessibility checklist." },
    ],
    impact: [
      { value: "8", label: "CLIENT SITES SHIPPED" },
      { value: "+34", label: "AVG. LIGHTHOUSE GAIN" },
      { value: "2", label: "DEVS MENTORED" },
    ],
    chips: ["React", "GSAP", "SCSS", "WordPress", "Figma", "Netlify"],
  },
  {
    period: "2021 — 2023",
    type: "In-house",
    title: "Junior Full-Stack Developer",
    org: "Thanaphan Logistics · Bangkok",
    desc: "Internal tooling for a freight company: shipment tracking, driver assignment, and the reporting dashboard the operations floor lived in eight hours a day.",
    duties: [
      { index: "01", text: "Rebuilt the dispatch dashboard, replacing a 40-second report page with a query that returned in under two seconds." },
      { index: "02", text: "Maintained a PHP and MySQL codebase with no tests, then added the first ones." },
      { index: "03", text: "Sat with dispatchers weekly — the single most useful habit I picked up in that job." },
      { index: "04", text: "Handled on-call for the internal API, which is where the measure-first instinct came from." },
    ],
    impact: [
      { value: "40s → 2s", label: "REPORT LOAD TIME" },
      { value: "6hrs", label: "SAVED PER WEEK" },
      { value: "1", label: "ON-CALL ROTATION" },
    ],
    chips: ["PHP", "MySQL", "jQuery", "Redis", "Docker"],
  },
];

const EDUCATION = [
  { year: "2021", name: "BSc Computer Science", org: "Kasetsart University · Bangkok" },
  { year: "2023", name: "Meta Front-End Developer Certificate", org: "Coursera" },
  { year: "2024", name: "GreenSock Advanced Motion Workshop", org: "GSAP" },
  { year: "2025", name: "Web Accessibility Specialist (in progress)", org: "IAAP" },
];

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

function parseCountable(value: string) {
  const match = value.match(/^([+-]?)(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return null;
  const [, prefix, num, suffix] = match;
  if (suffix.includes("→")) return null;
  return { prefix, target: parseFloat(num), suffix };
}

function MetricBlock({ metric }: { metric: Metric }) {
  const countable = parseCountable(metric.value);

  return (
    <div data-metric className="flex-1 flex flex-col gap-2 pt-6">
      <span className="font-display text-[28px] md:text-[34px] font-semibold tracking-[-1px] text-text-primary">
        {countable ? (
          <span
            data-count-to={countable.target}
            data-count-prefix={countable.prefix}
            data-count-suffix={countable.suffix}
          >
            {countable.prefix}0{countable.suffix}
          </span>
        ) : (
          metric.value
        )}
      </span>
      <span className="font-mono text-[10px] tracking-[2.4px] text-text-muted">
        {metric.label}
      </span>
    </div>
  );
}

function RoleBlock({ role }: { role: Role }) {
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
        <h3 className="font-display text-[26px] md:text-[34px] font-semibold leading-[1.15] tracking-[-0.8px] md:tracking-[-1.2px] text-text-primary">
          {role.title}
        </h3>
        <span className="font-mono text-[13px] tracking-[0.6px] text-text-secondary">
          {role.org}
        </span>
        <p className="max-w-[820px] font-body text-[15px] md:text-[16px] leading-[1.7] text-text-secondary">
          {role.desc}
        </p>

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
      </div>
    </div>
  );
}

export function ExperiencePage() {
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const content = contentRef.current;
      if (!content) return;

      const mm = gsap.matchMedia();

      mm.add(REDUCED_MOTION_QUERY, () => {
        gsap.set("[data-exp-reveal]", { opacity: 1, y: 0 });

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

        gsap.from("[data-role]", {
          opacity: 0,
          y: 24,
          duration: 0.6,
          ease: ease.entrance,
          stagger: 0.12,
          scrollTrigger: { trigger: content, start: "top 70%" },
        });

        gsap.from("[data-duty]", {
          opacity: 0,
          y: 16,
          duration: 0.5,
          ease: ease.entrance,
          stagger: 0.06,
          scrollTrigger: { trigger: content, start: "top 60%" },
        });

        gsap.from("[data-metric]", {
          opacity: 0,
          y: 12,
          duration: 0.5,
          ease: ease.entrance,
          stagger: 0.06,
          scrollTrigger: { trigger: content, start: "top 55%" },
        });

        gsap.utils.toArray<HTMLElement>("[data-count-to]").forEach((el) => {
          const target = parseFloat(el.dataset.countTo || "0");
          const prefix = el.dataset.countPrefix || "";
          const suffix = el.dataset.countSuffix || "";
          const counter = { val: 0 };

          gsap.to(counter, {
            val: target,
            duration: duration.countUp,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
            onUpdate: () => {
              el.textContent = `${prefix}${Math.round(counter.val)}${suffix}`;
            },
          });
        });

        gsap.from("[data-edu-row]", {
          opacity: 0,
          y: 16,
          duration: 0.5,
          ease: ease.entrance,
          stagger: 0.06,
          scrollTrigger: { trigger: "[data-education]", start: "top 80%" },
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
      breadcrumb="HOME / EXPERIENCE"
      eyebrow="[ 03 — EXPERIENCE ]"
      title="Five years, three employers, and the lessons that outlasted each one."
      deck="Full role histories with what I owned, what shipped, and the numbers that moved — plus where the formal training came from."
      meta={[
        { key: "SPAN", value: "2021 — PRESENT" },
        { key: "ROLES", value: "THREE" },
        { key: "CURRENT", value: "INDEPENDENT" },
        { key: "AVAILABILITY", value: "Q2 2026" },
      ]}
      prev={{ direction: "← HOME", title: "Skills & tech stack", href: "/skills" }}
      next={{ direction: "NEXT →", title: "Projects", href: "/projects" }}
    >
      <div ref={contentRef} className="flex flex-col gap-20">
        <p
          data-lead
          className="max-w-[960px] font-body text-[18px] md:text-[20px] lg:text-[22px] leading-[1.55] text-text-primary"
        >
          I have never had a job title that matched what I actually did. What
          follows is the honest version: the work I owned, the constraints I
          worked inside, and the results I can still point at.
        </p>

        {ROLES.map((role) => (
          <RoleBlock key={role.title} role={role} />
        ))}

        <div data-education className="flex flex-col gap-5 border-t border-border-glow pt-9">
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
