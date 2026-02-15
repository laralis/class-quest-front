import { CreateClassFormData } from "../utils/schema";

export async function createClass(
  data: CreateClassFormData,
  image: File | null,
  token: string,
) {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("description", data.description || "");

  if (image) {
    formData.append("image", image);
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/class`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erro ao criar turma");
  }

  return response.json();
}
