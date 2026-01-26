import { create } from "zustand";

interface ClassState {
  currentClassId: number | null;
  currentClassName: string | null;
  currentClassCode: string;
  setCurrentClassCode: (classId: string) => void;
  setCurrentClass: (classId: number, className: string) => void;
  clearCurrentClass: () => void;
}

export const useClassStore = create<ClassState>((set) => ({
  currentClassId: null,
  currentClassName: null,
  currentClassCode: "",
  setCurrentClassCode: (classCode: string) =>
    set({ currentClassCode: classCode }),
  setCurrentClass: (classId: number, className: string) =>
    set({ currentClassId: classId, currentClassName: className }),
  clearCurrentClass: () =>
    set({ currentClassId: null, currentClassName: null }),
}));
