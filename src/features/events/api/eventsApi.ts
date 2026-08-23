import api from "@/shared/lib/api";
import type { Event, PagedEventsResponse } from "../types/types";

export const eventsApi = {
  list: (limit?: number) =>
    api
      .get<{ data: Event[] }>("/public/events", { params: limit ? { limit } : undefined })
      .then((r) => r.data.data),

  listPaged: ({ page, pageSize }: { page: number; pageSize: number }) =>
    api
      .get<PagedEventsResponse>("/public/events", { params: { page, pageSize } })
      .then((r) => r.data),
};
