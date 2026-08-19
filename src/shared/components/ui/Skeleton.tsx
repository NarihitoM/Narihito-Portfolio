export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-[4px] bg-chip ${className}`} />;
}
