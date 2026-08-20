import { useQuery } from "@tanstack/react-query";
import { testimonialsApi } from "../api/testimonialsApi";

export function useTestimonialsPreview(limit: number) {
  const query = useQuery({
    queryKey: ["testimonials", "preview", limit],
    queryFn: () => testimonialsApi.list(limit),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  return { ...query, testimonials: query.data ?? [] };
}
