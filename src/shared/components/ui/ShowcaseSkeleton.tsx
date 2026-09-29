import { Skeleton } from "./Skeleton";

export function ShowcaseSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-14 lg:items-stretch">
      <Skeleton className="h-[240px] lg:h-[320px] w-full flex-1 shrink-0 rounded-[6px]" />
      <div className="flex-1 flex flex-col gap-6 justify-center min-h-[240px] lg:min-h-[320px]">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-20 w-full" />
        <div className="flex gap-2.5">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <div className="flex flex-col gap-2 pt-4 border-t border-border-glow-soft">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-52" />
        </div>
      </div>
    </div>
  );
}
