import type { GameStatus } from "../types/types";

const STATUS_STYLES: Record<GameStatus, { badge: string; dot: string }> = {
  LIVE: {
    badge: "border-violet/40 text-violet",
    dot: "bg-violet",
  },
  "COMING SOON": {
    badge: "border-border-glow text-text-secondary",
    dot: "border border-text-secondary",
  },
  CANCELLED: {
    badge: "border-border-glow-soft text-text-muted line-through decoration-text-muted",
    dot: "bg-text-muted",
  },
};

export function GameStatusBadge({ status }: { status?: GameStatus }) {
  if (!status) return null;
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.LIVE;

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] font-medium tracking-[1.5px] ${style.badge}`}
    >
      <span className="relative flex h-1.5 w-1.5">
        {status === "LIVE" && (
          <span className="absolute inset-0 rounded-full bg-violet opacity-60 animate-ping motion-reduce:animate-none" />
        )}
        <span className={`relative h-1.5 w-1.5 rounded-full ${style.dot}`} />
      </span>
      {status}
    </span>
  );
}
