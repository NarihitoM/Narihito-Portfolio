import { create } from "zustand";

interface ExperienceUIState {
  collapsedRoles: Set<string>;
  toggleRole: (id: string) => void;
}

export const useExperienceUI = create<ExperienceUIState>((set) => ({
  collapsedRoles: new Set(),
  toggleRole: (id) =>
    set((s) => {
      const next = new Set(s.collapsedRoles);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { collapsedRoles: next };
    }),
}));
