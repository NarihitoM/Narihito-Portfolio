import type { Metric } from "@/features/experience/types/types";

export function MetricBlock({ metric }: { metric: Metric }) {
  return (
    <div data-metric className="flex-1 flex flex-col gap-2 pt-6">
      <span className="font-display text-[28px] md:text-[34px] font-semibold tracking-[-1px] text-text-primary">
        {metric.value}
      </span>
      <span className="font-mono text-[10px] tracking-[2.4px] text-text-muted">
        {metric.label}
      </span>
    </div>
  );
}
