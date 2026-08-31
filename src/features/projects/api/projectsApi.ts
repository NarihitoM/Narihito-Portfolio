import api from "@/shared/lib/api";
import type { CursorProjectsResponse, RawProject } from "../types/types";

export const projectsApi = {
  list: (limit?: number, signal?: AbortSignal) =>
    api
      .get<{ data: RawProject[] }>("/public/projects", { params: limit ? { limit } : undefined, signal })
      .then((r) => r.data.data),

  listCursor: ({ cursor, limit = 6, category, signal }: { cursor?: string; limit?: number; category?: string; signal?: AbortSignal }) =>
    api
      .get<CursorProjectsResponse>("/public/projects/paged", {
        params: {
          cursor,
          limit,
          ...(category && category !== "All" ? { category } : {}),
        },
        signal,
      })
      .then((r) => r.data),
};
