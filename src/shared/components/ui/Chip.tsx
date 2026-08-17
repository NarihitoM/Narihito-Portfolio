import type { ReactNode } from "react";

export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-[2px] bg-chip px-2.5 py-1.5 font-mono text-[11px] text-cyan">
      {children}
    </span>
  );
}
