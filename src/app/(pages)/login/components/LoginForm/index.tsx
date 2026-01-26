import Link from "next/link";
import Image from "next/image";
import { InputText } from "@/app/components/InputText";
import { InputPassword } from "@/app/components/InputPassword";
import { Button } from "@/app/components/Button";
import { useLoginForm } from "../../hooks/useLoginForm";
import { FormField } from "../FormField";

export function LoginForm() {
  const formik = useLoginForm();

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
        Fazer login
      </h1>

      <FormField error={formik.errors.email} touched={formik.touched.email}>
        <InputText
          type="email"
          id="email"
          placeholder="Email"
          text="Email"
          {...formik.getFieldProps("email")}
        />
      </FormField>

      <FormField
        error={formik.errors.password}
        touched={formik.touched.password}
      >
        <InputPassword {...formik.getFieldProps("password")} />
      </FormField>

      <Button
        type="submit"
        disabled={formik.isSubmitting}
        className="text-white bg-gradient-to-r from-green-logo to-blue-logo disabled:from-gray-300 disabled:to-gray-400 hover:cursor-pointer hover:from-secondary-purple hover:to-purple-logo"
      >
        {formik.isSubmitting ? "Entrando..." : "Entrar"}
      </Button>
      <Link
        href="/"
        className="flex justify-center text-blue-logo p-2 px-4 py-2 border border-gray-300 rounded-md bg-gradient-to-r hover:from-secondary-purple hover:to-purple-logo hover:text-white cursor-pointer bg-transparent"
      >
        Criar nova conta
      </Link>
    </form>
  );
}
