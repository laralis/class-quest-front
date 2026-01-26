export interface Teacher {
  id: number;
  name: string;
  email: string;
  role: string;
  registration: string;
}

export interface Class {
  id: number;
  logoUrl: string;
  createdAt: string;
  name: string;
  description: string;
  units: number;
  accessCode: string;
  teacherId: number;
  teacher: Teacher;
  students: [];
  questionnaires: [];
}
