import { create } from "zustand";

interface GamesUIState {
  selectedGameId: string | null;
  setSelectedGameId: (id: string | null) => void;
}

export const useGamesUI = create<GamesUIState>((set) => ({
  selectedGameId: null,
  setSelectedGameId: (selectedGameId) => set({ selectedGameId }),
}));
