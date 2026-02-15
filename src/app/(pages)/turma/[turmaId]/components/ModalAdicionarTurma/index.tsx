"use client";
import { Button } from "@/app/components/Button";
import { InputText } from "@/app/components/InputText";
import { XIcon } from "@phosphor-icons/react";
import { useState } from "react";
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
        // Manter modal aberto até o toast aparecer
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
          Adicionar aluno
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
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
      </div>
    </div>
  );
}
