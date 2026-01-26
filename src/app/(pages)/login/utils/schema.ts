import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .preprocess((val) => val || "", z.string())
    .refine((val) => val.length > 0, "Email é obrigatório")
    .refine(
      (val) => z.string().email().safeParse(val).success,
      "Email inválido"
    ),
  password: z.preprocess(
    (val) => val || "",
    z.string().min(1, "Senha é obrigatória")
  ),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export interface User {
  id: string;
  name: string;
  email: string;
  role: "teacher" | "student";
  registration: string;
}
