export interface QuestionnaireHistory {
  id: number;
  title: string;
  description: string;
  className: string;
  classId: number;
  score: number;
  maxScore: number;
  completedAt: string;
  totalQuestions: number;
  correctAnswers: number;
}

export interface Alternative {
  id: number;
  text: string;
  correct: boolean;
  questionId: number;
}

export interface UserAnswer {
  id: number;
  responseDate: string;
  studentId: number;
  alternativeId: number;
  questionId: number;
}

export interface QuestionDetail {
  id: number;
  statement: string;
  value: number;
  available: boolean;
  time: number;
  order: number;
  questionnaireId: number;
  questionnaire: {
    id: number;
    title: string;
    description: string;
    createdAt: string;
    ready: boolean;
    classId: number;
    createdById: number;
  };
  alternative: Alternative[];
  userAnswers: UserAnswer[];
}

export interface QuestionnaireDetailResponse {
  id: number;
  title: string;
  description: string;
  className: string;
  score: number;
  maxScore: number;
  completedAt: string;
  questions: QuestionDetail[];
}

export type QuestionList = QuestionDetail[];

export interface StudentGrade {
  studentId: string;
  studentName: string;
  grade: number | null;
  answeredAt: string | null;
}

export interface TeacherQuestionnaireHistory {
  questionnaireId: string;
  title: string;
  description: string;
  createdAt: string;
  totalStudents: number;
  answeredCount: number;
  students: StudentGrade[];
}
