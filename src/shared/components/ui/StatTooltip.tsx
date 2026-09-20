"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export function StatTooltip({ children, text }: { children: ReactNode; text: string }) {
  const [open, setOpen] = useState(false);
  const [shift, setShift] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const tooltip = tooltipRef.current;
    if (tooltip) {
      const rect = tooltip.getBoundingClientRect();
      const margin = 12;
      let next = 0;
      if (rect.left < margin) next = margin - rect.left;
      else if (rect.right > window.innerWidth - margin) next = window.innerWidth - margin - rect.right;
      setShift(next);
    }

    const onOutside = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="group relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="cursor-help text-left"
      >
        {children}
      </button>
      <div
        ref={tooltipRef}
        role="tooltip"
        style={{ transform: `translateX(calc(-50% + ${shift}px))` }}
        className={`pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-56 rounded-[4px] border border-border-glow-soft bg-bg-panel-solid px-3 py-2 text-[12px] leading-snug text-text-secondary opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 ${open ? "opacity-100" : ""}`}
      >
        {text}
      </div>
    </div>
  );
}
