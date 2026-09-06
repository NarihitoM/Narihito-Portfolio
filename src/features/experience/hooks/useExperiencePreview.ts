import { useMemo } from "react";
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

  const data = query.data;

  const entries: ExperienceEntry[] = useMemo(
    () =>
      (data?.roles ?? []).map((r) => ({
        id: r.id,
        dates: r.period,
        role: r.title,
        company: r.org,
        description: r.desc,
      })),
    [data],
  );

  return { ...query, entries };
}
