import api from "@/shared/lib/api";
import type { Testimonial } from "../types/types";

export const testimonialsApi = {
  list: (limit?: number) =>
    api
      .get<{ data: Testimonial[] }>("/public/testimonials", { params: limit ? { limit } : undefined })
      .then((r) => r.data.data),
};
