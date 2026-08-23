import { create } from "zustand";

interface ProjectsUIState {
  filter: string;
  page: number;
  setFilter: (filter: string) => void;
  setPage: (page: number) => void;
}

export const useProjectsUI = create<ProjectsUIState>((set) => ({
  filter: "All",
  page: 1,
  setFilter: (filter) => set({ filter, page: 1 }),
  setPage: (page) => set({ page }),
}));
