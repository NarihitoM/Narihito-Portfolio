import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { skillsApi } from "../api/skillsApi";
import type { Category } from "../types/types";

export function useSkills() {
  const query = useQuery({
    queryKey: ["skills"],
    queryFn: skillsApi.listGroups,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const data = query.data;
  const categories: Category[] = useMemo(
    () =>
      (data ?? []).map((g) => ({
        eyebrow: g.label.toUpperCase(),
        note: "",
        tools: g.items.map((item) => ({
          id: item.id,
          name: item.name,
          icon: item.name.toLowerCase().replace(/\s+/g, "-"),
          note: "",
          frequency: "",
          proficiency: item.proficiency ?? 0,
        })),
      })),
    [data],
  );

  return { ...query, categories };
}
