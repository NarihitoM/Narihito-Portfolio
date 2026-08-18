import type { Interest, Principle, Route } from "@/features/about/types/types";

export const PRINCIPLES: Principle[] = [
  { key: "01", title: "Motion is structure", desc: "Every animation earns its place. If it does not explain, orient, or confirm, it is noise." },
  { key: "02", title: "Ship, then refine", desc: "A working thing in production teaches more than a perfect thing in staging." },
  { key: "03", title: "Read the code you wrote", desc: "If a stranger cannot follow it in five minutes, it is not done." },
  { key: "04", title: "Constraints are gifts", desc: "A tight budget and a hard deadline produce the most creative work." },
];

export const ROUTE: Route[] = [
  { year: "2019", title: "Self-taught, badly", desc: "Built a restaurant site for a family friend in raw PHP. It worked. It was also unmaintainable, which turned out to be the useful lesson." },
  { year: "2021", title: "First salaried role", desc: "Joined a logistics company as a junior full-stack dev. Learned SQL under pressure and how to say no to a scope change." },
  { year: "2023", title: "Moved to the front", desc: "Went agency-side. React, TypeScript, and the first client who asked for something that moved." },
  { year: "2026", title: "Independent", desc: "Freelance and contract work for product teams that want the interface to feel considered." },
];

export const INTERESTS: Interest[] = [
  "Film photography",
  "Long-distance running",
  "Typography books",
  "Muay Thai",
  "Cooking Isaan food",
  "Ambient records",
  "Cycling at 5am",
];
