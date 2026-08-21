import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { experienceApi } from "../api/experienceApi";
import type { Role } from "../types/types";

export function useExperience() {
  const query = useQuery({
    queryKey: ["experience"],
    queryFn: () => experienceApi.get(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const data = query.data;

  const roles: Role[] = useMemo(
    () =>
      (data?.roles ?? []).map((r) => ({
        period: r.period,
        type: r.type,
        title: r.title,
        org: r.org,
        desc: r.desc,
        duties: r.duties,
        impact: r.metrics,
        chips: r.chips.map((c) => c.name),
      })),
    [data],
  );

  const education = useMemo(() => data?.education ?? [], [data]);

  return { ...query, roles, education };
}
