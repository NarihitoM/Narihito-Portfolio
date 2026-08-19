import { useQuery } from "@tanstack/react-query";
import { experienceApi } from "../api/experienceApi";
import type { Role } from "../types/types";

export function useExperience() {
  const query = useQuery({
    queryKey: ["experience"],
    queryFn: () => experienceApi.get(),
  });

  const roles: Role[] = (query.data?.roles ?? []).map((r) => ({
    period: r.period,
    type: r.type,
    title: r.title,
    org: r.org,
    desc: r.desc,
    duties: r.duties,
    impact: r.metrics,
    chips: r.chips.map((c) => c.name),
  }));

  const education = query.data?.education ?? [];

  return { ...query, roles, education };
}
