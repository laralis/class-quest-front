"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CaretLeftIcon, ClipboardTextIcon } from "@phosphor-icons/react";
import { ClassDetails, useClassStore } from "@/store/useClassStore";
import { useAuthStore } from "@/store/useAuthStore";
import { ModalMyGrades } from "../ModalMyGrades";
import { ButtonIcon } from "@/app/components/ButtonIcon";
import { Button } from "@/app/components/Button";

interface QuestionnaireGrade {
  questionnaireId: number;
  questionnaireTitle: string;
  earnedPoints: number;
  totalPoints: number;
  percentage: number;
}

interface StudentGrades {
  studentId: number;
  classId: number;
  questionnaires: QuestionnaireGrade[];
  totalEarnedPoints: number;
  totalPossiblePoints: number;
  finalGrade: number;
}

export function ClassHeader({
  classDetails,
  grades,
}: {
  classDetails: ClassDetails;
  grades: StudentGrades;
}) {
  const router = useRouter();
  const { clearCurrentClass, releaseResult } = useClassStore();
  const { user } = useAuthStore();
  const isStudent = user?.role === "student";
  const [isMyGradesModalOpen, setIsMyGradesModalOpen] = useState(false);

  const handleGoBack = () => {
    clearCurrentClass();
    router.push("/turmas");
  };

  const handleShowMyGrades = () => {
    setIsMyGradesModalOpen(true);
  };

  const handleCloseMyGradesModal = () => {
    setIsMyGradesModalOpen(false);
  };
  return (
    <>
      <div className="bg-blue-logo text-white p-4 md:p-8 rounded-t-md">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 md:gap-0">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <ButtonIcon
                onClick={handleGoBack}
                className="hover:bg-logo-bege"
                title="Voltar para turmas"
                aria-label="Voltar para turmas"
              >
                <CaretLeftIcon size={22} />
              </ButtonIcon>
              <h1 className="text-2xl md:text-3xl font-bold">
                {classDetails.name}
              </h1>
            </div>
            <p className="text-base md:text-lg pl-8 mt-1">
              {classDetails.teacher?.name}
            </p>
            <p className="pl-8 text-sm md:text-base opacity-90">
              {classDetails.description}
            </p>
          </div>
          <div className="flex flex-col gap-3 md:ml-4">
            {isStudent && releaseResult && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4 border border-white/20 self-start md:self-auto">
                <p className="text-xs md:text-sm font-medium opacity-80 mb-1">
                  Média
                </p>
                <p className="text-xl md:text-3xl font-bold">
                  {grades.finalGrade}
                </p>
              </div>
            )}
            {isStudent && (
              <Button
                onClick={handleShowMyGrades}
                className="flex gap-2 items-center justify-center !px-4 !py-2.5 text-sm md:text-base !bg-white/20 hover:!bg-white/30 !backdrop-blur-sm !border-white/30 !text-white"
                aria-label="Ver minhas notas"
              >
                <ClipboardTextIcon size={18} weight="bold" />
                Ver minhas notas
              </Button>
            )}
          </div>
        </div>
      </div>
      <ModalMyGrades
        isOpen={isMyGradesModalOpen}
        onClose={handleCloseMyGradesModal}
      />
    </>
  );
}
