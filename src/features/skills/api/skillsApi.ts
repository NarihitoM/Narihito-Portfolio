import api from "@/shared/lib/api";
import type { LearningItem, RawSkillGroup } from "../types/types";

export const skillsApi = {
  listGroups: () => api.get<{ data: RawSkillGroup[] }>("/public/skills").then((r) => r.data.data),
  listLearning: () => api.get<{ data: LearningItem[] }>("/public/learning").then((r) => r.data.data),
};
