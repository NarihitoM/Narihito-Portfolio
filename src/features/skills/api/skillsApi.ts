import api from "@/shared/lib/api";
import type { RawSkillGroup } from "../types/types";

export const skillsApi = {
  listGroups: () => api.get<{ data: RawSkillGroup[] }>("/public/skills").then((r) => r.data.data),
};
