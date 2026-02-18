import Link from "next/link";
import { ListIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/app/components/Button";
import { deleteClass } from "../../services/classService";
import { useClassStore } from "@/store/useClassStore";
import { useActiveQuestionnaireStore } from "@/store/useActiveQuestionnaireStore";
import { useClasses } from "@/app/(pages)/turmas/hooks/useClasses";
import { useRouter } from "next/navigation";
import { ConfirmModal } from "@/app/components/ConfirmModal";
import { useState } from "react";

export function FloatingButtons() {
  const { user, token } = useAuthStore();
  const { currentClassDetails } = useClassStore();
  const { clearActiveQuestionnaire } = useActiveQuestionnaireStore();
  const { reloadClasses } = useClasses();
  const router = useRouter();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  if (user?.role !== "teacher") {
    return null;
  }

  const handleDeleteClass = () => {
    setIsConfirmModalOpen(true);
  };

  const confirmDeleteClass = async () => {
    const success = await deleteClass(currentClassDetails.id, token);
    if (success) {
      await reloadClasses();
      router.push("/turmas");
    }
    setIsConfirmModalOpen(false);
  };

  const handleCreateQuestionnaire = () => {
    clearActiveQuestionnaire();
    router.push("/criar-questionario");
  };

  return (
    <>
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        setIsOpen={setIsConfirmModalOpen}
        title="Tem certeza que deseja excluir esta turma?"
        handleSuccess={confirmDeleteClass}
      />
      <Button
        onClick={handleDeleteClass}
        className="fixed bottom-40 sm:bottom-40 right-4 sm:right-8 bg-gradient-to-r bg-red-logo text-white !p-3 sm:!p-4 !rounded-full shadow-lg hover:from-secondary-purple hover:to-purple-logo transition-all hover:scale-110 flex items-center gap-1 sm:gap-2 text-xs sm:text-base"
      >
        <TrashIcon size={20} weight="bold" className="sm:w-6 sm:h-6" />
        <span className="hidden sm:inline">Excluir turma</span>
      </Button>
      <button
        onClick={handleCreateQuestionnaire}
        className="fixed bottom-8 right-4 sm:right-8 bg-gradient-to-r from-green-logo to-blue-logo text-white p-3 sm:p-4 rounded-full shadow-lg hover:from-secondary-purple hover:to-purple-logo transition-all hover:scale-110 flex items-center gap-1 sm:gap-2 cursor-pointer"
        title="Criar novo questionário"
        aria-label="Criar novo questionário para esta turma"
      >
        <PlusIcon size={20} weight="bold" className="sm:w-6 sm:h-6" />
        <span className="pr-1 sm:pr-2 text-xs sm:text-base hidden sm:inline">
          Novo Questionário
        </span>
      </button>
      <Link
        href="/historico"
        className="fixed bottom-24 right-4 sm:right-8 bg-gradient-to-r from-green-logo to-blue-logo text-white p-3 sm:p-4 rounded-full shadow-lg hover:from-secondary-purple hover:to-purple-logo transition-all hover:scale-110 flex items-center gap-1 sm:gap-2"
        title="Ver histórico"
        aria-label="Ver histórico de questionários"
      >
        <ListIcon size={20} weight="bold" className="sm:w-6 sm:h-6" />
        <span className="pr-1 sm:pr-2 text-xs sm:text-base hidden sm:inline">
          Ver histórico
        </span>
      </Link>
    </>
  );
}
