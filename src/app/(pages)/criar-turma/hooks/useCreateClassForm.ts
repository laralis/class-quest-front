import { useState } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useAuthStore } from "@/store/useAuthStore";
import { createClassSchema, CreateClassFormData } from "../utils/schema";
import { createClass } from "../services/classService";
import { notifySuccess, notifyError } from "../utils/notifications";

export function useCreateClassForm() {
  const [classImage, setClassImage] = useState<File | null>(null);
  const { token } = useAuthStore();
  const router = useRouter();

  const formik = useFormik<CreateClassFormData>({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema: toFormikValidationSchema(createClassSchema),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await createClass(values, classImage, token!);
        notifySuccess();
        setTimeout(() => {
          router.push("/turmas");
        }, 1500);
      } catch (error) {
        console.error("Erro ao criar turma:", error);
        notifyError(
          error instanceof Error
            ? error.message
            : "Erro ao conectar com o servidor",
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  return {
    formik,
    classImage,
    setClassImage,
  };
}
