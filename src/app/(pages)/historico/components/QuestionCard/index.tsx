import { QuestionDetail } from "../../utils/types";

export function QuestionCard({ question }: { question: QuestionDetail }) {
  const userAnswer = question.userAnswers[question.userAnswers.length - 1];
  const selectedAlternative = userAnswer
    ? question.alternative.find((alt) => alt.id === userAnswer.alternativeId)
    : null;
  const isCorrect = selectedAlternative?.correct ?? false;
  return (
    <div
      className={`bg-white rounded-lg shadow-sm border-l-4 p-4 md:p-6 ${
        isCorrect ? "border-green-500" : "border-red-500"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0 mb-3 md:mb-4">
        <div>
          <h3 className="font-semibold text-base md:text-lg">
            Questão {question.order}
          </h3>
          <p className="text-xs md:text-sm text-gray-500">
            Valor: {question.value} pontos
          </p>
        </div>
        <span
          className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold self-start ${
            isCorrect
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {isCorrect ? "✓ Correta" : "✗ Incorreta"}
        </span>
      </div>

      <p className="text-gray-800 mb-3 md:mb-4 font-medium text-sm md:text-base">
        {question.statement}
      </p>

      <div className="space-y-2">
        {question.alternative.map((alt) => {
          const isSelected = alt.id === userAnswer?.alternativeId;
          const isCorrectAlt = alt.correct;

          return (
            <div
              key={alt.id}
              className={`p-2 md:p-3 rounded-md border ${
                isCorrectAlt
                  ? "bg-green-50 border-green-300"
                  : isSelected
                    ? "bg-red-50 border-red-300"
                    : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-start gap-2">
                {isCorrectAlt && (
                  <span className="text-green-600 font-bold text-sm md:text-base flex-shrink-0">
                    ✓
                  </span>
                )}
                {isSelected && !isCorrectAlt && (
                  <span className="text-red-600 font-bold text-sm md:text-base flex-shrink-0">
                    ✗
                  </span>
                )}
                <p
                  className={`text-sm md:text-base ${isCorrectAlt || isSelected ? "font-semibold" : ""}`}
                >
                  {alt.text}
                </p>
              </div>
              {isCorrectAlt && (
                <p className="text-xs md:text-sm text-green-700 mt-1 ml-5 md:ml-6">
                  Resposta correta
                </p>
              )}
              {isSelected && !isCorrectAlt && (
                <p className="text-xs md:text-sm text-red-700 mt-1 ml-5 md:ml-6">
                  Sua resposta (incorreta)
                </p>
              )}
            </div>
          );
        })}
      </div>

      {!userAnswer && (
        <p className="text-yellow-600 mt-3 md:mt-4 text-xs md:text-sm flex items-center gap-2">
          <span>⚠</span> Você não respondeu esta questão.
        </p>
      )}
    </div>
  );
}
