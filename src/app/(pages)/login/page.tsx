import { InputText } from "@/app/components/InputText";
import Link from "next/link";

export default function Login() {
  return (
    <div className="min-w-[320px] text-purple-logo text-sm sm:p-24 max-w-xl m-auto min-h-screen flex items-center justify-center">
      <form className="w-full flex flex-col gap-4 shadow-md rounded-3xl bg-white p-8">
        <label htmlFor="email" className="flex flex-col gap-2">
          Email
          <InputText type="email" id="email" placeholder="Email" />
        </label>
        <label htmlFor="password" className="flex flex-col gap-2">
          Senha
          <InputText type="password" id="password" placeholder="Senha" />
        </label>
        <button
          type="submit"
          className=" text-white p-2 rounded-3xl shadow-md bg-gradient-to-r from-green-logo to-blue-logo disabled:from-gray-300 disabled:to-gray-400 hover:cursor-pointer hover:from-purple-300 hover:to-purple-400"
        >
          Entrar
        </button>
        <Link
          href="/"
          className="flex justify-center text-blue-logo p-2 rounded-3xl border-1 bg-transparent hover:bg-gradient-to-r  from-green-logo to-blue-logo  hover:cursor-pointer hover:text-white hover:shadow-md"
        >
          Criar nova conta
        </Link>
      </form>
    </div>
  );
}
