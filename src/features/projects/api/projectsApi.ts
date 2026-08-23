import api from "@/shared/lib/api";
import type { PagedProjectsResponse, RawProject } from "../types/types";

export const projectsApi = {
  list: (limit?: number) =>
    api
      .get<{ data: RawProject[] }>("/public/projects", { params: limit ? { limit } : undefined })
      .then((r) => r.data.data),

  listPaged: ({ page, pageSize, category }: { page: number; pageSize: number; category?: string }) =>
    api
      .get<PagedProjectsResponse>("/public/projects", {
        params: {
          page,
          pageSize,
          ...(category && category !== "All" ? { category } : {}),
        },
      })
      .then((r) => r.data),
};
