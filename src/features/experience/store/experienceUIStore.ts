import { create } from "zustand";

interface ExperienceUIState {
  collapsedRoles: Set<string>;
  toggleRole: (title: string) => void;
}

export const useExperienceUI = create<ExperienceUIState>((set) => ({
  collapsedRoles: new Set(),
  toggleRole: (title) =>
    set((s) => {
      const next = new Set(s.collapsedRoles);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return { collapsedRoles: next };
    }),
}));
