"use client";

import ReactModal from "react-modal";
import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { fetchStudentQuestionnaireDetails } from "../../services/studentPerformanceService";
import { QuestionList } from "@/app/(pages)/historico/utils/types";
import { QuestionnaireDetails } from "@/app/(pages)/historico/components/QuestionnaireDetails";
import { CaretLeftIcon, X } from "@phosphor-icons/react";
import { ButtonIcon } from "@/app/components/ButtonIcon";
import { Button } from "@/app/components/Button";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";

interface ModalStudentPerformanceProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: number;
  studentName: string;
  questionnaires: Array<{
    questionnaireId: number;
    questionnaireTitle: string;
    earnedPoints: number;
    totalPoints: number;
    percentage: number;
  }>;
}

export function ModalStudentPerformance({
  isOpen,
  onClose,
  studentId,
  studentName,
  questionnaires,
}: ModalStudentPerformanceProps) {
  const { token } = useAuthStore();
  const [selectedQuestionnaireId, setSelectedQuestionnaireId] = useState<
    number | null
  >(null);
  const [questionDetails, setQuestionDetails] = useState<QuestionList | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    ReactModal.setAppElement("#app-root");
  }, []);

  const loadQuestionnaireDetails = useCallback(
    async (questionnaireId: number) => {
      if (!token) return;

      setLoading(true);
      setError(null);
      try {
        const data = await fetchStudentQuestionnaireDetails(
          token,
          questionnaireId,
          studentId,
        );
        setQuestionDetails(data);
      } catch (err) {
        console.error("Erro ao carregar detalhes:", err);
        setError("Erro ao carregar detalhes do questionário");
        setQuestionDetails(null);
      } finally {
        setLoading(false);
      }
    },
    [token, studentId],
  );

  useEffect(() => {
    if (selectedQuestionnaireId && token) {
      loadQuestionnaireDetails(selectedQuestionnaireId);
    }
  }, [selectedQuestionnaireId, token, loadQuestionnaireDetails]);

  const handleQuestionnaireClick = (questionnaireId: number) => {
    setSelectedQuestionnaireId(questionnaireId);
  };

  const handleBack = () => {
    setSelectedQuestionnaireId(null);
    setQuestionDetails(null);
  };

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
      className="relative z-[10000] w-full max-w-5xl max-h-[90vh] bg-white rounded-lg outline-none overflow-hidden flex flex-col"
    >
      <div className="flex items-center justify-between p-4 sm:p-6 border-b">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">
            Performance do aluno
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            {studentName}
          </p>
        </div>
        <ButtonIcon
          onClick={onClose}
          className="hover:bg-red-100 text-red-600"
          aria-label="Fechar modal"
          title="Fechar"
        >
          <X size={24} weight="bold" />
        </ButtonIcon>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {!selectedQuestionnaireId ? (
          <div className="space-y-3">
            {questionnaires.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Este aluno ainda não respondeu nenhum questionário.
              </div>
            ) : (
              <>
                <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-4">
                  Questionários respondidos
                </h3>
                {questionnaires.map((questionnaire) => (
                  <Button
                    key={questionnaire.questionnaireId}
                    onClick={() =>
                      handleQuestionnaireClick(questionnaire.questionnaireId)
                    }
                    className="w-full !bg-white !text-left !border !border-gray-200 hover:!shadow-md hover:!border-blue-500 !p-4"
                    aria-label={`Ver detalhes do questionário ${questionnaire.questionnaireTitle}`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="text-sm sm:text-base font-semibold text-gray-800">
                          {questionnaire.questionnaireTitle}
                        </h4>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div
                            className={`font-bold text-base sm:text-lg ${getGradeColor(questionnaire.percentage)}`}
                          >
                            {questionnaire.earnedPoints.toFixed(1)}/
                            {questionnaire.totalPoints.toFixed(1)}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500">
                            {questionnaire.percentage.toFixed(0)}%
                          </div>
                        </div>
                        <span className="text-blue-500 text-sm">
                          Ver detalhes <ArrowRightIcon size={14} />
                        </span>
                      </div>
                    </div>
                  </Button>
                ))}
              </>
            )}
          </div>
        ) : (
          <div>
            {loading ? (
              <div className="text-center py-8 text-gray-500">
                Carregando...
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600 mb-4">{error}</p>
                <Button
                  onClick={handleBack}
                  className="!bg-blue-500 hover:!bg-blue-600"
                  aria-label="Voltar para lista de questionários"
                >
                  Voltar
                </Button>
              </div>
            ) : (
              <div>
                <Button
                  onClick={handleBack}
                  className="mb-4 !bg-transparent !text-blue-500 hover:!text-blue-700 !border-0 !p-0 font-medium text-sm sm:text-base flex items-center gap-2"
                  aria-label="Voltar para lista de questionários"
                >
                  <CaretLeftIcon size={16} /> Voltar para lista de questionários
                </Button>
                {questionDetails && questionDetails.length > 0 ? (
                  (() => {
                    const hasAnswers = questionDetails.some(
                      (q) => q.userAnswers && q.userAnswers.length > 0,
                    );

                    if (!hasAnswers) {
                      return (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                          <div className="text-5xl mb-4">📝</div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            Questionário não respondido
                          </h3>
                          <p className="text-gray-600">
                            O aluno ainda não respondeu este questionário.
                          </p>
                        </div>
                      );
                    }

                    return (
                      <QuestionnaireDetails
                        details={questionDetails}
                        onBack={handleBack}
                      />
                    );
                  })()
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Nenhum detalhe encontrado.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </ReactModal>
  );
}
