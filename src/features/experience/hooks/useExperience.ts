import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { experienceApi } from "../api/experienceApi";
import type { Role } from "../types/types";

export function useExperienceRoles() {
  const query = useInfiniteQuery({
    queryKey: ["experience", "roles"],
    queryFn: ({ pageParam }) => experienceApi.getRoles(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const roles: Role[] = useMemo(
    () =>
      (query.data?.pages ?? []).flatMap((page) =>
        page.data.map((r) => ({
          id: r.id,
          period: r.period,
          type: r.type,
          title: r.title,
          org: r.org,
          desc: r.desc,
          pinned: r.pinned ?? false,
          duties: r.duties,
          impact: r.metrics,
          chips: r.chips.map((c) => c.name),
        })),
      ),
    [query.data],
  );

  const total = query.data?.pages[0]?.total ?? 0;

  return { ...query, roles, total };
}

export function useEducation() {
  const query = useInfiniteQuery({
    queryKey: ["experience", "education"],
    queryFn: ({ pageParam }) => experienceApi.getEducation(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const education = useMemo(() => (query.data?.pages ?? []).flatMap((page) => page.data), [query.data]);
  const total = query.data?.pages[0]?.total ?? 0;

  return { ...query, education, total };
}
