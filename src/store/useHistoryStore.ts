import { create } from "zustand";

interface HistoryStore {
  questionnaireId: number | null;
  setQuestionnaireId: (id: number) => void;
}

export const useHistoryStore = create<HistoryStore>((set) => ({
  questionnaireId: null,
  setQuestionnaireId: (id) => set({ questionnaireId: id }),
}));
