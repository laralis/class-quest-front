"use client";
import { useState } from "react";

export default function SignIn() {
  const [userType, setUserType] = useState("");

  return (
    <div className="items-center justify-center text-sm min-h-screen p-8 pb-20 sm:p-24 max-w-xl m-auto">
      <form className="flex flex-col gap-4 shadow-md rounded-3xl bg-white p-8">
        <label htmlFor="email" className="flex flex-col gap-2">
          Email
          <input
            type="email"
            id="email"
            placeholder="Email"
            className="border py-2 px-4 rounded-3xl shadow-md"
            required
          />
        </label>
        <label htmlFor="name" className="flex flex-col gap-2">
          Nome
          <input
            type="name"
            id="name"
            placeholder="Nome"
            className="border py-2 px-4 rounded-3xl shadow-md"
            required
          />
        </label>
        <label htmlFor="password" className="flex flex-col gap-2">
          Senha
          <input
            type="password"
            id="password"
            placeholder="Senha"
            className="border py-2 px-4 rounded-3xl shadow-md"
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
        {userType === "teacher" && (
          <label htmlFor="logo" className="flex flex-col gap-2">
            Logo da instituição
            <input type="file" id="logo" className=" p-2" />
          </label>
        )}
        {userType === "student" && (
          <label htmlFor="matricula" className="flex flex-col gap-2">
            Número de matrícula
            <input
              type="text"
              id="matricula"
              placeholder="Número de matrícula"
              className="border py-2 px-4 rounded-3xl shadow-md"
              required
            />
          </label>
        )}

        <button
          type="submit"
          className="text-white p-2 rounded-3xl shadow-md bg-gradient-to-r from-pink-300 to-pink-400 disabled:from-gray-300 disabled:to-gray-400 hover:cursor-pointer hover:from-purple-300 hover:to-purple-400"
          disabled={!userType}
        >
          Criar conta
        </button>
      </form>
    </div>
  );
}
