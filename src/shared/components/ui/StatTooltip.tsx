"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export function StatTooltip({ children, text }: { children: ReactNode; text: string }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

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
        role="tooltip"
        className={`pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-56 -translate-x-1/2 rounded-[4px] border border-border-glow-soft bg-bg-panel-solid px-3 py-2 text-[12px] leading-snug text-text-secondary opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 ${open ? "opacity-100" : ""}`}
      >
        {text}
      </div>
    </div>
  );
}
