import { useQuery } from "@tanstack/react-query";
import { aboutApi } from "../api/aboutApi";
import type { Interest, Principle, Route } from "../types/types";

export function useAbout() {
  const query = useQuery({
    queryKey: ["about"],
    queryFn: aboutApi.get,
  });

  const principles: Principle[] = (query.data?.principles ?? []).map((p) => ({
    key: p.num,
    title: p.title,
    desc: p.desc,
  }));

  const routes: Route[] = (query.data?.routes ?? []).map((r) => ({
    id: r.id,
    year: r.year,
    title: r.title,
    desc: r.desc ?? "",
  }));

  const interests: Interest[] = (query.data?.interests ?? []).map((i) => i.label);

  return { ...query, principles, routes, interests };
}
