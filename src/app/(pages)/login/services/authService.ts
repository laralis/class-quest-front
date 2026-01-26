import { LoginFormData } from "../utils/schema";

interface LoginResponse {
  token: string;
}

export async function login(
  credentials: LoginFormData
): Promise<LoginResponse> {
  const response = await fetch("http://localhost:3300/login", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Erro ao fazer login");
  }

  return response.json();
}
