import { LoadMoreButton } from "@/shared/components/ui/LoadMoreButton";
import { useCategoryTools } from "../hooks/useSkills";
import { ToolRow } from "./ToolRow";
import type { Category } from "../types/types";

export function CategorySection({ category }: { category: Category }) {
  const { tools, hasMore, loading, loadMore } = useCategoryTools(
    category.id,
    category.tools,
    category.toolsTotal,
  );

  return (
    <div className="flex flex-col gap-[18px]">
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
      {tools.map((tool) => (
        <ToolRow key={tool.id} tool={tool} />
      ))}
      {hasMore && <LoadMoreButton onClick={loadMore} loading={loading} label="LOAD MORE" />}
    </div>
  );
}
