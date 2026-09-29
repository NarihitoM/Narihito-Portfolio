import { create } from "zustand";

interface EventsUIState {
  selectedEventId: string | null;
  setSelectedEventId: (id: string | null) => void;
  filter: string;
  setFilter: (filter: string) => void;
}

export const useEventsUI = create<EventsUIState>((set) => ({
  selectedEventId: null,
  setSelectedEventId: (selectedEventId) => set({ selectedEventId }),
  filter: "All",
  setFilter: (filter) => set({ filter }),
}));
