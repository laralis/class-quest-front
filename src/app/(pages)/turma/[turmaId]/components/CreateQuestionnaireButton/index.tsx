import Link from "next/link";
import { PlusIcon } from "@phosphor-icons/react";
import { useAuthStore } from "@/store/useAuthStore";

export function CreateQuestionnaireButton() {
  const { user } = useAuthStore();

  if (user?.role !== "teacher") {
    return null;
  }

  return (
    <Link
      href="/criar-questionario"
      className="fixed bottom-8 right-8 bg-gradient-to-r from-green-logo to-blue-logo text-white p-4 rounded-full shadow-lg hover:from-secondary-purple hover:to-purple-logo transition-all hover:scale-110 flex items-center gap-2"
      title="Criar novo questionário"
    >
      <PlusIcon size={24} weight="bold" />
      <span className="pr-2">Novo Questionário</span>
    </Link>
  );
}
