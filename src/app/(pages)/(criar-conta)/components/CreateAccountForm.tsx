import { InputText } from "@/app/components/InputText";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/app/components/Button";
import { InputPassword } from "@/app/components/InputPassword";
import { useCreateAccountForm } from "../hooks/useCreateAccountForm";

export function CreateAccountForm() {
  const formik = useCreateAccountForm();

  return (
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
            value={formik.values.registration ?? ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
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
  );
}
