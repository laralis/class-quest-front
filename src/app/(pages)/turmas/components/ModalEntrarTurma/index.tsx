"use client";
import { Button } from "@/app/components/Button";
import { InputText } from "@/app/components/InputText";
import { XIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { toast } from "react-toastify";

interface ModalEntrarTurmaProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onSuccess: () => void;
}

export function ModalEntrarTurma({
  isOpen,
  onRequestClose,
  onSuccess,
}: ModalEntrarTurmaProps) {
  const [accessCode, setAccessCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/class/code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ accessCode }),
        },
      );

      if (response.ok) {
        toast.success("Entrou na turma com sucesso!");
        setAccessCode("");
        onRequestClose();
        onSuccess();
      } else {
        const data = await response.json();
        toast.error(data.message || "Erro ao entrar na turma");
      }
    } catch (error) {
      console.error("Erro ao entrar na turma:", error);
      toast.error("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onRequestClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <XIcon size={24} />
        </button>

        <h2 className="text-2xl font-bold text-blue-logo mb-4">
          Entrar em uma turma
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputText
            id="accessCode"
            name="accessCode"
            placeholder="Digite o código da turma"
            text="Código da turma"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            required
          />

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onRequestClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              Cancelar
            </button>
            <Button
              type="submit"
              disabled={loading || !accessCode}
              className="px-4 py-2 bg-blue-logo text-white rounded-md hover:bg-green-logo disabled:bg-gray-300"
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
