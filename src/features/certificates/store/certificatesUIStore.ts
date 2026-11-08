import { create } from "zustand";

interface CertificatesUIState {
  selectedCertificateId: string | null;
  setSelectedCertificateId: (id: string | null) => void;
  filter: string;
  setFilter: (filter: string) => void;
}

export const useCertificatesUI = create<CertificatesUIState>((set) => ({
  selectedCertificateId: null,
  setSelectedCertificateId: (selectedCertificateId) => set({ selectedCertificateId }),
  filter: "All",
  setFilter: (filter) => set({ filter }),
}));
