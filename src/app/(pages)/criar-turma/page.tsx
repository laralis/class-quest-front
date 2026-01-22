"use client";
import { InputText } from "@/app/components/InputText";
import { InputImage } from "@/app/components/InputImage";
import { CheckIcon } from "@phosphor-icons/react";
import Image from "next/image";
import { SectionAddStudents } from "./components/SectionAddStudents";
import { Button } from "@/app/components/Button";
import { ToastContainer, toast } from "react-toastify";
import { useState } from "react";
import { InputTextArea } from "@/app/components/InputTextArea";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

export default function CriarTurma() {
  const [classImage, setClassImage] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [units, setUnits] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useAuthStore();
  const router = useRouter();

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

  const notifyError = (message: string) => {
    toast.error(message, {
      position: "bottom-right",
      autoClose: 5000,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("units", units);
      if (classImage) {
        formData.append("image", classImage);
      }

      const response = await fetch("http://localhost:3300/class", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        notifySuccess();
        setTimeout(() => {
          router.push("/turmas");
        }, 1500);
      } else {
        const error = await response.json();
        notifyError(error.message || "Erro ao criar turma");
      }
    } catch (error) {
      console.error("Erro ao criar turma:", error);
      notifyError("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
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
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <InputTextArea
            type="text"
            id="description"
            placeholder="Descrição da turma"
            text="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <InputText
            type="number"
            id="units"
            placeholder="Unidades"
            text="Numero de unidades"
            value={units}
            onChange={(e) => setUnits(e.target.value)}
            required
          />
          <InputImage
            id="classImage"
            text="Imagem da turma"
            onChange={setClassImage}
          />

          <SectionAddStudents />
          <Button
            type="submit"
            disabled={loading}
            className="text-white bg-gradient-to-r from-green-logo to-blue-logo disabled:from-gray-300 disabled:to-gray-400 hover:cursor-pointer hover:from-secondary-purple hover:to-purple-logo"
          >
            {loading ? "Criando..." : "Criar turma"}
          </Button>
        </form>
      </div>
      <ToastContainer closeButton theme="colored" position="bottom-right" />
    </>
  );
}
