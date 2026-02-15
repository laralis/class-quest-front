import { Class } from "../utils/types";

export async function fetchMyClasses(token: string): Promise<Class[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/class/my-classes`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar turmas");
  }

  return response.json();
}
