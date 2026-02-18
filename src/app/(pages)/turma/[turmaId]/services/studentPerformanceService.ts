import {
  QuestionList,
  StudentGradeData,
} from "@/app/(pages)/historico/utils/types";

export async function fetchStudentQuestionnaireDetails(
  token: string,
  questionnaireId: number,
  studentId: number,
): Promise<QuestionList> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/question/resume/${questionnaireId}/student/${studentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar detalhes do questionário do aluno");
  }

  return response.json();
}

export async function fetchStudentGrades(
  token: string,
  classId: number,
  studentId: number,
): Promise<StudentGradeData> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/results/${classId}/final-grade/${studentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar notas do aluno");
  }

  return response.json();
}
