"use client";

import { Container } from "@/app/components/Container";
import { useActiveQuestionnaireStore } from "@/store/useActiveQuestionnaireStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CaretLeftIcon } from "@phosphor-icons/react";
import { toast } from "react-toastify";
import { useAuthStore } from "@/store/useAuthStore";

export default function Questionario() {
  const {
    activeQuestionnaire,
    clearActiveQuestionnaire,
    setActiveQuestionnaire,
  } = useActiveQuestionnaireStore();
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const { user, token } = useAuthStore();

  useEffect(() => {
    const stored = sessionStorage.getItem("currentQuestionnaire");
    if (stored && !activeQuestionnaire) {
      try {
        const data = JSON.parse(stored);
        setActiveQuestionnaire(data);
      } catch (error) {
        console.error("Erro ao recuperar do sessionStorage:", error);
      }
    }
  }, []);

  const handleSelectAnswer = (alternativeId: number, questionId: number) => {
    setAnswers({
      ...answers,
      [questionId]: alternativeId,
    });
  };

  const handleNext = () => {
    if (
      activeQuestionnaire &&
      currentQuestionIndex < activeQuestionnaire.questions.length - 1
    ) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    console.log("=== INÍCIO handleSubmit ===");
    console.log("activeQuestionnaire:", activeQuestionnaire);
    console.log("answers:", answers);

    if (!activeQuestionnaire) {
      console.log("activeQuestionnaire está vazio, retornando...");
      return;
    }

    // Verificar se todas as questões foram respondidas
    const unanswered = activeQuestionnaire.questions.filter(
      (q) => !answers[q.id]
    );

    console.log("Questões não respondidas:", unanswered);

    if (unanswered.length > 0) {
      toast.warning(
        `Você ainda tem ${unanswered.length} pergunta(s) sem resposta`
      );
      return;
    }

    try {
      console.log("Iniciando envio de respostas...");
      toast.info("Enviando respostas...");

      const promises = activeQuestionnaire.questions.map((question) => {
        const payload = {
          studentId: user?.id,
          alternativeId: answers[question.id],
          questionId: question.id,
        };

        console.log("Enviando resposta para questão:", question.id, payload);

        return fetch(`http://localhost:3300/user-answer`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      });

      console.log("Total de requisições:", promises.length);

      const responses = await Promise.all(promises);

      console.log("Respostas recebidas:", responses);

      for (let i = 0; i < responses.length; i++) {
        const response = responses[i];
        const responseText = await response.text();
        console.log(`Resposta ${i + 1}:`, {
          ok: response.ok,
          status: response.status,
          statusText: response.statusText,
          body: responseText,
        });
      }

      const allSuccessful = responses.every((response) => response.ok);

      if (allSuccessful) {
        toast.success("Questionário enviado com sucesso!");
        console.log("Todas as respostas foram enviadas com sucesso");

        sessionStorage.removeItem("currentQuestionnaire");
        clearActiveQuestionnaire();
        router.push("/turmas");
      } else {
        toast.error("Erro ao enviar algumas respostas");
        console.error("Algumas respostas falharam");
      }
    } catch (error) {
      console.error("Erro ao enviar respostas:", error);
      toast.error("Erro ao conectar com o servidor");
    }

    console.log("=== FIM handleSubmit ===");
  };

  if (!activeQuestionnaire) {
    return (
      <Container>
        <div className="text-center py-8 text-gray-500">Carregando...</div>
      </Container>
    );
  }

  if (
    !activeQuestionnaire.questions ||
    activeQuestionnaire.questions.length === 0
  ) {
    return (
      <Container>
        <div className="text-center py-8 text-gray-500">
          Nenhuma questão disponível neste questionário
        </div>
      </Container>
    );
  }

  const currentQuestion = activeQuestionnaire.questions[currentQuestionIndex];
  const totalQuestions = activeQuestionnaire.questions.length;

  if (!currentQuestion) {
    return (
      <Container>
        <div className="text-center py-8 text-gray-500">
          Erro ao carregar a questão
        </div>
      </Container>
    );
  }

  return (
    <Container className="max-w-4xl mx-auto py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-blue-logo text-white p-6">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => {
                sessionStorage.removeItem("currentQuestionnaire");
                clearActiveQuestionnaire();
                router.back();
              }}
              className="hover:bg-logo-bege p-2 rounded-md transition-colors"
            >
              <CaretLeftIcon size={22} />
            </button>
            <h1 className="text-2xl font-bold">{activeQuestionnaire.title}</h1>
          </div>
          <p className="text-sm opacity-90 pl-11">
            {activeQuestionnaire.description}
          </p>
        </div>

        {/* Progress */}
        <div className="bg-gray-100 px-6 py-3">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>
              Questão {currentQuestionIndex + 1} de {totalQuestions}
            </span>
            <span>
              {Object.keys(answers).length} de {totalQuestions} respondidas
            </span>
          </div>
          <div className="w-full bg-gray-300 h-2 rounded-full mt-2">
            <div
              className="bg-blue-logo h-2 rounded-full transition-all"
              style={{
                width: `${
                  ((currentQuestionIndex + 1) / totalQuestions) * 100
                }%`,
              }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {currentQuestion.statement}
            </h2>
            {currentQuestion.time && (
              <p className="text-sm text-gray-500">
                Tempo: {currentQuestion.time} segundos
              </p>
            )}
          </div>

          {/* Alternatives */}
          <div className="space-y-3">
            {currentQuestion.alternatives &&
            currentQuestion.alternatives.length > 0 ? (
              currentQuestion.alternatives.map((alternative, index) => (
                <button
                  key={alternative.id}
                  onClick={() =>
                    handleSelectAnswer(alternative.id, currentQuestion.id)
                  }
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    answers[currentQuestion.id] === alternative.id
                      ? "border-blue-logo bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        answers[currentQuestion.id] === alternative.id
                          ? "border-blue-logo bg-blue-logo"
                          : "border-gray-300"
                      }`}
                    >
                      {answers[currentQuestion.id] === alternative.id && (
                        <div className="w-3 h-3 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="font-medium text-gray-700">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    <span className="text-gray-800">{alternative.text}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                Nenhuma alternativa disponível
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="border-t p-6 flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Anterior
          </button>

          <div className="flex gap-2">
            {activeQuestionnaire.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-8 h-8 rounded-full ${
                  index === currentQuestionIndex
                    ? "bg-blue-logo text-white"
                    : answers[activeQuestionnaire.questions[index].id]
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {currentQuestionIndex === totalQuestions - 1 ? (
            <button
              onClick={() => {
                console.log("Botão Enviar clicado!");
                handleSubmit();
              }}
              className="px-6 py-2 bg-green-logo text-white rounded-md hover:bg-green-600 transition-colors"
            >
              Enviar
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-logo text-white rounded-md hover:bg-purple-logo transition-colors"
            >
              Próxima
            </button>
          )}
        </div>
      </div>
    </Container>
  );
}
