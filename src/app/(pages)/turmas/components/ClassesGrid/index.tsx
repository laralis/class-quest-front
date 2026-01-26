import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Class } from "../../utils/types";
import { CreateClassButton } from "../CreateClassButton";
import { ClassCard } from "../ClassCard";
import { ModalEntrarTurma } from "../ModalEntrarTurma";

interface ClassesGridProps {
  classes: Class[];
  onModalSuccess: () => void;
}

export function ClassesGrid({ classes, onModalSuccess }: ClassesGridProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateClass = () => {
    router.push("/criar-turma");
  };

  const handleJoinClass = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSuccess = () => {
    handleModalClose();
    onModalSuccess();
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-10 text-sm m-auto">
        <CreateClassButton
          onClick={
            user?.role === "teacher" ? handleCreateClass : handleJoinClass
          }
          isTeacher={user?.role === "teacher"}
        />
        {classes.map((classData) => (
          <ClassCard key={classData.id} classData={classData} />
        ))}
      </div>
      <ModalEntrarTurma
        isOpen={isModalOpen}
        onRequestClose={handleModalClose}
        onSuccess={handleSuccess}
      />
    </>
  );
}
