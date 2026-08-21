import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { projectsApi } from "../api/projectsApi";
import type { FeaturedProject, FilterTag, ProjectCard } from "../types/types";

export function useProjects() {
  const query = useQuery({
    queryKey: ["projects"],
    queryFn: () => projectsApi.list(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const data = query.data;

  const { projects, featured, filters } = useMemo(() => {
    const raw = data ?? [];

    const projects: ProjectCard[] = raw
      .map((p) => ({
        projectimg: p.projectimg,
        title: p.title,
        year: p.year,
        category: p.category,
        role: p.role,
        status: p.status,
        description: p.description,
        url: p.url,
        github: p.github,
        featured: p.featured,
        chips: p.chips.map((c) => c.name),
      }))
      .sort((a, b) => Number(b.featured) - Number(a.featured));

    const featuredRaw = raw.find((p) => p.featured);
    const featured: FeaturedProject | null = featuredRaw
      ? {
          projectimg: featuredRaw.projectimg,
          eyebrow: `FEATURED — ${featuredRaw.year}`,
          title: featuredRaw.title,
          description: featuredRaw.description,
          url: featuredRaw.url,
          github: featuredRaw.github,
          chips: featuredRaw.chips.map((c) => c.name),
          meta: {
            year: featuredRaw.year,
            role: featuredRaw.role,
            stack: featuredRaw.category,
            status: featuredRaw.status,
          },
        }
      : null;

    const categories = Array.from(new Set(raw.map((p) => p.category)));
    const filters: FilterTag[] = [
      { label: "All", count: raw.length },
      ...categories.map((label) => ({ label, count: raw.filter((p) => p.category === label).length })),
    ];

    return { projects, featured, filters };
  }, [data]);

  return { ...query, projects, featured, filters };
}
