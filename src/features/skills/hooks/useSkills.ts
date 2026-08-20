import { useQuery } from "@tanstack/react-query";
import { skillsApi } from "../api/skillsApi";
import type { Category } from "../types/types";

export function useSkills() {
  const query = useQuery({
    queryKey: ["skills"],
    queryFn: skillsApi.listGroups,
  });

  const categories: Category[] = (query.data ?? []).map((g) => ({
    eyebrow: g.label.toUpperCase(),
    note: "",
    tools: g.items.map((item) => ({
      id: item.id,
      name: item.name,
      icon: item.name.toLowerCase().replace(/\s+/g, "-"),
      note: "",
      frequency: "",
      proficiency: 0,
    })),
  }));

  return { ...query, categories };
}
