interface Alternative {
  id: number;
  text: string;
  correct: boolean;
  questionId: number;
}

interface QuestionContentProps {
  statement: string;
  alternatives: Alternative[];
  selectedAnswer: number | undefined;
  onSelectAnswer: (alternativeId: number) => void;
  disabled?: boolean;
}

export function QuestionContent({
  statement,
  alternatives,
  selectedAnswer,
  onSelectAnswer,
  disabled = false,
}: QuestionContentProps) {
  return (
    <div>
      {disabled && (
        <div className="mb-3 md:mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-700 font-medium">
            ⏰ Tempo esgotado! Não é mais possível responder esta questão.
          </p>
        </div>
      )}

      <div className="mb-4 md:mb-6">
        <h2 className="text-base md:text-xl font-semibold text-gray-800 leading-relaxed">
          {statement}
        </h2>
      </div>

      <div className="space-y-2 md:space-y-3">
        {alternatives && alternatives.length > 0 ? (
          alternatives.map((alternative, index) => (
            <button
              key={alternative.id}
              onClick={() => !disabled && onSelectAnswer(alternative.id)}
              disabled={disabled}
              className={`w-full text-left p-3 md:p-4 rounded-lg border-2 transition-all active:scale-[0.98] ${
                disabled
                  ? "border-gray-200 bg-gray-100 cursor-not-allowed opacity-60"
                  : selectedAnswer === alternative.id
                    ? "border-blue-logo bg-blue-50 cursor-pointer"
                    : "border-gray-200 hover:border-blue-200 active:border-blue-logo cursor-pointer"
              }`}
              aria-label={`Alternativa ${String.fromCharCode(65 + index)}: ${alternative.text}`}
              aria-pressed={selectedAnswer === alternative.id}
            >
              <div className="flex items-start gap-2 md:gap-3">
                <div
                  className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    disabled
                      ? "border-gray-300 bg-gray-200"
                      : selectedAnswer === alternative.id
                        ? "border-blue-logo bg-blue-logo"
                        : "border-gray-300"
                  }`}
                >
                  {selectedAnswer === alternative.id && !disabled && (
                    <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-white rounded-full" />
                  )}
                </div>
                <span
                  className={`font-medium text-sm md:text-base ${disabled ? "text-gray-500" : "text-gray-700"}`}
                >
                  {String.fromCharCode(65 + index)}.
                </span>
                <span
                  className={`text-sm md:text-base leading-relaxed ${disabled ? "text-gray-500" : "text-gray-800"}`}
                >
                  {alternative.text}
                </span>
              </div>
            </button>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500 text-sm">
            Nenhuma alternativa disponível
          </div>
        )}
      </div>
    </div>
  );
}
