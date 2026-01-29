"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useState, useEffect } from "react";
import { QuestionnaireHistory } from "./utils/types";
import {
  fetchStudentHistory,
  getQuestionnaireGrades,
} from "./services/historyService";
import { QuestionnaireDetails } from "./components/QuestionnaireDetails";
import { useClassStore } from "@/store/useClassStore";
import { TeacherHistory } from "./components/TeacherHistory";
import { useHistoryStore } from "@/store/useHistoryStore";
import { useRouter } from "next/navigation";
import { CaretLeftIcon } from "@phosphor-icons/react";

export default function HistoryPage() {
  const { user, token } = useAuthStore();
  const [questionnaires, setQuestionnaires] = useState<QuestionnaireHistory[]>(
    [],
  );
  const [formGrades, setFormGrades] = useState<any>([]);
  const { currentClassDetails } = useClassStore();

  const [loading, setLoading] = useState(true);

  const { questionnaireId } = useHistoryStore();

  const isTeacher = user?.role === "teacher";
  const router = useRouter();

  console.log(currentClassDetails.id);

  useEffect(() => {
    if (!token || isTeacher) {
      setLoading(false);
      return;
    }

    const loadHistory = async () => {
      try {
        const data = await fetchStudentHistory(token, questionnaireId);
        setQuestionnaires(data);
      } catch (error) {
        console.error("Erro ao carregar histórico:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [token, isTeacher, questionnaireId]);

  useEffect(() => {
    if (!token || !isTeacher || !currentClassDetails.id) {
      setLoading(false);
      return;
    }

    const loadTeacherHistory = async () => {
      setLoading(true);
      try {
        const data = await getQuestionnaireGrades(
          token,
          currentClassDetails.id,
        );
        console.log("DATA", data);
        setFormGrades(data.questionnaires || []);
      } catch (error) {
        console.error("Erro ao carregar histórico da turma:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTeacherHistory();
  }, [currentClassDetails.id, isTeacher, token]);

  if (isTeacher) {
    console.log(formGrades);

    if (loading) {
      return (
        <div className="p-10 max-w-[1250px] m-auto">
          <div className="text-center py-8 text-gray-500">Carregando...</div>
        </div>
      );
    }
    const handleGoBack = () => {
      router.back();
    };

    return (
      <div className="p-10 max-w-[1250px] m-auto">
        <div className="flex gap-2 items-center mb-6">
          <button
            onClick={handleGoBack}
            className="hover:bg-logo-bege rounded-md cursor-pointer"
          >
            <CaretLeftIcon size={22} />
          </button>
          <h1 className="text-2xl font-bold">
            Histórico - {currentClassDetails.name}
          </h1>
        </div>
        <TeacherHistory questionnaires={formGrades} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-10 max-w-[1250px] m-auto">
        <div className="text-center py-8 text-gray-500">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="p-10 max-w-[1250px] m-auto">
      <QuestionnaireDetails details={questionnaires} />
    </div>
  );
}
