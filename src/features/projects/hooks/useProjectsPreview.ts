import { useQuery } from "@tanstack/react-query";
import { projectsApi } from "../api/projectsApi";
import type { ProjectCard } from "../types/types";

export function useProjectsPreview(limit: number) {
  const query = useQuery({
    queryKey: ["projects", "preview", limit],
    queryFn: () => projectsApi.list(limit),
  });

  const projects: ProjectCard[] = (query.data ?? []).map((p) => ({
    title: p.title,
    year: p.year,
    category: p.category,
    role: p.role,
    status: p.status,
    description: p.description,
    chips: p.chips.map((c) => c.name),
  }));

  return { ...query, projects };
}
