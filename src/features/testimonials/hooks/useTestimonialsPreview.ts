import { useQuery } from "@tanstack/react-query";
import { testimonialsApi } from "../api/testimonialsApi";

export function useTestimonialsPreview(limit: number) {
  const query = useQuery({
    queryKey: ["testimonials", "preview", limit],
    queryFn: () => testimonialsApi.list(limit),
  });

  return { ...query, testimonials: query.data ?? [] };
}
