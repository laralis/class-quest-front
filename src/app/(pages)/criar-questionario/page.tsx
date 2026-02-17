"use client";
import { Container } from "@/app/components/Container";
import { CaretLeftIcon } from "@phosphor-icons/react";
import { useState, useEffect, useCallback, useLayoutEffect } from "react";
import { useClassStore } from "@/store/useClassStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useActiveQuestionnaireStore } from "@/store/useActiveQuestionnaireStore";
import { useQuestionStore } from "@/store/useQuestionStore";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { z } from "zod";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { Modal } from "./components/Modal";
import { QuestionnaireForm } from "./components/QuestionnaireForm";
import { QuestionsList } from "./components/QuestionsList";
import { useQuestionnaireActions } from "./hooks/useQuestionnaireActions";
import { useQuestionsActions } from "./hooks/useQuestionsActions";

const questionnaireSchema = z.object({
  title: z
    .string("Título é obrigatório")
    .trim()
    .min(3, "Título deve ter no mínimo 3 caracteres"),
  description: z.string().optional().default(""),
});

interface Question {
  id: number;
  statement: string;
  value: number;
  available: boolean;
  time: number | null;
  order: number;
  questionnaireId: number;
  alternatives?: {
    id: number;
    text: string;
    correct: boolean;
    questionId: number;
  }[];
}

export default function CriarQuestionario() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(
    null,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const { currentClassDetails } = useClassStore();
  const { token } = useAuthStore();
  const { activeQuestionnaire, clearActiveQuestionnaire } =
    useActiveQuestionnaireStore();
  const { shouldRefreshQuestions, resetRefresh } = useQuestionStore();
  const router = useRouter();

  const { updateQuestionnaire, createQuestionnaire } =
    useQuestionnaireActions();

  const formik = useFormik({
    initialValues: {
      title: activeQuestionnaire?.title || "",
      description: activeQuestionnaire?.description || "",
    },
    enableReinitialize: true,
    validationSchema: toFormikValidationSchema(questionnaireSchema),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      if (isEditing) {
        await updateQuestionnaire(values, isReady, formik.setSubmitting);
      } else {
        const success = await createQuestionnaire(
          values,
          isReady,
          currentClassDetails.id,
          formik.setSubmitting,
          setIsEditing,
        );
        if (!success) {
          setIsEditing(false);
        }
      }
    },
  });

  useEffect(() => {
    return () => {
      if (!activeQuestionnaire?.id) {
        clearActiveQuestionnaire();
      }
    };
  }, [activeQuestionnaire?.id, clearActiveQuestionnaire]);

  useEffect(() => {
    if (!activeQuestionnaire) {
      formik.resetForm({
        values: {
          title: "",
          description: "",
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeQuestionnaire]);

  const fetchQuestions = useCallback(async () => {
    if (!activeQuestionnaire?.id || !token) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/questionnaire/${activeQuestionnaire?.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();

        if (data.questions && Array.isArray(data.questions)) {
          setQuestions(
            data.questions.sort(
              (a: Question, b: Question) => a.order - b.order,
            ),
          );
        }
      }
    } catch (error) {
      console.error("Erro ao buscar perguntas:", error);
    }
  }, [activeQuestionnaire?.id, token]);

  useLayoutEffect(() => {
    if (activeQuestionnaire?.id) {
      setIsEditing(true);
      setIsReady(activeQuestionnaire.ready || false);

      if (
        activeQuestionnaire.questions &&
        activeQuestionnaire.questions.length > 0
      ) {
        setQuestions(
          activeQuestionnaire.questions.sort((a, b) => a.order - b.order),
        );
      } else {
        fetchQuestions();
      }
    } else if (currentClassDetails.id) {
      setIsEditing(false);
      setQuestions([]);
      setIsReady(false);
    } else {
      router.push("/turmas");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeQuestionnaire, currentClassDetails.id, router]);

  useEffect(() => {
    if (shouldRefreshQuestions && activeQuestionnaire?.id) {
      fetchQuestions();
      resetRefresh();
    }
  }, [
    shouldRefreshQuestions,
    activeQuestionnaire?.id,
    resetRefresh,
    fetchQuestions,
  ]);

  const { moveQuestionUp, moveQuestionDown, deleteQuestion } =
    useQuestionsActions(fetchQuestions, questions, setQuestions);

  const handleToggleReady = async (ready: boolean) => {
    if (ready && questions.length === 0) {
      toast.error("Adicione pelo menos uma pergunta antes de publicar");
      return;
    }

    const questionnaireId = activeQuestionnaire?.id;

    if (!questionnaireId) {
      toast.error("Erro: ID do questionário não encontrado");
      console.error("activeQuestionnaire:", activeQuestionnaire);
      return;
    }

    formik.setSubmitting(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/questionnaire/${questionnaireId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ready,
          }),
        },
      );

      if (response.ok) {
        const statusMessage = ready
          ? "Questionário publicado com sucesso!"
          : "Questionário movido para rascunho!";
        toast.success(statusMessage);
        setIsReady(ready);
      } else {
        const error = await response.json();
        toast.error(error.message || "Erro ao atualizar status");
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error("Erro ao conectar com o servidor");
    } finally {
      formik.setSubmitting(false);
    }
  };

  const handleEditQuestion = (questionId: number) => {
    setEditingQuestionId(questionId);
    setIsModalEditOpen(true);
  };

  const handleGoBack = () => {
    clearActiveQuestionnaire();
    router.back();
  };
  return (
    <Container className="text-blue-logo mt-4 sm:mt-6 max-w-3xl px-4 sm:px-6">
      <Modal
        type="add"
        isOpen={isModalAddOpen}
        onRequestClose={() => setIsModalAddOpen(false)}
        questionnaireId={activeQuestionnaire?.id}
        questionsCount={questions.length}
        onQuestionAdded={fetchQuestions}
      />
      <Modal
        type="edit"
        isOpen={isModalEditOpen}
        onRequestClose={() => {
          setIsModalEditOpen(false);
          setEditingQuestionId(null);
        }}
        questionnaireId={activeQuestionnaire?.id}
        questionsCount={questions.length}
        onQuestionAdded={fetchQuestions}
        questionId={editingQuestionId}
      />

      <div className="flex gap-2 items-center bg-blue-logo p-3 sm:p-4 text-white rounded-t-lg">
        <button
          onClick={handleGoBack}
          className="hover:bg-logo-bege p-1.5 sm:p-2 rounded-md cursor-pointer"
        >
          <CaretLeftIcon size={20} className="sm:w-[22px] sm:h-[22px]" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
            {isEditing ? "Editar questionário" : "Novo questionário"}
          </h1>

          <p className="text-xs sm:text-sm opacity-90">
            Turma: {currentClassDetails.name}
          </p>
        </div>
      </div>

      <QuestionnaireForm
        key={activeQuestionnaire?.id || "new"}
        formik={formik}
        isEditing={isEditing}
      />

      {(activeQuestionnaire?.id || isEditing) && (
        <QuestionsList
          questions={questions}
          onAddQuestion={() => setIsModalAddOpen(true)}
          onEditQuestion={handleEditQuestion}
          onDeleteQuestion={deleteQuestion}
          onMoveUp={moveQuestionUp}
          onMoveDown={moveQuestionDown}
          isReady={isReady}
          onToggleReady={handleToggleReady}
          isSubmitting={formik.isSubmitting}
        />
      )}

      {!activeQuestionnaire?.id && !isEditing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 text-center">
          <p className="text-sm sm:text-base text-blue-700 font-medium">
            💡 Salve o rascunho do questionário para começar a adicionar
            perguntas
          </p>
        </div>
      )}

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        progressClassName="!bg-blue-logo"
        className="text-sm sm:text-base"
      />
    </Container>
  );
}
