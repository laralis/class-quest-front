import { PlusCircleIcon } from "@phosphor-icons/react";

interface CreateClassButtonProps {
  onClick: () => void;
  isTeacher: boolean;
}

export function CreateClassButton({
  onClick,
  isTeacher,
}: CreateClassButtonProps) {
  return (
    <button
      onClick={onClick}
      className="border-dotted border-2 border-gray-700 rounded-lg h-[200px] sm:h-[180px] md:h-[200px] cursor-pointer w-full"
      aria-label={isTeacher ? "Criar nova turma" : "Entrar em uma turma"}
    >
      <div className="flex flex-col justify-center items-center gap-2 px-4">
        <h2 className="text-xl sm:text-2xl text-center">
          {isTeacher ? "Criar nova turma" : "Entrar em uma turma"}
        </h2>
        <PlusCircleIcon size={50} weight="fill" />
      </div>
    </button>
  );
}
