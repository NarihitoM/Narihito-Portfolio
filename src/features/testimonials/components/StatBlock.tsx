import type { Stat } from "../types/types";

export function StatBlock({ stat }: { stat: Stat }) {
  return (
    <div data-stat className="flex-1 flex flex-col gap-2">
      <span className="font-display text-[36px] md:text-[44px] lg:text-[52px] font-semibold tracking-[-1px] text-text-primary">
        {stat.value}
      </span>
      <span className="font-mono text-[10px] tracking-[2.4px] text-text-muted">
        {stat.label}
      </span>
    </div>
  );
}
