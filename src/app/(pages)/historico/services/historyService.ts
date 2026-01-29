import {
  QuestionnaireHistory,
  TeacherQuestionnaireHistory,
} from "../utils/types";

export async function fetchStudentHistory(
  token: string,
  questionnaireId: number,
): Promise<QuestionnaireHistory[]> {
  const response = await fetch(
    `http://localhost:3300/questions/questionnaire/${questionnaireId}`,
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
  const response = await fetch(`http://localhost:3300/class/${classId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar histórico da turma");
  }

  return response.json();
}

export async function getQuestionnaireGrades(
  token: string,
  classId: number | null,
) {
  try {
    const response = await fetch(
      `http://localhost:3300/questionnaire/grades/${classId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      console.log("Erro ao buscar notas");
      throw new Error("Erro ao buscar notas");
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Erro:", error);
    throw error;
  }
}
