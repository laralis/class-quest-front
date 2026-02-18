import { InputText } from "@/app/components/InputText";
import { InputTextArea } from "@/app/components/InputTextArea";
import { useRouter } from "next/navigation";
import { FormikProps } from "formik";
import { Button } from "@/app/components/Button";

interface QuestionnaireFormProps {
  formik: FormikProps<{
    title: string;
    description: string;
  }>;
  isEditing: boolean;
}

export function QuestionnaireForm({
  formik,
  isEditing,
}: QuestionnaireFormProps) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-b-lg p-4 sm:p-6 shadow-md mb-4 sm:mb-6">
      <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 pb-2 border-b border-gray-200">
        Informações do questionário
      </h2>
      <form className="space-y-4 sm:space-y-6" onSubmit={formik.handleSubmit}>
        <div>
          <InputText
            id="title"
            name="title"
            placeholder="Título do questionário"
            text="Título do questionário"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.touched.title && formik.errors.title && (
            <p className="text-red-500 text-xs mt-1">{formik.errors.title}</p>
          )}
        </div>
        <div>
          <InputTextArea
            id="description"
            name="description"
            text="Descrição"
            placeholder="Descrição do questionário"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.description && formik.errors.description && (
            <p className="text-red-500 text-xs mt-1">
              {formik.errors.description}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-4 border-t border-gray-200">
          <Button
            type="button"
            onClick={() => router.back()}
            className="!bg-transparent !text-gray-700 hover:!bg-red-logo hover:!text-white text-sm sm:text-base"
            aria-label="Cancelar e voltar"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={formik.isSubmitting}
            className="!bg-blue-logo hover:!bg-green-logo text-sm sm:text-base"
            aria-label={
              isEditing ? "Atualizar questionário" : "Salvar questionário"
            }
          >
            {formik.isSubmitting
              ? "Salvando..."
              : isEditing
                ? "Atualizar"
                : "Salvar"}
          </Button>
        </div>
      </form>
    </div>
  );
}
