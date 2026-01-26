import { InputText } from "@/app/components/InputText";
import { InputTextArea } from "@/app/components/InputTextArea";
import { useRouter } from "next/navigation";
import { FormikProps } from "formik";

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
    <div className="bg-white rounded-b-lg p-6 shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-200">
        Informações do Questionário
      </h2>
      <form className="space-y-6" onSubmit={formik.handleSubmit}>
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

        <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-red-logo hover:text-white cursor-pointer transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="px-4 py-2 bg-blue-logo text-white rounded-md hover:bg-green-logo cursor-pointer disabled:opacity-50 transition-colors"
          >
            {formik.isSubmitting
              ? "Salvando..."
              : isEditing
              ? "Atualizar Rascunho"
              : "Salvar Rascunho"}
          </button>
        </div>
      </form>
    </div>
  );
}
