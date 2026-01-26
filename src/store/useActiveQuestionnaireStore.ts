import { create } from "zustand";

interface Question {
  id: number;
  statement: string;
  value: number;
  available: boolean;
  time: number | null;
  order: number;
  questionnaireId: number;
  alternatives: {
    id: number;
    text: string;
    correct: boolean;
    questionId: number;
  }[];
}

interface ActiveQuestionnaire {
  id: number;
  title: string;
  description: string;
  ready: boolean;
  classId: number;
  questions: Question[];
}

interface ActiveQuestionnaireStore {
  activeQuestionnaire: ActiveQuestionnaire | null;
  shouldRefreshQuestionnaires: boolean;
  setActiveQuestionnaire: (questionnaire: ActiveQuestionnaire) => void;
  clearActiveQuestionnaire: () => void;
  triggerRefresh: () => void;
  resetRefresh: () => void;
}

export const useActiveQuestionnaireStore = create<ActiveQuestionnaireStore>(
  (set) => ({
    activeQuestionnaire: null,
    shouldRefreshQuestionnaires: false,
    setActiveQuestionnaire: (questionnaire) => {
      set({ activeQuestionnaire: questionnaire });
    },
    clearActiveQuestionnaire: () => set({ activeQuestionnaire: null }),
    triggerRefresh: () => set({ shouldRefreshQuestionnaires: true }),
    resetRefresh: () => set({ shouldRefreshQuestionnaires: false }),
  })
);
