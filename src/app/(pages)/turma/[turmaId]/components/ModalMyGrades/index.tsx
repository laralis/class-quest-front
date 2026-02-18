"use client";

import ReactModal from "react-modal";
import { useEffect, useState, useCallback } from "react";
import { ChartBarIcon, XIcon } from "@phosphor-icons/react";
import { useAuthStore } from "@/store/useAuthStore";
import { useClassStore } from "@/store/useClassStore";
import { fetchStudentGrades } from "../../services/studentPerformanceService";
import { StudentGradeData } from "@/app/(pages)/historico/utils/types";
import { ButtonIcon } from "@/app/components/ButtonIcon";
import { Button } from "@/app/components/Button";

interface ModalMyGradesProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ModalMyGrades({ isOpen, onClose }: ModalMyGradesProps) {
  const { token, user } = useAuthStore();
  const { currentClassDetails } = useClassStore();
  const [grades, setGrades] = useState<StudentGradeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    ReactModal.setAppElement("#app-root");
  }, []);

  const loadMyGrades = useCallback(async () => {
    if (!token || !currentClassDetails.id || !user?.id) return;

    setLoading(true);
    setError(null);
    try {
      const data = await fetchStudentGrades(
        token,
        currentClassDetails.id,
        user.id,
      );
      setGrades(data);
    } catch (err) {
      console.error("Erro ao carregar suas notas:", err);
      setError("Erro ao carregar suas notas");
      setGrades(null);
    } finally {
      setLoading(false);
    }
  }, [token, currentClassDetails.id, user?.id]);

  useEffect(() => {
    if (isOpen) {
      loadMyGrades();
    }
  }, [isOpen, loadMyGrades]);

  const getGradeColor = (percentage: number) => {
    if (percentage >= 70) return "text-green-600";
    if (percentage >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      shouldCloseOnEsc
      overlayClassName="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4"
      className="relative z-[10000] w-full max-w-3xl max-h-[90vh] bg-white rounded-lg outline-none overflow-hidden flex flex-col"
    >
      <div className="flex items-center justify-between p-4 sm:p-6 border-b">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">
            Minhas notas
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            {currentClassDetails.name}
          </p>
        </div>
        <ButtonIcon
          onClick={onClose}
          className="hover:bg-red-100 text-red-600"
          aria-label="Fechar modal"
          title="Fechar"
        >
          <XIcon size={20} weight="bold" className="sm:w-6 sm:h-6" />
        </ButtonIcon>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Carregando...</div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600 mb-4 text-sm sm:text-base">{error}</p>
            <Button
              onClick={loadMyGrades}
              className="!px-4 !py-2 !bg-blue-500 hover:!bg-blue-600 text-sm sm:text-base"
              aria-label="Tentar novamente"
            >
              Tentar novamente
            </Button>
          </div>
        ) : grades ? (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 sm:p-6 border border-blue-200">
              <div className="flex items-center gap-3 mb-3">
                <ChartBarIcon
                  size={32}
                  weight="bold"
                  className="text-blue-600"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Nota final
                  </h3>
                  <p className="text-sm text-gray-600">
                    Média ponderada de todos os questionários
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center">
                <div>
                  <div
                    className={`text-4xl font-bold ${getGradeColor((grades.finalGrade / 10) * 100)}`}
                  >
                    {grades.finalGrade.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">de 10.0</div>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-600 mb-1">
                    Pontuação total
                  </div>
                  <div className="text-xl font-semibold text-gray-800">
                    {grades.totalEarnedPoints} / {grades.totalPossiblePoints}{" "}
                    pts
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3">
                Desempenho por questionário
              </h3>
              {grades.questionnaires.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Você ainda não respondeu nenhum questionário nesta turma.
                </div>
              ) : (
                <div className="space-y-3">
                  {grades.questionnaires.map((questionnaire) => (
                    <div
                      key={questionnaire.questionnaireId}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                            {questionnaire.questionnaireTitle}
                          </h4>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div
                              className={`font-bold text-lg ${getGradeColor(questionnaire.percentage)}`}
                            >
                              {questionnaire.earnedPoints.toFixed(1)} /{" "}
                              {questionnaire.totalPoints.toFixed(1)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {questionnaire.percentage.toFixed(0)}% de acertos
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Nenhuma nota disponível.
          </div>
        )}
      </div>
    </ReactModal>
  );
}
