import { z } from "zod";

export const createClassSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .min(3, "Nome deve ter no mínimo 3 caracteres"),
  description: z.preprocess((val) => val || "", z.string().optional()),
  units: z.coerce.number().min(1, "Número de unidades deve ser no mínimo 1"),
});

export type CreateClassFormData = z.infer<typeof createClassSchema>;
