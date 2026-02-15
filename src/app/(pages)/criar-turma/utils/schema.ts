import { z } from "zod";

export const createClassSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .min(3, "Nome deve ter no mínimo 3 caracteres"),
  description: z.preprocess((val) => val || "", z.string().optional()),
});

export type CreateClassFormData = z.infer<typeof createClassSchema>;
