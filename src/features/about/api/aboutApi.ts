import api from "@/shared/lib/api";
import type { AboutResponse, CursorPage, RawInterest, RawPrinciple, RawRoute, Stats } from "../types/types";

export const aboutApi = {
  get: (signal?: AbortSignal) => api.get<{ data: AboutResponse }>("/public/about", { signal }).then((r) => r.data.data),

  getStats: (signal?: AbortSignal) => api.get<{ data: Stats }>("/public/stats", { signal }).then((r) => r.data.data),

  getPrinciples: (cursor?: string, limit = 6, signal?: AbortSignal) =>
    api
      .get<CursorPage<RawPrinciple>>("/public/about/principles", { params: { cursor, limit }, signal })
      .then((r) => r.data),

  getRoutes: (cursor?: string, limit = 6, signal?: AbortSignal) =>
    api.get<CursorPage<RawRoute>>("/public/about/routes", { params: { cursor, limit }, signal }).then((r) => r.data),

  getInterests: (cursor?: string, limit = 6, signal?: AbortSignal) =>
    api
      .get<CursorPage<RawInterest>>("/public/about/interests", { params: { cursor, limit }, signal })
      .then((r) => r.data),
};
