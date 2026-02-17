import { z } from "zod";

export const createClassSchema = z.object({
  name: z.preprocess(
    (val) => val || "",
    z.string().min(3, "Nome é obrigatório e deve ter no mínimo 3 caracteres"),
  ),
  description: z.preprocess((val) => val || "", z.string().optional()),
});

export type CreateClassFormData = z.infer<typeof createClassSchema>;
