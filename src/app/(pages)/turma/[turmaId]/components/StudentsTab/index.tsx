"use client";

import { Button } from "@/app/components/Button";
import { ModalAdicionarTurma } from "../ModalAdicionarTurma";
import { ModalStudentPerformance } from "../ModalStudentPerformance";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useClassStore } from "@/store/useClassStore";
import { PlusIcon, ChartBarIcon } from "@phosphor-icons/react";
import { fetchStudentGrades } from "../../services/studentPerformanceService";
import { StudentGradeData } from "@/app/(pages)/historico/utils/types";

interface StudentsTabProps {
  students: any[];
}

export function StudentsTab({ students }: StudentsTabProps) {
  const { user, token } = useAuthStore();
  const { currentClassDetails } = useClassStore();
  const isTeacher = user?.role === "teacher";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPerformanceModalOpen, setIsPerformanceModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<{
    id: number;
    name: string;
    grades: StudentGradeData | null;
  } | null>(null);
  const [loadingStudentId, setLoadingStudentId] = useState<number | null>(null);

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

  const handleShowPerformance = async (
    studentId: number,
    studentName: string,
  ) => {
    if (!token || !currentClassDetails.id) return;

    setLoadingStudentId(studentId);
    try {
      const grades = await fetchStudentGrades(
        token,
        currentClassDetails.id,
        studentId,
      );
      setSelectedStudent({ id: studentId, name: studentName, grades });
      setIsPerformanceModalOpen(true);
    } catch (error) {
      console.error("Erro ao carregar performance:", error);
    } finally {
      setLoadingStudentId(null);
    }
  };

  const handleClosePerformanceModal = () => {
    setIsPerformanceModalOpen(false);
    setSelectedStudent(null);
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
          <div className="divide-y mt-4">
            {students.length === 0 ? (
              <span className="text-sm sm:text-base text-gray-600">
                Nenhum aluno foi matriculado
              </span>
            ) : (
              students.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="py-3 sm:py-4 flex items-center justify-between"
                >
                  <div className="flex items-center flex-1">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                      <span className="text-sm sm:text-base text-gray-600 font-medium">
                        {enrollment.student.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
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
                  {isTeacher && (
                    <button
                      onClick={() =>
                        handleShowPerformance(
                          enrollment.student.id,
                          enrollment.student.name,
                        )
                      }
                      disabled={loadingStudentId === enrollment.student.id}
                      className="ml-3 flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ChartBarIcon size={16} weight="bold" />
                      <span className="hidden sm:inline">
                        {loadingStudentId === enrollment.student.id
                          ? "Carregando..."
                          : "Performance"}
                      </span>
                    </button>
                  )}
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
      {isPerformanceModalOpen && selectedStudent && (
        <ModalStudentPerformance
          isOpen={isPerformanceModalOpen}
          onClose={handleClosePerformanceModal}
          studentId={selectedStudent.id}
          studentName={selectedStudent.name}
          questionnaires={selectedStudent.grades?.questionnaires || []}
        />
      )}
    </>
  );
}
