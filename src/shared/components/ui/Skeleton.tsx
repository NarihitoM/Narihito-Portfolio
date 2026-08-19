export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-[4px] border border-border-glow-soft bg-surface ${className}`}
    />
  );
}
