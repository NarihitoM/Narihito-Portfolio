import { useMemo } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { eventsApi } from "../api/eventsApi";

export function useEvents(limit?: number) {
  const query = useQuery({
    queryKey: ["events", limit ?? "all"],
    queryFn: () => eventsApi.list(limit),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  return { ...query, events: query.data ?? [] };
}

export function useEventsInfinite() {
  const query = useInfiniteQuery({
    queryKey: ["events", "infinite"],
    queryFn: ({ pageParam }) => eventsApi.listCursor(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const events = useMemo(() => (query.data?.pages ?? []).flatMap((page) => page.data), [query.data]);
  const total = query.data?.pages[0]?.total ?? 0;

  return { ...query, events, total };
}
