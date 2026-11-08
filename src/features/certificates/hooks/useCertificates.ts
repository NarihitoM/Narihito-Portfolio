import { useMemo } from "react";
import { keepPreviousData, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { certificatesApi } from "../api/certificatesApi";
import type { CertificateFilter } from "../types/types";

export function useCertificates(limit?: number) {
  const query = useQuery({
    queryKey: ["certificates", limit ?? "all"],
    queryFn: () => certificatesApi.list(limit),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  return { ...query, certificates: query.data ?? [] };
}

export function useCertificatesInfinite(issuer: string) {
  const query = useInfiniteQuery({
    queryKey: ["certificates", "infinite", issuer],
    queryFn: ({ pageParam, signal }) => certificatesApi.listCursor({ cursor: pageParam, issuer, signal }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const certificates = useMemo(() => (query.data?.pages ?? []).flatMap((page) => page.data), [query.data]);
  const firstPage = query.data?.pages[0];
  const total = firstPage?.total ?? 0;
  const featured = useMemo(() => firstPage?.featured ?? [], [firstPage]);
  const filters = useMemo<CertificateFilter[]>(
    () => [{ label: "All", count: firstPage?.totalAll ?? total }, ...(firstPage?.issuers ?? [])],
    [firstPage, total],
  );

  return { ...query, certificates, total, featured, filters };
}
