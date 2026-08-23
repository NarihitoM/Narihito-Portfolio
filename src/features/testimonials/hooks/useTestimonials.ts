import { useMemo } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { testimonialsApi } from "../api/testimonialsApi";
import type { Stat } from "../types/types";

export const TESTIMONIALS_PAGE_SIZE = 6;

export function useTestimonials(page: number) {
  const query = useQuery({
    queryKey: ["testimonials", "paged", page],
    queryFn: () => testimonialsApi.listPaged({ page, pageSize: TESTIMONIALS_PAGE_SIZE }),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const data = query.data;
  const total = data?.meta.total ?? 0;
  const clientsRepresented = data?.clientsRepresented ?? 0;

  const stats: Stat[] = useMemo(
    () => [
      { value: String(total), label: "TESTIMONIALS COLLECTED" },
      { value: String(clientsRepresented), label: "CLIENTS REPRESENTED" },
    ],
    [total, clientsRepresented],
  );

  return {
    ...query,
    testimonials: data?.data ?? [],
    stats,
    total,
    totalPages: data?.meta.totalPages ?? 1,
  };
}
