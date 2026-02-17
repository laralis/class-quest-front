"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CheckCircleIcon, InfoIcon } from "@phosphor-icons/react";
import { QuestionnaireResult, UserAnswer } from "../../utils/types";
import { Button } from "@/app/components/Button";
import { useRouter } from "next/navigation";
import { useHistoryStore } from "@/store/useHistoryStore";

export function HistoryTab() {
  const { user, token } = useAuthStore();
  const [results, setResults] = useState<QuestionnaireResult[]>([]);
  const [loading, setLoading] = useState(true);
  const { setQuestionnaireId } = useHistoryStore();

  const router = useRouter();

  useEffect(() => {
    const fetchUserAnswers = async () => {
      if (!user?.id || !token) return;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user-answer/student/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          toast.error("Erro ao carregar histórico");
          setLoading(false);
          return;
        }

        const data: UserAnswer[] = await response.json();

        const groupedByQuestionnaire = data.reduce(
          (acc, answer) => {
            const qId = answer.question.questionnaireId;
            if (!acc[qId]) {
              acc[qId] = {
                questionnaireId: qId,
                title: answer.question.questionnaire.title,
                description: answer.question.questionnaire.description,
                createdAt: answer.question.questionnaire.createdAt,
                answers: [],
              };
            }
            acc[qId].answers.push(answer);
            return acc;
          },
          {} as Record<number, any>,
        );

        const resultsArray: QuestionnaireResult[] = Object.values(
          groupedByQuestionnaire,
        ).map((group: any) => {
          const correctAnswers = group.answers.filter(
            (a: UserAnswer) => a.alternative.correct,
          ).length;
          const totalQuestions = group.answers.length;
          const percentage = Math.round(
            (correctAnswers / totalQuestions) * 100,
          );

          const responseDate = group.answers.reduce(
            (latest: string, answer: UserAnswer) => {
              return answer.createdAt > latest ? answer.createdAt : latest;
            },
            group.answers[0].createdAt,
          );

          return {
            questionnaireId: group.questionnaireId,
            title: group.title,
            description: group.description,
            createdAt: group.createdAt,
            responseDate,
            totalQuestions,
            correctAnswers,
            percentage,
          };
        });

        resultsArray.sort(
          (a, b) =>
            new Date(b.responseDate).getTime() -
            new Date(a.responseDate).getTime(),
        );

        setResults(resultsArray);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar histórico:", error);
        toast.error("Erro ao conectar com o servidor");
        setLoading(false);
      }
    };

    fetchUserAnswers();
  }, [user?.id, token]);

  if (loading) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500 text-lg">Carregando histórico...</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500 text-lg">
          Você ainda não respondeu nenhum questionário
        </p>
      </div>
    );
  }
  const handleNavHistoric = (id) => {
    setQuestionnaireId(id);
    router.push("/historico");
  };

  return (
    <div className="space-y-4">
      {results.map((result) => (
        <div
          key={result.questionnaireId}
          className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2 w-full">
                <div className="flex items-start gap-3 flex-col w-full">
                  <div className="flex flex-col sm:flex-row sm:justify-between w-full gap-2 sm:gap-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <h3 className="text-lg sm:text-xl font-semibold text-blue-logo">
                        {result.title}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium self-start ${
                          result.percentage >= 70
                            ? "bg-green-100 text-green-700"
                            : result.percentage >= 50
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {result.percentage}%
                      </span>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Criado em
                      </p>
                      <p className="text-xs sm:text-sm text-gray-700 mt-1">
                        {new Date(result.createdAt).toLocaleDateString(
                          "pt-BR",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          },
                        )}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Questões corretas
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <CheckCircleIcon
                        size={18}
                        className="text-green-600 sm:w-5 sm:h-5"
                      />
                      <span className="text-base sm:text-lg font-semibold text-gray-800">
                        {result.correctAnswers} / {result.totalQuestions}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Respondido em
                  </p>
                  <p className="text-xs sm:text-sm text-gray-700 mt-1">
                    {new Date(result.responseDate).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <Button
                  className="flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center"
                  onClick={() => handleNavHistoric(result.questionnaireId)}
                >
                  <InfoIcon size={18} className="sm:w-5 sm:h-5" />
                  Ver detalhes
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
