"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

function pageRange(current: number, total: number): (number | "gap")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "gap")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) pages.push("gap");
  for (let i = start; i <= end; i += 1) pages.push(i);
  if (end < total - 1) pages.push("gap");
  pages.push(total);

  return pages;
}

export function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const base =
    "flex h-9 min-w-9 items-center justify-center rounded-[4px] border px-3 font-mono text-[12px] transition-colors";

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-center gap-2 border-t border-border-glow-soft pt-8"
    >
      <button
        type="button"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className={`${base} border-border-glow-soft bg-surface text-text-secondary hover:border-violet hover:text-text-primary disabled:pointer-events-none disabled:opacity-40`}
      >
        <ChevronLeft size={14} />
      </button>

      {pageRange(page, totalPages).map((entry, i) =>
        entry === "gap" ? (
          <span key={`gap-${i}`} className="px-1 font-mono text-[12px] text-text-muted">
            ...
          </span>
        ) : (
          <button
            key={entry}
            type="button"
            aria-label={`Page ${entry}`}
            aria-current={entry === page ? "page" : undefined}
            onClick={() => onChange(entry)}
            className={`${base} ${
              entry === page
                ? "border-violet bg-surface text-text-primary"
                : "border-border-glow-soft bg-surface text-text-secondary hover:border-violet hover:text-text-primary"
            }`}
          >
            {entry}
          </button>
        ),
      )}

      <button
        type="button"
        aria-label="Next page"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        className={`${base} border-border-glow-soft bg-surface text-text-secondary hover:border-violet hover:text-text-primary disabled:pointer-events-none disabled:opacity-40`}
      >
        <ChevronRight size={14} />
      </button>
    </nav>
  );
}
