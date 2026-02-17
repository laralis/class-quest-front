import {
  QuestionnaireHistory,
  TeacherQuestionnaireHistory,
} from "../utils/types";

export async function fetchStudentHistory(
  token: string,
  questionnaireId: number,
): Promise<QuestionnaireHistory[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/question/resume/${questionnaireId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!response.ok) {
    throw new Error("Erro ao buscar histórico");
  }

  return response.json();
}

export async function fetchClassHistory(
  token: string,
  classId: number | null,
): Promise<TeacherQuestionnaireHistory[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/class/${classId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar histórico da turma");
  }

  return response.json();
}

export async function getAllGrades(token: string, classId: number | null) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/results/${classId}/all-students-grades`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar notas");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro:", error);
    throw error;
  }
}
export async function getClassGrades(
  classId: number,
  studentId: number,
  token: string,
): Promise<any> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/results/${classId}/final-grade/${studentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar nota final");
  }

  return response.json();
}
