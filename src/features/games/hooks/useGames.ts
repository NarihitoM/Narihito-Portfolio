import { useMemo } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { gamesApi } from "../api/gamesApi";

export function useGames(limit?: number) {
  const query = useQuery({
    queryKey: ["games", limit ?? "all"],
    queryFn: ({ signal }) => gamesApi.list(limit, signal),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  return { ...query, games: query.data ?? [] };
}

export function useGamesInfinite() {
  const query = useInfiniteQuery({
    queryKey: ["games", "infinite"],
    queryFn: ({ pageParam, signal }) => gamesApi.listCursor(pageParam, 6, signal),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const games = useMemo(() => {
    const flat = (query.data?.pages ?? []).flatMap((page) => page.data);
    return [...flat].sort((a, b) => {
      const af = a.type.toLowerCase() === "favorite" ? 0 : 1;
      const bf = b.type.toLowerCase() === "favorite" ? 0 : 1;
      return af - bf;
    });
  }, [query.data]);
  const total = query.data?.pages[0]?.total ?? 0;
  const favourites = query.data?.pages[0]?.favourites ?? games.filter((g) => g.type.toLowerCase() === "favorite").length;

  return { ...query, games, total, favourites };
}
