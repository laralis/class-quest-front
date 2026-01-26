import { CreateClassFormData } from "../utils/schema";

export async function createClass(data: CreateClassFormData, token: string) {
  const response = await fetch("http://localhost:3300/class", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erro ao criar turma");
  }

  return response.json();
}
