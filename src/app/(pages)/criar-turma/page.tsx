"use client";
import { CopySimpleIcon } from "@phosphor-icons/react";

export default function CriarTurma() {
  return (
    <div className="items-center justify-center text-sm min-h-screen p-8 pb-20 sm:p-24 max-w-xl m-auto">
      <form className="flex flex-col gap-4 shadow-md rounded-3xl bg-white p-8">
        <h1 className="text-center font-bold text-2xl">Criar nova turma</h1>
        <div className="flex flex-col gap-2">
          <label htmlFor="name">Nome</label>
          <input
            type="text"
            id="name"
            placeholder="Nome"
            className="border py-2 px-4 rounded-3xl shadow-md"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="units">Unidades</label>
          <input
            type="number"
            id="units"
            placeholder="Unidades"
            className="border py-2 px-4 rounded-3xl shadow-md"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="units">Adicionar mais alunos</label>
          <input
            type="number"
            id="units"
            placeholder="1"
            className="border py-2 px-4 rounded-3xl shadow-md"
          />
        </div>
        <div className="flex gap-2">
          <label htmlFor="code">Código:</label>
          <span id="code">HGX473</span>
          <button
            className="p-1 cursor-pointer m-[-1px]"
            aria-label="Copiar código"
            title="Copiar código"
          >
            <CopySimpleIcon size={18} />
          </button>
        </div>
        <button
          type="submit"
          className=" text-white p-2 rounded-3xl shadow-md bg-gradient-to-r from-pink-300 to-pink-400 disabled:from-gray-300 disabled:to-gray-400 hover:cursor-pointer hover:from-purple-300 hover:to-purple-400"
        >
          Criar
        </button>
      </form>
    </div>
  );
}
