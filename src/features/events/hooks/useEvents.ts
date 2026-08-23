import { useQuery } from "@tanstack/react-query";
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
