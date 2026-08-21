import { useQuery } from "@tanstack/react-query";
import { projectsApi } from "../api/projectsApi";
import type { ProjectCard } from "../types/types";

export function useProjectsPreview(limit: number) {
  const query = useQuery({
    queryKey: ["projects", "preview", limit],
    queryFn: () => projectsApi.list(limit),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const projects: ProjectCard[] = (query.data ?? [])
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

  return { ...query, projects };
}
