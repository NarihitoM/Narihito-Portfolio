import { useMemo, useState } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { skillsApi } from "../api/skillsApi";
import type { Category, Tool } from "../types/types";

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
        id: g.id,
        eyebrow: g.label.toUpperCase(),
        note: "",
        toolsTotal: g.itemsTotal,
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

export function useCategoryTools(groupId: string, initialTools: Tool[], toolsTotal: number) {
  const [extra, setExtra] = useState<Tool[]>([]);
  const [cursor, setCursor] = useState<string | undefined>(initialTools.at(-1)?.id);
  const [loading, setLoading] = useState(false);

  const tools = [...initialTools, ...extra];
  const hasMore = tools.length < toolsTotal;

  const loadMore = async () => {
    if (!cursor || loading) return;
    setLoading(true);
    try {
      const page = await skillsApi.listGroupItemsPaged(groupId, cursor);
      const mapped: Tool[] = page.data.map((item) => ({
        id: item.id,
        name: item.name,
        icon: item.name.toLowerCase().replace(/\s+/g, "-"),
        note: "",
        frequency: "",
        proficiency: item.proficiency ?? 0,
      }));
      setExtra((prev) => [...prev, ...mapped]);
      setCursor(page.nextCursor ?? undefined);
    } finally {
      setLoading(false);
    }
  };

  return { tools, hasMore, loading, loadMore };
}

export function useLearning() {
  const query = useInfiniteQuery({
    queryKey: ["learning", "paged"],
    queryFn: ({ pageParam }) => skillsApi.listLearningPaged(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const items = useMemo(() => (query.data?.pages ?? []).flatMap((page) => page.data), [query.data]);

  return { ...query, items, total: query.data?.pages[0]?.total ?? 0 };
}
