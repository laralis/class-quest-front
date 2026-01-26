import { create } from "zustand";

interface QuestionStore {
  shouldRefreshQuestions: boolean;
  triggerRefresh: () => void;
  resetRefresh: () => void;
}

export const useQuestionStore = create<QuestionStore>((set) => ({
  shouldRefreshQuestions: false,
  triggerRefresh: () => set({ shouldRefreshQuestions: true }),
  resetRefresh: () => set({ shouldRefreshQuestions: false }),
}));
