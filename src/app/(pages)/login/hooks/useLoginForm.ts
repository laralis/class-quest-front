import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useAuthStore } from "@/store/useAuthStore";
import { loginSchema, LoginFormData } from "../utils/schema";
import { login } from "../services/authService";
import { decodeToken } from "../utils/tokenHelper";

export function useLoginForm() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const formik = useFormik<LoginFormData>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: toFormikValidationSchema(loginSchema),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const { token } = await login(values);
        const user = decodeToken(token);

        setAuth(token, { ...user, id: Number(user.id) });
        router.push("/turmas");
      } catch (error) {
        console.error("Erro ao fazer login:", error);
        setFieldError(
          "password",
          error instanceof Error
            ? error.message
            : "Erro ao conectar com o servidor"
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  return formik;
}
