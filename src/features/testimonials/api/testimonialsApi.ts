import api from "@/shared/lib/api";
import type { CursorTestimonialsResponse, Testimonial } from "../types/types";

export const testimonialsApi = {
  list: (limit?: number) =>
    api
      .get<{ data: Testimonial[] }>("/public/testimonials", { params: limit ? { limit } : undefined })
      .then((r) => r.data.data),

  listCursor: (cursor?: string, limit = 6, type?: string) =>
    api
      .get<CursorTestimonialsResponse>("/public/testimonials/paged", { params: { cursor, limit, ...(type ? { type } : {}) } })
      .then((r) => r.data),
};
