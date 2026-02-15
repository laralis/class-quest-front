import { Question } from "../../types";

interface QuestionNavigationProps {
  currentIndex: number;
  totalQuestions: number;
  answers: Record<number, number>;
  questions: Question[];
  expiredQuestions?: Set<number>;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  onNavigateToQuestion: (index: number) => void;
}

export function QuestionNavigation({
  currentIndex,
  totalQuestions,
  answers,
  questions,
  expiredQuestions = new Set(),
  onPrevious,
  onNext,
  onSubmit,
  onNavigateToQuestion,
}: QuestionNavigationProps) {
  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === totalQuestions - 1;

  return (
    <div className="border-t p-3 md:p-6 bg-gray-50">
      <div className="mb-4 overflow-x-auto pb-1">
        <div className="flex gap-2 min-w-min justify-center">
          {questions.map((question, index) => {
            const isExpired = expiredQuestions.has(question.id);
            const isAnswered = answers[question.id];
            const isCurrent = index === currentIndex;

            return (
              <button
                key={index}
                onClick={() => onNavigateToQuestion(index)}
                className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex-shrink-0 text-xs md:text-sm font-medium transition-all active:scale-95 ${
                  isCurrent
                    ? "bg-blue-logo text-white ring-2 ring-blue-300 shadow-md"
                    : isExpired
                      ? "bg-red-100 text-red-700 border-2 border-red-300"
                      : isAnswered
                        ? "bg-green-100 text-green-700 border-2 border-green-300"
                        : "bg-gray-200 text-gray-700 border-2 border-gray-300"
                }`}
                title={
                  isExpired
                    ? "Questão expirada"
                    : isAnswered
                      ? "Respondida"
                      : "Não respondida"
                }
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between items-center gap-2 md:gap-4">
        <button
          onClick={onPrevious}
          disabled={isFirstQuestion}
          className="px-4 md:px-6 py-2.5 border-2 border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm md:text-base font-medium active:scale-95"
        >
          Anterior
        </button>

        {isLastQuestion ? (
          <button
            onClick={onSubmit}
            className="px-4 md:px-6 py-2.5 bg-green-logo text-white rounded-lg hover:bg-green-600 transition-all text-sm md:text-base font-semibold shadow-md active:scale-95"
          >
            Enviar Respostas
          </button>
        ) : (
          <button
            onClick={onNext}
            className="px-4 md:px-6 py-2.5 bg-blue-logo text-white rounded-lg hover:bg-purple-logo transition-all text-sm md:text-base font-medium shadow-md active:scale-95"
          >
            Próxima
          </button>
        )}
      </div>
    </div>
  );
}
