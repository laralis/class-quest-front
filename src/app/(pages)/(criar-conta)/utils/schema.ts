import { z } from "zod";

export const createAccountSchema = z
  .object({
    name: z.preprocess(
      (val) => (typeof val === "string" ? val : ""),
      z
        .string()
        .min(1, "Nome é obrigatório")
        .min(3, "Nome deve ter no mínimo 3 caracteres"),
    ),
    email: z.preprocess(
      (val) => (typeof val === "string" ? val : ""),
      z.string().min(1, "Email é obrigatório").email("Email inválido"),
    ),
    password: z.preprocess(
      (val) => (typeof val === "string" ? val : ""),
      z
        .string()
        .min(1, "Senha é obrigatória")
        .min(6, "Senha deve ter no mínimo 6 caracteres"),
    ),
    confirmPassword: z.preprocess(
      (val) => (typeof val === "string" ? val : ""),
      z.string().min(1, "Confirmação de senha é obrigatória"),
    ),
    role: z.enum(["teacher", "student"]),
    registration: z.preprocess(
      (val) => (typeof val === "string" ? val : ""),
      z.string().optional(),
    ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (data.role === "student") {
        return data.registration && data.registration.trim().length > 0;
      }
      return true;
    },
    {
      message: "Matrícula é obrigatória para alunos",
      path: ["registration"],
    },
  );

export type CreateAccountFormData = z.infer<typeof createAccountSchema>;
