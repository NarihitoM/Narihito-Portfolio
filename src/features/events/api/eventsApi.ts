import api from "@/shared/lib/api";
import type { CursorEventsResponse, Event } from "../types/types";

export const eventsApi = {
  list: (limit?: number) =>
    api
      .get<{ data: Event[] }>("/public/events", { params: limit ? { limit } : undefined })
      .then((r) => r.data.data),

  listCursor: ({ cursor, limit = 6, type, signal }: { cursor?: string; limit?: number; type?: string; signal?: AbortSignal }) =>
    api
      .get<CursorEventsResponse>("/public/events/paged", {
        params: { cursor, limit, ...(type && type !== "All" ? { type } : {}) },
        signal,
      })
      .then((r) => r.data),
};
