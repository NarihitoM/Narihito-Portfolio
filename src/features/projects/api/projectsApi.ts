import api from "@/shared/lib/api";
import type { RawProject } from "../types/types";

export const projectsApi = {
  list: (limit?: number) =>
    api
      .get<{ data: RawProject[] }>("/public/projects", { params: limit ? { limit } : undefined })
      .then((r) => r.data.data),
};
