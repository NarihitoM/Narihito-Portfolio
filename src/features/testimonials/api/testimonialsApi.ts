import api from "@/shared/lib/api";
import type { PagedTestimonialsResponse, Testimonial } from "../types/types";

export const testimonialsApi = {
  list: (limit?: number) =>
    api
      .get<{ data: Testimonial[] }>("/public/testimonials", { params: limit ? { limit } : undefined })
      .then((r) => r.data.data),

  listPaged: ({ page, pageSize }: { page: number; pageSize: number }) =>
    api
      .get<PagedTestimonialsResponse>("/public/testimonials", { params: { page, pageSize } })
      .then((r) => r.data),
};
