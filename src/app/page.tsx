"use client";
import { InputText } from "@/app/components/InputText";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function SignIn() {
  const [userType, setUserType] = useState("");

  return (
    <div className="items-center justify-center text-purple-logo text-sm min-h-screen p-8 pb-20 sm:p-24 max-w-xl m-auto">
      <form className="flex flex-col gap-4 shadow-md rounded-3xl bg-white p-8">
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
        <label htmlFor="email" className="flex flex-col gap-2">
          Email
          <InputText type="email" id="email" placeholder="Email" required />
        </label>
        <label htmlFor="name" className="flex flex-col gap-2">
          Nome
          <InputText type="name" id="name" placeholder="Nome" required />
        </label>
        <label htmlFor="password" className="flex flex-col gap-2">
          Senha
          <InputText
            type="password"
            id="password"
            placeholder="Senha"
            required
          />
        </label>

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
          <label htmlFor="matricula" className="flex flex-col gap-2">
            Número de matrícula
            <InputText
              type="text"
              id="matricula"
              placeholder="Número de matrícula"
              required
            />
          </label>
        )}

        <button
          type="submit"
          className="text-white p-2 rounded-3xl shadow-md bg-gradient-to-r from-green-logo to-blue-logo disabled:from-gray-300 disabled:to-gray-400 hover:cursor-pointer hover:from-secondary-purple hover:to-purple-logo"
          disabled={!userType}
        >
          Criar conta
        </button>
        <span className="text-black">Já possui uma conta? <Link className="underline hover:text-purple-logo" href="/login">Faça login</Link></span>
      </form>
    </div>
  );
}
