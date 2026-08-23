import api from "@/shared/lib/api";
import type { CursorEventsResponse, Event } from "../types/types";

export const eventsApi = {
  list: (limit?: number) =>
    api
      .get<{ data: Event[] }>("/public/events", { params: limit ? { limit } : undefined })
      .then((r) => r.data.data),

  listCursor: (cursor?: string, limit = 6) =>
    api
      .get<CursorEventsResponse>("/public/events/paged", { params: { cursor, limit } })
      .then((r) => r.data),
};
