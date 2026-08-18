import type { Education, Role } from "@/features/experience/types/types";

export const ROLES: Role[] = [
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

export const EDUCATION: Education[] = [
  { year: "2021", name: "BSc Computer Science", org: "Kasetsart University · Bangkok" },
  { year: "2023", name: "Meta Front-End Developer Certificate", org: "Coursera" },
  { year: "2024", name: "GreenSock Advanced Motion Workshop", org: "GSAP" },
  { year: "2025", name: "Web Accessibility Specialist (in progress)", org: "IAAP" },
];
