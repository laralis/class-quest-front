export interface Teacher {
  id: number;
  name: string;
  email: string;
  role: string;
  registration: string;
}

export interface Student {
  id: number;
  name: string;
  email: string;
  role: string;
  registration: string;
}

export interface ClassStudent {
  id: number;
  classId: number;
  studentId: number;
  student: Student;
}

export interface Questionnaire {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  classId: number;
  createdById: number;
  ready: boolean;
}

export interface ClassDetails {
  id: number;
  name: string;
  description: string;
  units: number;
  accessCode: string;
  logoUrl: string;
  createdAt: string;
  teacherId: number;
  teacher: Teacher;
  students: ClassStudent[];
  questionnaires: Questionnaire[];
}

export interface UserAnswer {
  id: number;
  studentId: number;
  alternativeId: number;
  questionId: number;
  createdAt: string;
  alternative: {
    id: number;
    text: string;
    correct: boolean;
    questionId: number;
  };
  question: {
    id: number;
    statement: string;
    questionnaireId: number;
    questionnaire: {
      id: number;
      title: string;
      description: string;
      createdAt: string;
    };
  };
}

export interface QuestionnaireResult {
  questionnaireId: number;
  title: string;
  description: string;
  createdAt: string;
  responseDate: string;
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
}

export interface Question {
  id: number;
  statement: string;
  value: number;
  available: boolean;
  time: number | null;
  order: number;
  questionnaireId: number;
}

export interface Alternative {
  id: number;
  text: string;
  correct: boolean;
  questionId: number;
}

export type TabType = "feed" | "students" | "history" | "generalGrade";
