import type { FeaturedProject, FilterTag, ProjectCard } from "@/features/projects/types/types";

export const FILTERS: FilterTag[] = [
  { label: "All", count: 11 },
  { label: "Product UI", count: 4 },
  { label: "Marketing site", count: 3 },
  { label: "Motion", count: 2 },
  { label: "Internal tool", count: 2 },
];

export const FEATURED: FeaturedProject = {
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

export const PROJECTS: ProjectCard[] = [
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
