"use client";

import { PencilSimpleIcon, TrashIcon } from "@phosphor-icons/react";
import { ButtonIcon } from "@/app/components/ButtonIcon";
import { useActiveQuestionnaireStore } from "@/store/useActiveQuestionnaireStore";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "react-toastify";
import { Alternative, Question, Questionnaire } from "../../utils/types";
import { ConfirmModal } from "@/app/components/ConfirmModal";
import { useState } from "react";

interface FeedTabProps {
  questionnaires: Questionnaire[];
}

export function FeedTab({ questionnaires }: FeedTabProps) {
  const { setActiveQuestionnaire, clearActiveQuestionnaire, triggerRefresh } =
    useActiveQuestionnaireStore();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [questionnaireToDelete, setQuestionnaireToDelete] = useState<
    number | null
  >(null);
  const { user, token } = useAuthStore();
  const router = useRouter();

  const isTeacher = user?.role === "teacher";

  const filteredQuestionnaires = isTeacher
    ? questionnaires
    : questionnaires.filter((q) => q.ready);

  const handleEdit = async (questionnaire: Questionnaire) => {
    try {
      toast.info("Carregando questionário...");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/questionnaire/${questionnaire.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        toast.error("Erro ao carregar questionário");
        return;
      }

      const data = await response.json();

      interface QuestionWithAlternatives extends Question {
        alternatives: Alternative[];
      }

      const questionsWithAlternatives: QuestionWithAlternatives[] =
        await Promise.all(
          (data.questions || []).map(async (question: Question) => {
            try {
              const questionResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/question/${question.id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                },
              );

              if (questionResponse.ok) {
                const questionData = await questionResponse.json();

                return {
                  id: questionData.id,
                  statement: questionData.statement,
                  value: questionData.value,
                  available: questionData.available,
                  time: questionData.time,
                  order: questionData.order,
                  questionnaireId: questionData.questionnaireId,
                  alternatives: questionData.alternative || [],
                };
              }
              return {
                ...question,
                alternatives: [],
              };
            } catch (error) {
              console.error(`Erro ao buscar questão ${question.id}:`, error);
              return {
                ...question,
                alternatives: [],
              };
            }
          }),
        );

      const questionnaireData = {
        id: data.id,
        title: data.title,
        description: data.description,
        ready: data.ready,
        classId: data.classId,
        questions: questionsWithAlternatives.sort((a, b) => a.order - b.order),
      };

      setActiveQuestionnaire(questionnaireData);
      router.push("/criar-questionario");
    } catch (error) {
      console.error("Erro ao buscar questionário:", error);
      toast.error("Erro ao conectar com o servidor");
    }
  };

  const handleDelete = (qid: number) => {
    setQuestionnaireToDelete(qid);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    if (questionnaireToDelete === null) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/questionnaire/${questionnaireToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        toast.success("Questionário excluído com sucesso");
        clearActiveQuestionnaire();
        triggerRefresh();
      } else {
        toast.error("Erro ao excluir questionário");
      }
    } catch (error) {
      console.error("Erro ao excluir questionário:", error);
      toast.error("Erro ao conectar com o servidor");
    } finally {
      setIsConfirmModalOpen(false);
      setQuestionnaireToDelete(null);
    }
  };

  const handleAnswer = async (questionnaireId: number) => {
    try {
      toast.info("Carregando questionário...");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/questionnaire/${questionnaireId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        toast.error("Erro ao carregar questionário");
        return;
      }

      const data = await response.json();

      if (!data.questions || data.questions.length === 0) {
        toast.error("Este questionário não possui questões");
        return;
      }

      interface QuestionWithAlternatives extends Question {
        alternatives: Alternative[];
      }

      const questionsWithAlternatives: QuestionWithAlternatives[] =
        await Promise.all(
          data.questions.map(async (question: Question) => {
            try {
              const questionResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/question/${question.id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                },
              );

              if (questionResponse.ok) {
                const questionData = await questionResponse.json();

                return {
                  id: questionData.id,
                  statement: questionData.statement,
                  value: questionData.value,
                  available: questionData.available,
                  time: questionData.time,
                  order: questionData.order,
                  questionnaireId: questionData.questionnaireId,
                  alternatives: questionData.alternative || [],
                };
              }
              return {
                ...question,
                alternatives: [],
              };
            } catch (error) {
              console.error(`Erro ao buscar questão ${question.id}:`, error);
              return {
                ...question,
                alternatives: [],
              };
            }
          }),
        );

      const questionnaireData = {
        id: data.id,
        title: data.title,
        description: data.description,
        ready: data.ready,
        classId: data.classId,
        questions: questionsWithAlternatives.sort((a, b) => a.order - b.order),
      };

      setActiveQuestionnaire(questionnaireData);

      sessionStorage.setItem(
        "currentQuestionnaire",
        JSON.stringify(questionnaireData),
      );

      router.push("/questionario");
    } catch (error) {
      console.error("Erro ao buscar questionário:", error);
      toast.error("Erro ao conectar com o servidor");
    }
  };

  if (filteredQuestionnaires.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500 text-lg">
          {isTeacher
            ? "Nenhum questionário criado ainda"
            : "Nenhum questionário disponível no momento"}
        </p>
        {isTeacher && (
          <p className="text-gray-400 text-sm mt-2">
            Clique no botão + para criar um novo questionário
          </p>
        )}
      </div>
    );
  }

  return (
    <>
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        setIsOpen={setIsConfirmModalOpen}
        title={"Tem certeza que deseja excluir este questionário?"}
        handleSuccess={confirmDelete}
      />
      <div className="space-y-4">
        {filteredQuestionnaires.map((questionnaire) => (
          <div
            key={questionnaire.id}
            className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
              <div className="flex-1 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                  <h3 className="text-lg sm:text-xl font-semibold text-blue-logo">
                    {questionnaire.title}
                  </h3>
                  {isTeacher && (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium self-start ${
                        questionnaire.ready
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {questionnaire.ready ? "Publicado" : "Rascunho"}
                    </span>
                  )}
                </div>
                <p className="text-sm sm:text-base text-gray-600 mb-3">
                  {questionnaire.description}
                </p>
                <p className="text-xs sm:text-sm text-gray-400">
                  Criado em:{" "}
                  {new Date(questionnaire.createdAt).toLocaleDateString(
                    "pt-BR",
                  )}
                </p>
              </div>

              {isTeacher && (
                <div className="flex gap-2 self-end sm:self-start">
                  <ButtonIcon
                    onClick={() => {
                      setActiveQuestionnaire(questionnaire as any);
                      handleEdit(questionnaire);
                    }}
                    title="Editar questionário"
                    className="text-blue-logo hover:bg-blue-50"
                  >
                    <PencilSimpleIcon size={20} />
                  </ButtonIcon>
                  <ButtonIcon
                    onClick={() => {
                      setActiveQuestionnaire(questionnaire as any);
                      handleDelete(questionnaire.id);
                    }}
                    title="Excluir questionário"
                    className="text-red-logo hover:bg-red-50"
                  >
                    <TrashIcon size={20} />
                  </ButtonIcon>
                </div>
              )}
            </div>

            {!isTeacher && (
              <button
                onClick={() => handleAnswer(questionnaire.id)}
                className="mt-4 w-full bg-blue-logo text-white py-2 px-4 rounded-md hover:bg-purple-logo transition-colors text-sm sm:text-base"
              >
                Responder Questionário
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
