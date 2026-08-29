import api from "@/shared/lib/api";
import type { CursorPage, CursorSlice, LearningItem, RawSkillGroup, RawSkillItem } from "../types/types";

export const skillsApi = {
  listGroups: () =>
    api
      .get<{ data: RawSkillGroup[]; pinned: RawSkillItem[] }>("/public/skills")
      .then((r) => ({ groups: r.data.data as RawSkillGroup[], pinned: (r.data.pinned ?? []) as RawSkillItem[] })),
  listGroupItemsPaged: (groupId: string, cursor?: string, limit = 6) =>
    api
      .get<CursorSlice<RawSkillItem>>(`/public/skills/${groupId}/items`, { params: { cursor, limit } })
      .then((r) => r.data),
  listLearning: () => api.get<{ data: LearningItem[] }>("/public/learning").then((r) => r.data.data),
  listLearningPaged: (cursor?: string, limit = 6) =>
    api
      .get<CursorPage<LearningItem>>("/public/learning/paged", { params: { cursor, limit } })
      .then((r) => r.data),
};
