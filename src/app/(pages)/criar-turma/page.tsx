"use client";
import { InputText } from "@/app/components/InputText";
import { CopySimpleIcon, CheckIcon } from "@phosphor-icons/react";
import Image from "next/image";
import { SectionAddStudents } from "./components/SectionAddStudents";
import { Button } from "@/app/components/Button";
import { ToastContainer, toast } from "react-toastify";

export default function CriarTurma() {
  const notifySuccess = () => {
    toast(
      () => (
        <span className="text-green-logo font-light">
          Turma criada com sucesso!
        </span>
      ),
      {
        position: "bottom-right",
        autoClose: 5000,
        className: "bg-white",
        icon: <CheckIcon size={22} weight="bold" className="text-green-logo" />,
      }
    );
  };
  const notifyCopy = () => {
    toast(
      () => (
        <span className="text-white font-light">
          Código copiado com sucesso!
        </span>
      ),
      {
        closeButton: true,
        style: { backgroundColor: "#7bb2d9" },
        position: "bottom-right",
        autoClose: 5000,
        icon: (
          <CopySimpleIcon
            weight="fill"
            size={22}
            className="text-white"
          />
        ),
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    notifySuccess();
  };

  const handleCopyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    notifyCopy();
    navigator.clipboard.writeText("HGX473");
  };

  return (
    <>
      <div className="items-center justify-center text-blue-logo text-sm p-8 pb-20 sm:p-24 max-w-xl m-auto">
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
          <h1 className="text-center font-bold text-2xl">Criar nova turma</h1>
          <InputText
            type="text"
            id="name"
            placeholder="Nome da turma"
            text="Nome"
          />
          <InputText
            type="number"
            id="units"
            placeholder="Unidades"
            text="Numero de unidades"
          />

          <div className="flex gap-2">
            <label htmlFor="code">Código:</label>
            <span id="code">HGX473</span>
            <button
              type="button"
              className="p-1 cursor-pointer m-[-1px]"
              aria-label="Copiar código"
              title="Copiar código"
              onClick={handleCopyClick}
            >
              <CopySimpleIcon size={18} />
            </button>
          </div>
          <SectionAddStudents />
          <Button
            type="submit"
            className="text-white bg-gradient-to-r from-green-logo to-blue-logo disabled:from-gray-300 disabled:to-gray-400 hover:cursor-pointer hover:from-secondary-purple hover:to-purple-logo"
          >
            Criar turma
          </Button>
        </form>
      </div>
      <ToastContainer closeButton theme="colored" position="bottom-right" />
    </>
  );
}
