"use client";
import { InputText } from "@/app/components/InputText";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/app/components/Button";
import { InputPassword } from "@/app/components/InputPassword";

export default function Login() {
  return (
    <div className="min-w-[320px] text-blue-logo text-sm sm:p-24 max-w-xl m-auto min-h-screen flex items-center justify-center">
      <form className="w-full flex flex-col gap-4 shadow-md rounded-3xl bg-white p-8">
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
        <InputText type="email" id="email" placeholder="Email" text="Email" />

        <InputPassword />
        <Button
          type="submit"
          className="text-white bg-gradient-to-r from-green-logo to-blue-logo disabled:from-gray-300 disabled:to-gray-400 hover:cursor-pointer hover:from-secondary-purple hover:to-purple-logo"
        >
          Entrar
        </Button>
        <Link
          href="/"
          className="flex justify-center text-blue-logo p-2 px-4 py-2 border border-gray-300 rounded-md bg-gradient-to-r hover:from-secondary-purple hover:to-purple-logo hover:text-white cursor-pointer bg-transparent"
        >
          Criar nova conta
        </Link>
      </form>
    </div>
  );
}
