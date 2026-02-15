"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useState, useEffect } from "react";
import { QuestionList } from "../../utils/types";
import { fetchStudentHistory } from "../../services/historyService";
import { QuestionnaireDetails } from "../QuestionnaireDetails";
import { useHistoryStore } from "@/store/useHistoryStore";

export function StudentHistory() {
  const { token } = useAuthStore();
  const [questionDetails, setQuestionDetails] = useState<QuestionList | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const { questionnaireId } = useHistoryStore();

  useEffect(() => {
    if (!token || !questionnaireId) {
      setLoading(false);
      return;
    }

    const loadHistory = async () => {
      try {
        const data = await fetchStudentHistory(token, questionnaireId);
        setQuestionDetails(data as unknown as QuestionList);
      } catch (error) {
        console.error("Erro ao carregar histórico:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [token, questionnaireId]);

  if (loading) {
    return (
      <div className="p-4 md:p-10 max-w-[1250px] m-auto">
        <div className="text-center py-8 text-gray-500">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 max-w-[1250px] m-auto">
      <QuestionnaireDetails details={questionDetails} onBack={() => {}} />
    </div>
  );
}
