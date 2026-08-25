import { useMemo } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { aboutApi } from "../api/aboutApi";
import type { Interest, Principle, Route } from "../types/types";

export function useStats() {
  return useQuery({
    queryKey: ["about", "stats"],
    queryFn: aboutApi.getStats,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}

export function usePrinciples() {
  const query = useInfiniteQuery({
    queryKey: ["about", "principles"],
    queryFn: ({ pageParam }) => aboutApi.getPrinciples(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const principles: Principle[] = useMemo(
    () =>
      (query.data?.pages ?? []).flatMap((page) =>
        page.data.map((p) => ({ id: p.id, key: p.num, title: p.title, desc: p.desc })),
      ),
    [query.data],
  );

  return { ...query, principles, total: query.data?.pages[0]?.total ?? 0 };
}

export function useRoutes() {
  const query = useInfiniteQuery({
    queryKey: ["about", "routes"],
    queryFn: ({ pageParam }) => aboutApi.getRoutes(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const routes: Route[] = useMemo(
    () =>
      (query.data?.pages ?? []).flatMap((page) =>
        page.data.map((r) => ({ id: r.id, year: r.year, title: r.title, desc: r.desc ?? "" })),
      ),
    [query.data],
  );

  return { ...query, routes, total: query.data?.pages[0]?.total ?? 0 };
}

export function useInterests() {
  const query = useInfiniteQuery({
    queryKey: ["about", "interests"],
    queryFn: ({ pageParam }) => aboutApi.getInterests(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const interests: Interest[] = useMemo(
    () => (query.data?.pages ?? []).flatMap((page) => page.data),
    [query.data],
  );

  return { ...query, interests, total: query.data?.pages[0]?.total ?? 0 };
}
