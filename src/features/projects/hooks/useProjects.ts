import { useMemo } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { projectsApi } from "../api/projectsApi";
import type { FeaturedProject, FilterTag, ProjectCard, RawProject } from "../types/types";

export const PROJECTS_PAGE_SIZE = 6;

function toCard(p: RawProject): ProjectCard {
  return {
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
  };
}

export function useProjects({ page, category }: { page: number; category: string }) {
  const query = useQuery({
    queryKey: ["projects", "paged", page, category],
    queryFn: () => projectsApi.listPaged({ page, pageSize: PROJECTS_PAGE_SIZE, category }),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const data = query.data;

  const { projects, featured, filters, totalPages, total } = useMemo(() => {
    const projects: ProjectCard[] = (data?.data ?? []).map(toCard);

    const featuredRaw = data?.featured ?? null;
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

    const categories = data?.categories ?? [];
    const filters: FilterTag[] = [
      { label: "All", count: categories.reduce((sum, c) => sum + c.count, 0) },
      ...categories,
    ];

    return {
      projects,
      featured,
      filters,
      totalPages: data?.meta.totalPages ?? 1,
      total: data?.meta.total ?? 0,
    };
  }, [data]);

  return { ...query, projects, featured, filters, totalPages, total };
}
