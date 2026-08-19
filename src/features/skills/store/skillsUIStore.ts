import { create } from "zustand";

interface SkillsUIState {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

export const useSkillsUI = create<SkillsUIState>((set) => ({
  activeCategory: "All",
  setActiveCategory: (activeCategory) => set({ activeCategory }),
}));
