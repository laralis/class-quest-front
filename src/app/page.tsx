"use client";
import { InputText } from "@/app/components/InputText";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/app/components/Button";
import { InputPassword } from "@/app/components/InputPassword";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { z } from "zod";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";

const createAccountSchema = z
  .object({
    name: z
      .string()
      .min(1, "Nome é obrigatório")
      .min(3, "Nome deve ter no mínimo 3 caracteres"),
    email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
    password: z
      .string()
      .min(1, "Senha é obrigatória")
      .min(6, "Senha deve ter no mínimo 6 caracteres"),
    confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
    role: z.enum(["teacher", "student"]),
    registration: z.preprocess((val) => val || "", z.string().optional()),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (data.role === "student") {
        return data.registration && data.registration.trim().length > 0;
      }
      return true;
    },
    {
      message: "Matrícula é obrigatória para alunos",
      path: ["registration"],
    },
  );

export default function CreateAccount() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/turmas");
    }
  }, [isAuthenticated, router]);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "student" as "teacher" | "student",
      registration: "",
    },
    validationSchema: toFormikValidationSchema(createAccountSchema),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: values.name,
              email: values.email,
              password: values.password,
              role: values.role,
              ...(values.role === "student" && {
                registration: values.registration,
              }),
            }),
          },
        );

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
        console.error("Erro ao criar conta:", error);
        toast.error("Erro ao conectar com o servidor");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-w-[320px] text-blue-logo text-sm sm:p-24 max-w-xl m-auto min-h-screen flex items-center justify-center">
      <form
        onSubmit={formik.handleSubmit}
        className="w-full flex flex-col gap-4 shadow-md rounded-3xl bg-white p-8"
      >
        <Image
          src="/favicon.png"
          alt="Logo"
          width={100}
          height={100}
          className="mx-auto my-[-20px]"
        />
        <h1 className="text-2xl font-bold text-blue-logo text-center">
          Criar nova conta
        </h1>

        <InputText
          type="text"
          id="name"
          placeholder="Nome completo"
          text="Nome"
          {...formik.getFieldProps("name")}
        />
        {formik.touched.name && formik.errors.name && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.name}</p>
        )}

        <InputText
          type="email"
          id="email"
          placeholder="Email"
          text="Email"
          {...formik.getFieldProps("email")}
        />
        {formik.touched.email && formik.errors.email && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
        )}

        <div>
          <label className="block text-blue-logo font-medium mb-2">
            Tipo de conta
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="role"
                value="student"
                checked={formik.values.role === "student"}
                onChange={formik.handleChange}
                className="cursor-pointer"
              />
              Aluno
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="role"
                value="teacher"
                checked={formik.values.role === "teacher"}
                onChange={formik.handleChange}
                className="cursor-pointer"
              />
              Professor
            </label>
          </div>
        </div>

        {formik.values.role === "student" && (
          <>
            <InputText
              type="text"
              id="registration"
              placeholder="Matrícula"
              text="Matrícula"
              {...formik.getFieldProps("registration")}
            />
            {formik.touched.registration && formik.errors.registration && (
              <p className="text-red-500 text-xs mt-1">
                {formik.errors.registration}
              </p>
            )}
          </>
        )}

        <InputPassword
          id="password"
          placeholder="Senha"
          {...formik.getFieldProps("password")}
        />
        {formik.touched.password && formik.errors.password && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
        )}

        <InputPassword
          id="confirmPassword"
          placeholder="Confirmar senha"
          text="Confirmar senha"
          {...formik.getFieldProps("confirmPassword")}
        />
        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
          <p className="text-red-500 text-xs mt-1">
            {formik.errors.confirmPassword}
          </p>
        )}

        <Button
          type="submit"
          disabled={formik.isSubmitting}
          className="text-white bg-gradient-to-r from-green-logo to-blue-logo disabled:from-gray-300 disabled:to-gray-400 hover:cursor-pointer hover:from-secondary-purple hover:to-purple-logo"
        >
          {formik.isSubmitting ? "Criando conta..." : "Criar conta"}
        </Button>

        <Link
          href="/login"
          className="flex justify-center text-blue-logo p-2 px-4 py-2 border border-gray-300 rounded-md bg-gradient-to-r hover:from-secondary-purple hover:to-purple-logo hover:text-white cursor-pointer bg-transparent"
        >
          Já tenho uma conta
        </Link>
      </form>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        progressClassName="!bg-blue-logo"
        className="text-sm sm:text-base"
      />
    </div>
  );
}
