import { ClassDetails } from "../utils/types";
import { toast } from "react-toastify";

export async function fetchClassByAccessCode(
  accessCode: string,
  token: string,
): Promise<ClassDetails> {
  const response = await fetch(
    `http://localhost:3300/class/find?accessCode=${accessCode}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar detalhes da turma");
  }

  return response.json();
}



export async function deleteClass(
  id: number | null,
  token: string | null,
): Promise<boolean> {
  if (!id) {
    toast.error("ID da turma inválido");
    return false;
  }

  if (!token) {
    toast.error("Token de autenticação não encontrado");
    return false;
  }

  try {
    const response = await fetch(`http://localhost:3300/class/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      toast.success("Turma excluida com sucesso!");
      return true;
    } else {
      const data = await response.json().catch(() => ({}));
      const errorMessage =
        data.message || `Erro ${response.status}: ${response.statusText}`;
      toast.error(errorMessage);
      console.error("Erro ao excluir turma:", {
        status: response.status,
        data,
      });
      return false;
    }
  } catch (error) {
    console.error("Erro ao excluir turma:", error);
    toast.error("Erro ao conectar com o servidor");
    return false;
  }
}
