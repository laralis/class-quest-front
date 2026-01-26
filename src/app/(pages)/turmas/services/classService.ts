import { Class } from "../utils/types";

export async function fetchMyClasses(token: string): Promise<Class[]> {
  const response = await fetch("http://localhost:3300/class/my-classes", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar turmas");
  }

  return response.json();
}
