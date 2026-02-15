import { Question } from "../types";

export interface SubmitAnswerPayload {
  studentId: number;
  alternativeId: number;
  questionId: number;
}

export async function submitAnswer(
  payload: SubmitAnswerPayload,
  token: string,
): Promise<Response> {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/user-answer`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function submitAllAnswers(
  answers: Record<number, number>,
  questions: Question[],
  userId: number,
  token: string,
): Promise<boolean> {
  try {
    const promises = questions.map((question) => {
      const payload: SubmitAnswerPayload = {
        studentId: userId,
        alternativeId: answers[question.id],
        questionId: question.id,
      };

      return submitAnswer(payload, token);
    });

    const responses = await Promise.all(promises);

    return responses.every((response) => response.ok);
  } catch (error) {
    console.error("Erro ao enviar respostas:", error);
    throw error;
  }
}
