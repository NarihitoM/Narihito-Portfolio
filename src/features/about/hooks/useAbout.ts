import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { aboutApi } from "../api/aboutApi";
import type { Interest, Principle, Route } from "../types/types";

export function useAbout() {
  const query = useQuery({
    queryKey: ["about"],
    queryFn: aboutApi.get,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const data = query.data;

  const principles: Principle[] = useMemo(
    () =>
      (data?.principles ?? []).map((p) => ({
        key: p.num,
        title: p.title,
        desc: p.desc,
      })),
    [data],
  );

  const routes: Route[] = useMemo(
    () =>
      (data?.routes ?? []).map((r) => ({
        id: r.id,
        year: r.year,
        title: r.title,
        desc: r.desc ?? "",
      })),
    [data],
  );

  const interests: Interest[] = useMemo(() => (data?.interests ?? []).map((i) => i.label), [data]);

  return { ...query, principles, routes, interests };
}
