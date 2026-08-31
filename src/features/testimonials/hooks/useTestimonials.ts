import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { testimonialsApi } from "../api/testimonialsApi";
import type { Stat } from "../types/types";

export function useTestimonialsInfinite(type?: string) {
  const query = useInfiniteQuery({
    queryKey: ["testimonials", "infinite", type ?? "all"],
    queryFn: ({ pageParam, signal }) => testimonialsApi.listCursor(pageParam, 6, type, signal),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const data = query.data;
  const total = data?.pages[0]?.total ?? 0;
  const clientsRepresented = data?.pages[0]?.clientsRepresented ?? 0;

  const stats: Stat[] = useMemo(
    () => [
      { value: String(total), label: "TESTIMONIALS COLLECTED" },
      { value: String(clientsRepresented), label: "CLIENTS REPRESENTED" },
    ],
    [total, clientsRepresented],
  );

  const testimonials = useMemo(() => (data?.pages ?? []).flatMap((page) => page.data), [data]);

  return { ...query, testimonials, stats, total, clientsRepresented };
}
