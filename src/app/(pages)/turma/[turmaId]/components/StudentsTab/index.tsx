"use client";

import { Button } from "@/app/components/Button";
import { ModalAdicionarTurma } from "../ModalAdicionarTurma";
import { useState } from "react";

interface StudentsTabProps {
  students: any[];
}

export function StudentsTab({ students }: StudentsTabProps) {
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
        <div className="p-6">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold mb-4">Alunos matriculados</h2>
            <Button onClick={handleJoinClass}>Adicionar novo aluno</Button>
          </div>
          <div className="divide-y">
            {students.length === 0 ? (
              <span className="text-gray-600">
                Nenhum aluno foi matriculado
              </span>
            ) : (
              students.map((enrollment) => (
                <div key={enrollment.id} className="py-4 flex items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                    <span className="text-gray-600 font-medium">
                      {enrollment.student.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium">{enrollment.student.name}</h3>
                    <p className="text-sm text-gray-500">
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
