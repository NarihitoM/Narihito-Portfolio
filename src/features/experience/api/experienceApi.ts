import api from "@/shared/lib/api";
import type { ExperienceResponse } from "../types/types";

export const experienceApi = {
  get: (limit?: number) =>
    api
      .get<{ data: ExperienceResponse }>("/public/experience", { params: limit ? { limit } : undefined })
      .then((r) => r.data.data),
};
