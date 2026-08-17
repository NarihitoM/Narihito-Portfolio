import type { ReactNode } from "react";

export function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-[10px] md:text-[11px] font-medium uppercase tracking-[3px] text-violet">
      {children}
    </p>
  );
}

export function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-display text-[30px] md:text-[60px] font-semibold leading-[1.05] tracking-[-1.2px] md:tracking-[-2.2px] text-text-primary">
      {children}
    </h2>
  );
}
