"use client";
import ReactModal from "react-modal";
import { Button } from "@/app/components/Button";
import { InputText } from "@/app/components/InputText";
import { ButtonIcon } from "@/app/components/ButtonIcon";
import { XIcon } from "@phosphor-icons/react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useClassStore } from "@/store/useClassStore";
import { useAuthStore } from "@/store/useAuthStore";

interface ModalEntrarTurmaProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onSuccess: () => void;
}

export function ModalAdicionarTurma({
  isOpen,
  onRequestClose,
  onSuccess,
}: ModalEntrarTurmaProps) {
  const { currentClassDetails } = useClassStore();
  const [loading, setLoading] = useState(false);
  const [studentEmail, setStudentEmail] = useState("");
  const { token } = useAuthStore();

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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/class/student-mail`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            classId: currentClassDetails.id,
            studentEmail: studentEmail,
          }),
        },
      );

      if (response.ok) {
        toast.success("Aluno adicionado com sucesso!");
        setStudentEmail("");
        setTimeout(() => {
          onRequestClose();
          onSuccess();
        }, 2000);
      } else {
        const data = await response.json();
        toast.error(data.message || "Erro ao adicionar aluno na turma");
      }
    } catch (error) {
      console.error("Erro ao adicionar aluno na turma:", error);
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
        <h2 className="text-2xl font-bold text-blue-logo">Adicionar aluno</h2>
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
          id="studentEmail"
          name="studentEmail"
          placeholder="Digite o email do aluno"
          text="Email do aluno"
          value={studentEmail}
          onChange={(e) => setStudentEmail(e.target.value)}
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
            disabled={loading || !studentEmail}
            className="px-4 py-2 bg-blue-logo text-white rounded-md hover:bg-green-logo disabled:bg-gray-300"
          >
            {loading ? "Adicionando..." : "Adicionar"}
          </Button>
        </div>
      </form>
    </ReactModal>
  );
}
