import api from "@/shared/lib/api";
import type { CursorEventsResponse, Event } from "../types/types";

export const eventsApi = {
  list: (limit?: number, signal?: AbortSignal) =>
    api
      .get<{ data: Event[] }>("/public/events", { params: limit ? { limit } : undefined, signal })
      .then((r) => r.data.data),

  listCursor: (cursor?: string, limit = 6, signal?: AbortSignal) =>
    api
      .get<CursorEventsResponse>("/public/events/paged", { params: { cursor, limit }, signal })
      .then((r) => r.data),
};
