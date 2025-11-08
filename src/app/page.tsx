"use client";
import { InputText } from "@/app/components/InputText";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "./components/Button";
import { InputPassword } from "./components/InputPassword";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [userType, setUserType] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/turmas");
  };

  return (
    <div className="items-center justify-center text-blue-logo text-sm min-h-screen p-8 pb-20 sm:p-24 max-w-xl m-auto">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 shadow-md rounded-3xl bg-white p-8"
      >
        <Image
          src="/favicon.png"
          alt="Logo"
          width={100}
          height={100}
          className="mx-auto my-[-20px]"
        />
        <h1 className="text-2xl font-bold text-blue-logo text-center">
          Crie sua conta
        </h1>
        <InputText
          type="email"
          id="email"
          placeholder="Email"
          required
          text="Email"
        />
        <InputText
          type="name"
          id="name"
          placeholder="Nome"
          required
          text="Nome"
        />

        <InputPassword />

        <div className="flex flex-col gap-2">
          <p>Tipo de usuário:</p>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="userType"
                value="teacher"
                checked={userType === "teacher"}
                onChange={(e) => setUserType(e.target.value)}
              />
              Professor
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="userType"
                value="student"
                checked={userType === "student"}
                onChange={(e) => setUserType(e.target.value)}
              />
              Aluno
            </label>
          </div>
        </div>
        {userType === "student" && (
          <InputText
            type="text"
            id="matricula"
            placeholder="Número de matrícula"
            required
            text="Número de matrícula"
          />
        )}
        <Button
          type="submit"
          className="text-white bg-gradient-to-r from-green-logo to-blue-logo disabled:from-gray-300 disabled:to-gray-400 hover:cursor-pointer hover:from-secondary-purple hover:to-purple-logo"
          disabled={!userType}
        >
          Criar conta
        </Button>
        <span className="text-xs">
          Já possui uma conta?{" "}
          <Link className="underline hover:text-purple-logo" href="/login">
            Faça login
          </Link>
        </span>
      </form>
    </div>
  );
}
