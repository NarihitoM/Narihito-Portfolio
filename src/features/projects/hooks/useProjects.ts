import { useQuery } from "@tanstack/react-query";
import { projectsApi } from "../api/projectsApi";
import type { FeaturedProject, FilterTag, ProjectCard } from "../types/types";

export function useProjects() {
  const query = useQuery({
    queryKey: ["projects"],
    queryFn: () => projectsApi.list(),
  });

  const raw = query.data ?? [];

  const projects: ProjectCard[] = raw.map((p) => ({
    title: p.title,
    year: p.year,
    category: p.category,
    role: p.role,
    status: p.status,
    description: p.description,
    chips: p.chips.map((c) => c.name),
  }));

  const featuredRaw = raw.find((p) => p.featured);
  const featured: FeaturedProject | null = featuredRaw
    ? {
        eyebrow: `FEATURED — ${featuredRaw.year}`,
        title: featuredRaw.title,
        description: featuredRaw.description,
        chips: featuredRaw.chips.map((c) => c.name),
        meta: {
          year: featuredRaw.year,
          role: featuredRaw.role,
          stack: featuredRaw.category,
          status: featuredRaw.status,
          duration: "",
        },
      }
    : null;

  const categories = Array.from(new Set(raw.map((p) => p.category)));
  const filters: FilterTag[] = [
    { label: "All", count: raw.length },
    ...categories.map((label) => ({ label, count: raw.filter((p) => p.category === label).length })),
  ];

  return { ...query, projects, featured, filters };
}
