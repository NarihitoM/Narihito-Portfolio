import type { ReactNode } from "react";
import { TechIcon } from "./TechIcon";

export function Chip({ children, icon }: { children: ReactNode; icon?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-[2px] bg-chip px-2.5 py-1.5 font-mono text-[11px] text-cyan transition-all duration-200 hover:bg-violet/15 hover:text-violet hover:-translate-y-0.5">
      {icon && <TechIcon name={icon} className="h-3 w-3 shrink-0" />}
      {children}
    </span>
  );
}
