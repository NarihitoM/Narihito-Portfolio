import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { testimonialsApi } from "../api/testimonialsApi";
import type { Stat } from "../types/types";

export function useTestimonials() {
  const query = useQuery({
    queryKey: ["testimonials"],
    queryFn: () => testimonialsApi.list(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const testimonials = query.data ?? [];

  const stats: Stat[] = useMemo(() => {
    const clientsRepresented = new Set(
      testimonials.map((t) => t.name.trim()).filter(Boolean),
    ).size;
    return [
      { value: String(testimonials.length), label: "TESTIMONIALS COLLECTED" },
      { value: String(clientsRepresented), label: "CLIENTS REPRESENTED" },
    ];
  }, [testimonials]);

  return { ...query, testimonials, stats };
}
