import Link from "next/link";
import { ListIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/app/components/Button";
import { deleteClass } from "../../services/classService";
import { useClassStore } from "@/store/useClassStore";
import { useClasses } from "@/app/(pages)/turmas/hooks/useClasses";
import { useRouter } from "next/navigation";

export function FloatingButtons() {
  const { user, token } = useAuthStore();
  const { currentClassDetails } = useClassStore();
  const { reloadClasses } = useClasses();
  const router = useRouter();

  if (user?.role !== "teacher") {
    return null;
  }

  const handleDeleteClass = async () => {
    if (!confirm("Tem certeza que deseja excluir esta classe?")) {
      return;
    }
    const success = await deleteClass(currentClassDetails.id, token);
    if (success) {
      await reloadClasses();
      router.push("/turmas");
    }
  };

  return (
    <>
      <Button
        onClick={handleDeleteClass}
        className="fixed bottom-40 right-8 bg-gradient-to-r bg-red-logo  text-white !p-4 !rounded-full shadow-lg hover:from-secondary-purple hover:to-purple-logo transition-all hover:scale-110 flex items-center gap-2"
      >
        <TrashIcon size={24} weight="bold" />
        Excluir turma
      </Button>
      <Link
        href="/criar-questionario"
        className="fixed bottom-8 right-8 bg-gradient-to-r from-green-logo to-blue-logo text-white p-4 rounded-full shadow-lg hover:from-secondary-purple hover:to-purple-logo transition-all hover:scale-110 flex items-center gap-2"
        title="Criar novo questionário"
      >
        <PlusIcon size={24} weight="bold" />
        <span className="pr-2">Novo Questionário</span>
      </Link>
      <Link
        href="/historico"
        className="fixed bottom-24 right-8 bg-gradient-to-r from-green-logo to-blue-logo text-white p-4 rounded-full shadow-lg hover:from-secondary-purple hover:to-purple-logo transition-all hover:scale-110 flex items-center gap-2"
        title="Ver histórico"
      >
        <ListIcon size={24} weight="bold" />
        <span className="pr-2">Ver histórico</span>
      </Link>
    </>
  );
}
