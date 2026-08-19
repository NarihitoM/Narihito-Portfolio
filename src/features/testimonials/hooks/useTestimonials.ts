import { useQuery } from "@tanstack/react-query";
import { testimonialsApi } from "../api/testimonialsApi";
import type { Stat } from "../types/types";

export function useTestimonials() {
  const query = useQuery({
    queryKey: ["testimonials"],
    queryFn: () => testimonialsApi.list(),
  });

  const testimonials = query.data ?? [];

  const clientsRepresented = new Set(
    testimonials.map((t) => t.name.trim()).filter(Boolean),
  ).size;
  const stats: Stat[] = [
    { value: String(testimonials.length), label: "TESTIMONIALS COLLECTED" },
    { value: String(clientsRepresented), label: "CLIENTS REPRESENTED" },
  ];

  return { ...query, testimonials, stats };
}
