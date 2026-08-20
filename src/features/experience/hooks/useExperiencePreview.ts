import { useQuery } from "@tanstack/react-query";
import { experienceApi } from "../api/experienceApi";
import type { ExperienceEntry } from "../types/types";

export function useExperiencePreview(limit: number) {
  const query = useQuery({
    queryKey: ["experience", "preview", limit],
    queryFn: () => experienceApi.get(limit),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const entries: ExperienceEntry[] = (query.data?.roles ?? []).map((r) => ({
    dates: r.period,
    role: r.title,
    company: r.org,
    description: r.desc,
  }));

  return { ...query, entries };
}
