import { useMemo } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { gamesApi } from "../api/gamesApi";

export function useGames(limit?: number) {
  const query = useQuery({
    queryKey: ["games", limit ?? "all"],
    queryFn: () => gamesApi.list(limit),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  return { ...query, games: query.data ?? [] };
}

export function useGamesInfinite() {
  const query = useInfiniteQuery({
    queryKey: ["games", "infinite"],
    queryFn: ({ pageParam }) => gamesApi.listCursor(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const games = useMemo(() => (query.data?.pages ?? []).flatMap((page) => page.data), [query.data]);
  const total = query.data?.pages[0]?.total ?? 0;

  return { ...query, games, total };
}
