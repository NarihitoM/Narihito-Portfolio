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
  return <Skeleton className="h-[52px] w-full rounded-[6px]" />;
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
