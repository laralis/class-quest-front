import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { createAccountSchema, CreateAccountFormData } from "../utils/schema";
import { createAccount } from "../services/accountService";
import { toast } from "react-toastify";
import { useEffect } from "react";

export function useCreateAccountForm() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/turmas");
    }
  }, [isAuthenticated, router]);

  const formik = useFormik<CreateAccountFormData>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "student",
      registration: "",
    },
    validationSchema: toFormikValidationSchema(createAccountSchema),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const payload = {
          name: values.name,
          email: values.email,
          password: values.password,
          role: values.role,
          ...(values.role === "student" && {
            registration: values.registration,
          }),
        };
        const response = await createAccount(payload);
        if (response.ok) {
          toast.success("Conta criada com sucesso!");
          setTimeout(() => {
            router.push("/login");
          }, 1500);
        } else {
          const data = await response.json();
          toast.error(data.message || "Erro ao criar conta");
        }
      } catch (error) {
        toast.error("Erro ao conectar com o servidor");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return formik;
}
