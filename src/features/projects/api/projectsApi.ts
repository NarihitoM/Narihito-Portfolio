import api from "@/shared/lib/api";
import type { CursorProjectsResponse, RawProject } from "../types/types";

export const projectsApi = {
  list: (limit?: number) =>
    api
      .get<{ data: RawProject[] }>("/public/projects", { params: limit ? { limit } : undefined })
      .then((r) => r.data.data),

  listCursor: ({ cursor, limit = 6, category }: { cursor?: string; limit?: number; category?: string }) =>
    api
      .get<CursorProjectsResponse>("/public/projects/paged", {
        params: {
          cursor,
          limit,
          ...(category && category !== "All" ? { category } : {}),
        },
      })
      .then((r) => r.data),
};
