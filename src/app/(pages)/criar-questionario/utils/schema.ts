import { z } from "zod";

export const questionSchema = z.object({
  statement: z.preprocess(
    (val) => val || "",
    z.string().min(1, "O enunciado é obrigatório"),
  ),
  value: z.preprocess(
    (val) => (val === "" ? 1 : val),
    z.number().min(0, "O valor deve ser maior ou igual a 0"),
  ),
  hasTimer: z.boolean(),
  timeSeconds: z.preprocess(
    (val) => (val === "" ? null : val),
    z.number().min(0, "O tempo deve ser maior ou igual a 0").nullable(),
  ),
  options: z
    .array(z.string())
    .min(2, "Adicione pelo menos 2 alternativas")
    .refine(
      (options) => options.filter((opt) => opt.trim() !== "").length >= 2,
      "Adicione pelo menos 2 alternativas preenchidas",
    ),
  selectedOption: z
    .union([z.number(), z.null()])
    .refine((val) => val !== null, "Selecione a alternativa correta"),
});

export type QuestionFormData = Omit<
  z.infer<typeof questionSchema>,
  "selectedOption"
> & {
  selectedOption: number | null;
};
