import { useMemo, useState } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { skillsApi } from "../api/skillsApi";
import type { Category, RawSkillItem, Tool } from "../types/types";

export function useSkills() {
  const query = useQuery({
    queryKey: ["skills"],
    queryFn: skillsApi.listGroups,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const raw = query.data;
  const categories: Category[] = useMemo(
    () =>
      (raw?.groups ?? []).map((g) => ({
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
    [raw],
  );

  const pinned = useMemo(() => raw?.pinned ?? [], [raw]);

  return { ...query, categories, pinned };
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

function toTool(item: RawSkillItem): Tool {
  return {
    id: item.id,
    name: item.name,
    icon: item.name.toLowerCase().replace(/\s+/g, "-"),
    note: "",
    frequency: "",
    proficiency: item.proficiency ?? 0,
  };
}

export function useActiveCategoryItems(groupId: string | undefined) {
  const query = useInfiniteQuery({
    queryKey: ["skills", "category-items", groupId],
    queryFn: ({ pageParam }) => skillsApi.listGroupItemsPaged(groupId as string, pageParam, 10),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: !!groupId,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const tools = useMemo(
    () => (query.data?.pages ?? []).flatMap((page) => page.data.map(toTool)),
    [query.data],
  );

  return { ...query, tools };
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
