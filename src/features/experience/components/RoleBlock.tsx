import { Chip } from "@/shared/components/ui/Chip";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { DutyRow } from "./DutyRow";
import type { Role } from "@/features/experience/types/types";

export function RoleBlock({ role, collapsed, onToggle }: { role: Role; collapsed: boolean; onToggle: () => void }) {
  return (
    <div
      data-role
      className="flex flex-col md:flex-row gap-6 md:gap-14 border-t border-border-glow-soft pt-9 pb-9"
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
            className="shrink-0 font-mono text-[11px] tracking-[1px] text-text-muted transition-[color,transform] hover:text-text-primary active:scale-95"
          >
            {collapsed ? "SHOW DETAILS" : "HIDE DETAILS"}
          </button>
        </div>
        <span className="font-mono text-[13px] tracking-[0.6px] text-text-primary">
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

            <div className="flex flex-col gap-3.5">
              <span className="font-mono text-[11px] font-medium tracking-[3px] text-violet">
                TECH STACK
              </span>
              <div className="flex flex-wrap gap-2.5">
                {role.chips.map((chip) => (
                  <Chip key={chip} icon={chip}>
                    {chip}
                  </Chip>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RoleBlockSkeleton() {
  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-14 border-t border-border-glow-soft pt-9 pb-9">
      <div className="md:w-[240px] md:shrink-0 flex flex-row md:flex-col gap-2.5">
        <Skeleton className="h-[13px] w-24" />
        <Skeleton className="h-[13px] w-20" />
      </div>

      <div className="flex-1 flex flex-col gap-5 md:gap-[26px]">
        <div className="flex items-start justify-between gap-4">
          <Skeleton className="h-[30px] md:h-[39px] w-2/3" />
          <Skeleton className="h-[13px] w-24 shrink-0" />
        </div>
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-[51px] md:h-[54px] w-full max-w-[820px]" />

        <div className="flex flex-col">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="flex items-start gap-4 md:gap-[18px] border-t border-border-glow-soft py-3">
              <Skeleton className="h-[17px] w-4 shrink-0" />
              <Skeleton className="h-[22px] md:h-[24px] w-full" />
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3.5">
          <Skeleton className="h-[13px] w-24" />
          <div className="flex flex-wrap gap-2.5">
            {["w-[82px]", "w-[106px]", "w-[90px]", "w-[112px]", "w-24"].map((w) => (
              <Skeleton key={w} className={`h-[26px] rounded-[2px] ${w}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
