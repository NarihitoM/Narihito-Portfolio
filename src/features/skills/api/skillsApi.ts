import api from "@/shared/lib/api";
import type { CursorPage, CursorSlice, LearningItem, RawSkillGroup, RawSkillItem } from "../types/types";

export const skillsApi = {
  listGroups: (limit?: number, category?: string, signal?: AbortSignal) =>
    api
      .get<{ data: RawSkillGroup[]; pinned: RawSkillItem[] }>("/public/skills", {
        params: { ...(limit ? { limit } : {}), ...(category ? { category } : {}) },
        signal,
      })
      .then((r) => ({ groups: r.data.data as RawSkillGroup[], pinned: (r.data.pinned ?? []) as RawSkillItem[] })),
  listGroupItemsPaged: (groupId: string, cursor?: string, limit = 6, category?: string, signal?: AbortSignal) =>
    api
      .get<CursorSlice<RawSkillItem>>(`/public/skills/${groupId}/items`, { params: { cursor, limit, ...(category ? { category } : {}) }, signal })
      .then((r) => r.data),
  listLearning: () => api.get<{ data: LearningItem[] }>("/public/learning").then((r) => r.data.data),
  listLearningPaged: (cursor?: string, limit = 6) =>
    api
      .get<CursorPage<LearningItem>>("/public/learning/paged", { params: { cursor, limit } })
      .then((r) => r.data),
};
