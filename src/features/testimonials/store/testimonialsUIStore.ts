import { create } from "zustand";

interface TestimonialsUIState {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}

export const useTestimonialsUI = create<TestimonialsUIState>((set) => ({
  activeIndex: 0,
  setActiveIndex: (activeIndex) => set({ activeIndex }),
}));
