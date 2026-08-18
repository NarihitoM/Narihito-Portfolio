import type { Stat, Testimonial } from "@/features/testimonials/types/types";

export const STATS: Stat[] = [
  { value: "11", label: "PROJECTS DELIVERED" },
  { value: "9", label: "CLIENTS SINCE 2022" },
  { value: "67%", label: "CAME BACK FOR MORE" },
  { value: "4.9", label: "AVERAGE RATING, 7 REVIEWS" },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    initials: "NP",
    name: "Napat Prasert",
    role: "Head of Product, Sansiri Stay",
    quote:
      "He rewrote our booking flow in six weeks and then spent the last one teaching our team how it worked. The handover doc is still the best thing in our repo.",
    context: "SANSIRI STAY — BOOKING PLATFORM · 2026",
  },
  {
    initials: "ML",
    name: "Marisa Leung",
    role: "Creative Director, Nimbus Digital",
    quote:
      "I have worked with developers who make things move. Narihito is the first one who argued with me about which things should not move. The site is calmer and it converts better.",
    context: "NIMBUS AGENCY SITE · 2024",
  },
  {
    initials: "TK",
    name: "Thanaphan Kittisak",
    role: "Operations Manager, Thanaphan Logistics",
    quote:
      "The dispatch dashboard went from a page we dreaded to the page the floor keeps open all day. He sat with the dispatchers every week until it fit how they actually work.",
    context: "DISPATCH DASHBOARD REBUILD · 2023",
  },
  {
    initials: "AC",
    name: "Alice Chen",
    role: "Founder, Fieldnote",
    quote:
      "Direct to the point of being blunt about scope. He told us two features would ship late and badly, and he was right. We cut them and launched on time.",
    context: "FIELDNOTE APP · 2025",
  },
  {
    initials: "SR",
    name: "Suchada Rattana",
    role: "Engineering Lead, Sook Health",
    quote:
      "Handed us a component library our junior devs could actually extend. Six months later it has not been rewritten once, which for us is unprecedented.",
    context: "PATIENT INTAKE FLOW · 2023",
  },
  {
    initials: "JD",
    name: "James Delaney",
    role: "Marketing Lead, Ora Studio",
    quote:
      "Fast, quiet, and slightly obsessive about load time. Our Lighthouse score went from 61 to 98 and nothing about the design got worse.",
    context: "ORA STUDIO SITE · 2025",
  },
  {
    initials: "PW",
    name: "Pim Worrawat",
    role: "Product Manager, Lamphu Rentals",
    quote:
      "He is not the developer to hire if you want someone who says yes to everything. He is the one to hire if you want it to still work in a year.",
    context: "PROPERTY CONSOLE · 2024",
  },
];
