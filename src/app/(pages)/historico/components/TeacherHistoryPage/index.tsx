"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useState, useEffect } from "react";
import { getAllGrades } from "../../services/historyService";
import { useClassStore } from "@/store/useClassStore";
import { TeacherHistory } from "../TeacherHistory";
import { useRouter } from "next/navigation";
import { CaretLeftIcon } from "@phosphor-icons/react";
import { StudentGradeData } from "../../utils/types";
import { ButtonIcon } from "@/app/components/ButtonIcon";

export function TeacherHistoryPage() {
  const { token } = useAuthStore();
  const [studentGrades, setStudentGrades] = useState<StudentGradeData[]>([]);
  const { currentClassDetails } = useClassStore();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!token || !currentClassDetails.id) {
      setLoading(false);
      return;
    }

    const loadTeacherHistory = async () => {
      setLoading(true);
      try {
        const data = await getAllGrades(token, currentClassDetails.id);
        setStudentGrades(data || []);
      } catch (error) {
        console.error("Erro ao carregar histórico da turma:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTeacherHistory();
  }, [currentClassDetails.id, token]);

  const handleGoBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="p-4 md:p-10 max-w-[1250px] m-auto">
        <div className="text-center py-8 text-gray-500">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 max-w-[1250px] m-auto">
      <div className="flex gap-2 items-center mb-4 md:mb-6">
        <ButtonIcon
          onClick={handleGoBack}
          className="hover:bg-logo-bege"
          title="Voltar"
          aria-label="Voltar para página anterior"
        >
          <CaretLeftIcon size={20} className="sm:w-[22px] sm:h-[22px]" />
        </ButtonIcon>
        <h1 className="text-xl md:text-2xl font-bold">
          Histórico - {currentClassDetails.name}
        </h1>
      </div>
      <TeacherHistory studentGrades={studentGrades} />
    </div>
  );
}
