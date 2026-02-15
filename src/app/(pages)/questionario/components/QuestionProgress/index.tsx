import { ReactNode } from "react";

interface QuestionProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  answeredCount: number;
  timer?: ReactNode;
}

export function QuestionProgress({
  currentQuestion,
  totalQuestions,
  answeredCount,
  timer,
}: QuestionProgressProps) {
  const progressPercentage = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <div className="bg-gray-100 px-3 md:px-6 py-2.5 md:py-3">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-600 mb-2">
        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
          <span className="whitespace-nowrap font-medium">
            Questão {currentQuestion + 1} de {totalQuestions}
          </span>
          {timer && <div className="flex-shrink-0">{timer}</div>}
        </div>
        <span className="whitespace-nowrap text-xs md:text-sm">
          {answeredCount} de {totalQuestions} respondidas
        </span>
      </div>
      <div className="w-full bg-gray-300 h-2 rounded-full">
        <div
          className="bg-blue-logo h-2 rounded-full transition-all"
          style={{
            width: `${progressPercentage}%`,
          }}
        />
      </div>
    </div>
  );
}
