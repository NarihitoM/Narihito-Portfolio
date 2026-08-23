import api from "@/shared/lib/api";
import type { CursorPage, LearningItem, RawSkillGroup } from "../types/types";

export const skillsApi = {
  listGroups: () => api.get<{ data: RawSkillGroup[] }>("/public/skills").then((r) => r.data.data),
  listLearning: () => api.get<{ data: LearningItem[] }>("/public/learning").then((r) => r.data.data),
  listLearningPaged: (cursor?: string, limit = 6) =>
    api
      .get<CursorPage<LearningItem>>("/public/learning/paged", { params: { cursor, limit } })
      .then((r) => r.data),
};
