import api from "@/shared/lib/api";
import type { AboutResponse, CursorPage, RawInterest, RawPrinciple, RawRoute } from "../types/types";

export const aboutApi = {
  get: () => api.get<{ data: AboutResponse }>("/public/about").then((r) => r.data.data),

  getPrinciples: (cursor?: string, limit = 6) =>
    api
      .get<CursorPage<RawPrinciple>>("/public/about/principles", { params: { cursor, limit } })
      .then((r) => r.data),

  getRoutes: (cursor?: string, limit = 6) =>
    api.get<CursorPage<RawRoute>>("/public/about/routes", { params: { cursor, limit } }).then((r) => r.data),

  getInterests: (cursor?: string, limit = 6) =>
    api
      .get<CursorPage<RawInterest>>("/public/about/interests", { params: { cursor, limit } })
      .then((r) => r.data),
};
