"use client";

import { TriangleAlert } from "lucide-react";

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <TriangleAlert className="h-8 w-8 text-destructive" />
      <p className="font-body text-[15px] text-text-secondary">Failed to load content.</p>
      <button
        type="button"
        onClick={() => onRetry()}
        className="rounded-full border border-border-glow-soft px-5 py-2 font-mono text-[11px] tracking-[1px] text-text-primary transition-colors hover:border-violet"
      >
        RETRY
      </button>
    </div>
  );
}
