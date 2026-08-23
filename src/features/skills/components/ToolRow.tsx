import { TechIcon } from "@/shared/components/ui/TechIcon";
import { ProficiencyBar } from "./ProficiencyBar";
import type { Tool } from "../types/types";

export function ToolRow({ tool }: { tool: Tool }) {
  return (
    <div
      className="group flex flex-col gap-3 border-t border-border-glow-soft py-4 transition-colors hover:bg-chip/30 md:flex-row md:items-center md:gap-7"
    >
      <div className="flex items-center gap-3 md:w-[290px] md:shrink-0">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[4px] bg-chip">
          <TechIcon name={tool.icon} className="h-[18px] w-[18px] text-text-primary" />
        </div>
        <span className="font-body text-[18px] font-medium text-text-primary">
          {tool.name}
        </span>
      </div>
      <span className="font-body text-[15px] leading-[1.6] text-text-secondary md:flex-1">
        {tool.note}
      </span>
      <div className="flex items-center justify-between gap-4 md:contents">
        <span className="font-mono text-[11px] tracking-[2px] text-text-muted md:w-[110px] md:shrink-0 md:text-right">
          {tool.frequency}
        </span>
        <ProficiencyBar level={tool.proficiency} />
      </div>
    </div>
  );
}
