"use client";
import ReactModal from "react-modal";
import { Button } from "@/app/components/Button";
import { InputText } from "@/app/components/InputText";
import { ButtonIcon } from "@/app/components/ButtonIcon";
import { XIcon } from "@phosphor-icons/react";
import { useState, useEffect } from "react";
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

  useEffect(() => {
    ReactModal.setAppElement("#app-root");
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

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

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      shouldCloseOnEsc
      overlayClassName="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4"
      className="relative z-[10000] w-full max-w-md max-h-[90vh] bg-white rounded-lg outline-none overflow-y-auto"
    >
      <div className="flex items-center justify-between p-6 pb-4">
        <h2 className="text-2xl font-bold text-blue-logo">
          Entrar em uma turma
        </h2>
        <ButtonIcon
          onClick={onRequestClose}
          className="hover:bg-gray-200"
          aria-label="Fechar modal"
        >
          <XIcon size={24} />
        </ButtonIcon>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 px-6 pb-6">
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
    </ReactModal>
  );
}
