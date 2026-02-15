export interface Alternative {
  id: number;
  text: string;
  correct: boolean;
  questionId: number;
}

export interface Question {
  id: number;
  statement: string;
  value: number;
  available: boolean;
  time: number | null;
  order: number;
  questionnaireId: number;
  alternative?: Alternative[];
  alternatives?: Alternative[];
}

export interface Questionnaire {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  ready: boolean;
  classId: number;
  createdById: number;
  questions: Question[];
}
