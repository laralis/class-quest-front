import { create } from "zustand";

interface User {
  id: number;
  name: string;
  email: string;
  // password: string;
  role: string;
  registration: string;
}

interface Student {
  id: number;
  classId: number;
  studentId: number;
  student: User;
}

interface Questionnaire {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  ready: boolean;
  classId: number;
  createdById: number;
}

export interface ClassDetails {
  id: number | null;
  logoUrl: string;
  createdAt: string;
  name: string;
  description: string;
  units: number;
  accessCode: string;
  teacherId: number | null;
  teacher: User | null;
  students: Student[];
  questionnaires: Questionnaire[];
}

interface ClassState {
  currentClassDetails: ClassDetails;
  releaseResult: boolean;
  setCurrentClass: (classDetails: ClassDetails) => void;
  setReleaseResult: () => void;
  clearCurrentClass: () => void;
}

export const useClassStore = create<ClassState>((set) => ({
  currentClassDetails: {
    id: null,
    logoUrl: "",
    createdAt: "",
    name: "",
    description: "",
    units: 0,
    accessCode: "",
    teacherId: null,
    teacher: null,
    students: [],
    questionnaires: [],
  },
  releaseResult: false,
  setCurrentClass: (classDetails: ClassDetails) =>
    set({ currentClassDetails: classDetails }),
  setReleaseResult: () => {
    set({ releaseResult: true });
  },
  clearCurrentClass: () =>
    set({
      currentClassDetails: {
        id: null,
        logoUrl: "",
        createdAt: "",
        name: "",
        description: "",
        units: 0,
        accessCode: "",
        teacherId: null,
        teacher: null,
        students: [],
        questionnaires: [],
      },
      releaseResult: false,
    }),
}));
