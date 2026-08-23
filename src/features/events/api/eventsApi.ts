import api from "@/shared/lib/api";
import type { Event } from "../types/types";

export const eventsApi = {
  list: (limit?: number) =>
    api
      .get<{ data: Event[] }>("/public/events", { params: limit ? { limit } : undefined })
      .then((r) => r.data.data),
};
