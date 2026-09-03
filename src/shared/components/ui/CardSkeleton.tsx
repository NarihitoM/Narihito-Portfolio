import { Skeleton } from "./Skeleton";

export function CardSkeleton({ imageClassName }: { imageClassName: string }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-[6px] border border-border-glow-soft bg-surface">
      <Skeleton className={`w-full rounded-none border-0 ${imageClassName}`} />
      <div className="flex flex-col gap-3 p-5 md:p-6">
        <Skeleton className="h-6 w-2/5" />
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-[68px] w-full" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
        </div>
      </div>
    </div>
  );
}
