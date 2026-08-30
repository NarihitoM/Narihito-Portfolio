import { LoadMoreButton } from "@/shared/components/ui/LoadMoreButton";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { useCategoryTools } from "../hooks/useSkills";
import { ToolRow } from "./ToolRow";
import type { Category, Tool } from "../types/types";

function CategoryHeader({ category }: { category: Category }) {
  return (
    <div className="flex items-center gap-5 border-b border-border-glow-soft pb-1">
      <span className="font-mono text-[11px] font-medium tracking-[3px] text-violet">
        {category.eyebrow}
      </span>
      <span className="font-body text-[15px] text-text-muted">
        {category.note}
      </span>
      <span className="ml-auto shrink-0 font-mono text-[10px] tracking-[2px] text-text-muted">
        PROFICIENCY
      </span>
    </div>
  );
}

export function CategorySection({ category }: { category: Category }) {
  const { tools, hasMore, loading, loadMore } = useCategoryTools(
    category.id,
    category.tools,
    category.toolsTotal,
    category.eyebrow,
  );

  return (
    <div className="flex flex-col gap-[18px]">
      <CategoryHeader category={category} />
      {tools.map((tool) => (
        <ToolRow key={tool.id} tool={tool} />
      ))}
      {hasMore && <LoadMoreButton onClick={loadMore} loading={loading} label="LOAD MORE" />}
    </div>
  );
}

export function CategorySectionActive({
  category,
  tools,
  hasMore,
  loading,
  onLoadMore,
}: {
  category: Category;
  tools: Tool[];
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
}) {
  return (
    <div className="flex flex-col gap-[18px]">
      <CategoryHeader category={category} />
      {tools.map((tool) => (
        <ToolRow key={tool.id} tool={tool} />
      ))}
      {hasMore && <LoadMoreButton onClick={onLoadMore} loading={loading} label="LOAD MORE" />}
    </div>
  );
}

function ToolRowSkeleton() {
  return (
    <div className="flex flex-col gap-3 border-t border-border-glow-soft py-4 md:flex-row md:items-center md:gap-7">
      <div className="flex items-center gap-3 md:w-[290px] md:shrink-0">
        <Skeleton className="h-7 w-7 shrink-0 rounded-[4px]" />
        <Skeleton className="h-[18px] w-32" />
      </div>
      <Skeleton className="h-[15px] w-full md:flex-1" />
      <div className="flex items-center justify-between gap-4 md:contents">
        <Skeleton className="h-[11px] w-[70px] md:w-[110px]" />
        <Skeleton className="h-2 w-[110px] rounded-full" />
      </div>
    </div>
  );
}

export function CategorySectionSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-[18px]">
      <div className="flex items-center gap-5 border-b border-border-glow-soft pb-1">
        <Skeleton className="h-[13px] w-32" />
        <span className="ml-auto shrink-0 font-mono text-[10px] tracking-[2px] text-text-muted">
          PROFICIENCY
        </span>
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <ToolRowSkeleton key={i} />
      ))}
    </div>
  );
}
