import { useMemo } from "react";
import { keepPreviousData, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { eventsApi } from "../api/eventsApi";
import type { EventFilter } from "../types/types";

export function useEvents(limit?: number) {
  const query = useQuery({
    queryKey: ["events", limit ?? "all"],
    queryFn: () => eventsApi.list(limit),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  return { ...query, events: query.data ?? [] };
}

export function useEventsInfinite(type: string) {
  const query = useInfiniteQuery({
    queryKey: ["events", "infinite", type],
    queryFn: ({ pageParam, signal }) => eventsApi.listCursor({ cursor: pageParam, type, signal }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const events = useMemo(() => (query.data?.pages ?? []).flatMap((page) => page.data), [query.data]);
  const firstPage = query.data?.pages[0];
  const total = firstPage?.total ?? 0;
  const featured = useMemo(() => firstPage?.featured ?? [], [firstPage]);
  const filters = useMemo<EventFilter[]>(
    () => [{ label: "All", count: firstPage?.totalAll ?? total }, ...(firstPage?.types ?? [])],
    [firstPage, total],
  );

  return { ...query, events, total, featured, filters };
}
