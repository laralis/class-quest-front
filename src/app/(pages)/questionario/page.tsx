"use client";

import { Container } from "@/app/components/Container";
import { useActiveQuestionnaireStore } from "@/store/useActiveQuestionnaireStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuthStore } from "@/store/useAuthStore";
import { QuestionnaireHeader } from "./components/QuestionnaireHeader";
import { QuestionProgress } from "./components/QuestionProgress";
import { QuestionTimer } from "./components/QuestionTimer";
import { QuestionContent } from "./components/QuestionContent";
import { QuestionNavigation } from "./components/QuestionNavigation";
import { submitAllAnswers } from "./services/questionnaireService";

export default function Questionario() {
  const {
    activeQuestionnaire,
    clearActiveQuestionnaire,
    setActiveQuestionnaire,
  } = useActiveQuestionnaireStore();
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [expiredQuestions, setExpiredQuestions] = useState<Set<number>>(
    new Set(),
  );
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
  }, [activeQuestionnaire, setActiveQuestionnaire]);

  const handleSelectAnswer = (alternativeId: number, questionId: number) => {
    if (expiredQuestions.has(questionId)) {
      toast.warning("⏰ Esta questão já expirou! Não é possível responder.");
      return;
    }

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

  const handleTimeUp = (questionIdToExpire: number) => {
    if (!activeQuestionnaire) return;

    const currentQuestion = activeQuestionnaire.questions[currentQuestionIndex];

    if (currentQuestion.id !== questionIdToExpire) {
      return;
    }

    setExpiredQuestions((prev) => new Set(prev).add(questionIdToExpire));

    setAnswers((prevAnswers) => {
      const newAnswers = { ...prevAnswers };
      delete newAnswers[questionIdToExpire];
      return newAnswers;
    });

    toast.error("⏰ Tempo esgotado! Questão não pontuada.", {
      autoClose: 2000,
    });

    if (currentQuestionIndex < activeQuestionnaire.questions.length - 1) {
      setTimeout(() => {
        handleNext();
      }, 1500);
    } else {
      setTimeout(() => {
        toast.info(
          "Você pode revisar suas respostas ou enviar o questionário.",
        );
      }, 1500);
    }
  };

  const handleBack = () => {
    sessionStorage.removeItem("currentQuestionnaire");
    clearActiveQuestionnaire();
    router.back();
  };

  const handleSubmit = async () => {
    if (!activeQuestionnaire || !user?.id || !token) {
      return;
    }

    const unanswered = activeQuestionnaire.questions.filter(
      (q) => !answers[q.id],
    );

    if (unanswered.length > 0) {
      const confirmed = window.confirm(
        `Você tem ${unanswered.length} questão(ões) sem resposta (podem ter expirado). Deseja enviar mesmo assim?`,
      );

      if (!confirmed) {
        return;
      }
    }

    try {
      toast.info("Enviando respostas...");

      const answeredQuestions = activeQuestionnaire.questions.filter(
        (q) => answers[q.id],
      );

      if (answeredQuestions.length === 0) {
        toast.error("Nenhuma questão foi respondida!");
        return;
      }

      const success = await submitAllAnswers(
        answers,
        answeredQuestions,
        user.id,
        token,
      );

      if (success) {
        toast.success("Questionário enviado com sucesso!");
        sessionStorage.removeItem("currentQuestionnaire");
        clearActiveQuestionnaire();
        router.push("/turmas");
      } else {
        toast.error("Erro ao enviar algumas respostas");
      }
    } catch (error) {
      console.error("Erro ao enviar respostas:", error);
      toast.error("Erro ao conectar com o servidor");
    }
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
    <Container className="max-w-4xl mx-auto py-2 md:py-8 px-2 md:px-4">
      <div className="bg-white rounded-lg shadow-md md:shadow-lg overflow-hidden">
        <QuestionnaireHeader
          title={activeQuestionnaire.title}
          description={activeQuestionnaire.description}
          onBack={handleBack}
        />

        <QuestionProgress
          currentQuestion={currentQuestionIndex}
          totalQuestions={totalQuestions}
          answeredCount={Object.keys(answers).length}
          timer={
            currentQuestion.time && currentQuestion.time > 0 ? (
              <QuestionTimer
                key={currentQuestion.id}
                timeLimit={currentQuestion.time}
                onTimeUp={() => handleTimeUp(currentQuestion.id)}
              />
            ) : undefined
          }
        />

        <div className="p-4 md:p-6">
          <QuestionContent
            statement={currentQuestion.statement}
            alternatives={currentQuestion.alternatives || []}
            selectedAnswer={answers[currentQuestion.id]}
            onSelectAnswer={(alternativeId) =>
              handleSelectAnswer(alternativeId, currentQuestion.id)
            }
            disabled={expiredQuestions.has(currentQuestion.id)}
          />
        </div>

        <QuestionNavigation
          currentIndex={currentQuestionIndex}
          totalQuestions={totalQuestions}
          answers={answers}
          questions={activeQuestionnaire.questions}
          expiredQuestions={expiredQuestions}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSubmit={handleSubmit}
          onNavigateToQuestion={setCurrentQuestionIndex}
        />
      </div>
    </Container>
  );
}
