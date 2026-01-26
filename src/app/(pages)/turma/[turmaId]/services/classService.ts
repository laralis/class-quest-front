import { ClassDetails } from "../utils/types";

export async function fetchClassByAccessCode(
  accessCode: string,
  token: string
): Promise<ClassDetails> {
  const response = await fetch(
    `http://localhost:3300/class/find?accessCode=${accessCode}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar detalhes da turma");
  }

  return response.json();
}
