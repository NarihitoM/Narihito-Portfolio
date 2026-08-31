import { useMemo } from "react";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { projectsApi } from "../api/projectsApi";
import type { FeaturedProject, FilterTag, ProjectCard, RawProject } from "../types/types";

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

export function useProjectsInfinite(category: string) {
  const query = useInfiniteQuery({
    queryKey: ["projects", "infinite", category],
    queryFn: ({ pageParam, signal }) => projectsApi.listCursor({ cursor: pageParam, category, signal }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const data = query.data;

  const { projects, featured, filters, total } = useMemo(() => {
    const firstPage = data?.pages[0];
    const projects: ProjectCard[] = (data?.pages ?? []).flatMap((page) => page.data.map(toCard));

    const featuredRaw = firstPage?.featured ?? null;
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

    const categories = firstPage?.categories ?? [];
    const filters: FilterTag[] = [
      { label: "All", count: categories.reduce((sum, c) => sum + c.count, 0) },
      ...categories,
    ];

    return { projects, featured, filters, total: firstPage?.total ?? 0 };
  }, [data]);

  return { ...query, projects, featured, filters, total };
}
