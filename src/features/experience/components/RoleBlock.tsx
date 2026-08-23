import { Chip } from "@/shared/components/ui/Chip";
import { DutyRow } from "./DutyRow";
import { MetricBlock } from "./MetricBlock";
import type { Role } from "@/features/experience/types/types";

export function RoleBlock({ role, collapsed, onToggle }: { role: Role; collapsed: boolean; onToggle: () => void }) {
  return (
    <div
      data-role
      className="flex flex-col md:flex-row gap-6 md:gap-14 border-t border-border-glow pt-9"
    >
      <div className="md:w-[240px] md:shrink-0 flex flex-row md:flex-col gap-2.5">
        <span className="font-mono text-[11px] font-medium tracking-[3px] text-violet">
          {role.period}
        </span>
        <span className="font-mono text-[11px] tracking-[2px] text-text-muted">
          {role.type}
        </span>
      </div>

      <div className="flex-1 flex flex-col gap-5 md:gap-[26px]">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-[26px] md:text-[34px] font-semibold leading-[1.15] tracking-[-0.8px] md:tracking-[-1.2px] text-text-primary">
            {role.title}
          </h3>
          <button
            type="button"
            onClick={onToggle}
            className="shrink-0 font-mono text-[11px] tracking-[1px] text-text-muted transition-colors hover:text-text-primary"
          >
            {collapsed ? "SHOW DETAILS" : "HIDE DETAILS"}
          </button>
        </div>
        <span className="font-mono text-[13px] tracking-[0.6px] text-text-secondary">
          {role.org}
        </span>
        <p className="max-w-[820px] font-body text-[15px] md:text-[16px] leading-[1.7] text-text-secondary">
          {role.desc}
        </p>

        <div
          className={`grid transition-[grid-template-rows] duration-300 ease-out ${collapsed ? "grid-rows-[0fr]" : "grid-rows-[1fr]"}`}
        >
          <div className={`flex flex-col gap-5 md:gap-[26px] overflow-hidden transition-opacity duration-300 ${collapsed ? "opacity-0" : "opacity-100"}`}>
            <div className="flex flex-col">
              {role.duties.map((duty) => (
                <DutyRow key={duty.index} duty={duty} />
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-6 pt-2">
              {role.impact.map((metric) => (
                <MetricBlock key={metric.label} metric={metric} />
              ))}
            </div>

            <div className="flex flex-wrap gap-2.5">
              {role.chips.map((chip) => (
                <Chip key={chip}>{chip}</Chip>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
