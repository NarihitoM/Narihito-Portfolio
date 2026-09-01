"use client";

import { useSnapScroll } from "@/features/portfolio/hooks/useSnapScroll";

export function SnapScrollRoot({ children }: { children: React.ReactNode }) {
  useSnapScroll(true);
  return <>{children}</>;
}
