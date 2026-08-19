import { create } from "zustand";

interface ProjectsUIState {
  filter: string;
  setFilter: (filter: string) => void;
}

export const useProjectsUI = create<ProjectsUIState>((set) => ({
  filter: "All",
  setFilter: (filter) => set({ filter }),
}));
