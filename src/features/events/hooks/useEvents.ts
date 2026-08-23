import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { eventsApi } from "../api/eventsApi";

export const EVENTS_PAGE_SIZE = 6;

export function useEvents(limit?: number) {
  const query = useQuery({
    queryKey: ["events", limit ?? "all"],
    queryFn: () => eventsApi.list(limit),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  return { ...query, events: query.data ?? [] };
}

export function useEventsPaged(page: number) {
  const query = useQuery({
    queryKey: ["events", "paged", page],
    queryFn: () => eventsApi.listPaged({ page, pageSize: EVENTS_PAGE_SIZE }),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  return {
    ...query,
    events: query.data?.data ?? [],
    total: query.data?.meta.total ?? 0,
    totalPages: query.data?.meta.totalPages ?? 1,
  };
}
