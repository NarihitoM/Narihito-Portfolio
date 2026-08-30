import { Skeleton } from "@/shared/components/ui/Skeleton";

export function ProjectCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-[6px] border border-border-glow-soft bg-surface">
      <Skeleton className="h-[200px] md:h-[230px] w-full rounded-none" />
      <div className="flex flex-col gap-4 p-5 md:p-6">
        <Skeleton className="h-5 w-2/3" />
        <div className="flex flex-wrap items-center gap-3">
          <Skeleton className="h-2.5 w-10" />
          <Skeleton className="h-2.5 w-20" />
          <Skeleton className="h-2.5 w-14" />
          <Skeleton className="h-2.5 w-12" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-[15px] w-full" />
          <Skeleton className="h-[15px] w-full" />
          <Skeleton className="h-[15px] w-2/3" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-16 rounded-[2px]" />
          <Skeleton className="h-6 w-20 rounded-[2px]" />
          <Skeleton className="h-6 w-14 rounded-[2px]" />
        </div>
        <div className="flex items-center gap-2 pt-2">
          <Skeleton className="h-9 w-9 rounded" />
          <Skeleton className="h-9 w-9 rounded" />
        </div>
      </div>
    </div>
  );
}
