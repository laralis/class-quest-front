"use client";

import { Button } from "@/app/components/Button";
import { ModalAdicionarTurma } from "../ModalAdicionarTurma";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { PlusIcon } from "@phosphor-icons/react";

interface StudentsTabProps {
  students: any[];
}

export function StudentsTab({ students }: StudentsTabProps) {
  const { user } = useAuthStore();
  const isTeacher = user?.role === "teacher";
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const onModalSuccess = () => {
    window.location.reload();
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
            <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">
              Alunos matriculados
            </h2>
            {isTeacher && (
              <Button
                onClick={handleJoinClass}
                className="flex gap-2 items-center text-sm sm:text-base"
              >
                <PlusIcon
                  size={14}
                  className="sm:w-[16px] sm:h-[16px]"
                  color="white"
                />
                Adicionar novo aluno
              </Button>
            )}
          </div>
          <div className="divide-y">
            {students.length === 0 ? (
              <span className="text-sm sm:text-base text-gray-600">
                Nenhum aluno foi matriculado
              </span>
            ) : (
              students.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="py-3 sm:py-4 flex items-center"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                    <span className="text-sm sm:text-base text-gray-600 font-medium">
                      {enrollment.student.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-medium">
                      {enrollment.student.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {enrollment.student.email}
                    </p>
                    {enrollment.student.registration && (
                      <p className="text-xs text-gray-400">
                        Matrícula: {enrollment.student.registration}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <ModalAdicionarTurma
        isOpen={isModalOpen}
        onRequestClose={handleModalClose}
        onSuccess={handleSuccess}
      />
    </>
  );
}
