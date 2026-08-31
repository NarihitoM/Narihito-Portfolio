import api from "@/shared/lib/api";
import type { CursorPage, Education, ExperienceResponse, RawRole } from "../types/types";

export const experienceApi = {
  get: (limit?: number, signal?: AbortSignal) =>
    api
      .get<{ data: ExperienceResponse }>("/public/experience", { params: limit ? { limit } : undefined, signal })
      .then((r) => r.data.data),

  getRoles: (cursor?: string, limit = 6, signal?: AbortSignal) =>
    api
      .get<CursorPage<RawRole>>("/public/experience/roles", { params: { cursor, limit }, signal })
      .then((r) => r.data),

  getEducation: (cursor?: string, limit = 6, signal?: AbortSignal) =>
    api
      .get<CursorPage<Education>>("/public/experience/education", { params: { cursor, limit }, signal })
      .then((r) => r.data),
};
