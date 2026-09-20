"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export function StatTooltip({ children, text }: { children: ReactNode; text: string }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [shift, setShift] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const visible = open || hovered;

  useEffect(() => {
    if (!visible) return;

    const anchor = rootRef.current;
    const tooltip = tooltipRef.current;
    if (anchor && tooltip) {
      const anchorRect = anchor.getBoundingClientRect();
      const width = tooltip.offsetWidth;
      const center = anchorRect.left + anchorRect.width / 2;
      const naturalLeft = center - width / 2;
      const naturalRight = center + width / 2;
      const margin = 12;
      let next = 0;
      if (naturalLeft < margin) next = margin - naturalLeft;
      else if (naturalRight > window.innerWidth - margin) next = window.innerWidth - margin - naturalRight;
      setShift(next);
    }
  }, [visible]);

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
    <div
      ref={rootRef}
      className="relative inline-flex"
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setHovered(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") setHovered(false);
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={visible}
        className="cursor-help text-left"
      >
        {children}
      </button>
      <div
        ref={tooltipRef}
        role="tooltip"
        style={{ transform: `translateX(calc(-50% + ${shift}px))` }}
        className={`pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-56 rounded-[4px] border border-border-glow-soft bg-bg-panel-solid px-3 py-2 text-[12px] leading-snug text-text-secondary shadow-lg transition-opacity duration-150 ${visible ? "opacity-100" : "opacity-0"}`}
      >
        {text}
      </div>
    </div>
  );
}
