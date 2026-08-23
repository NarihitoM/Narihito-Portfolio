"use client";

import { X } from "lucide-react";

export function DialogCloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label="Close dialog"
      onClick={onClick}
      className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded border border-border-glow-soft bg-bg-alt text-text-muted transition-colors hover:text-text-primary"
    >
      <X size={16} />
    </button>
  );
}
