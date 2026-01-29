import { QuestionDetail } from "../../utils/types";

export function QuestionCard({ question }: { question: QuestionDetail }) {
  const userAnswer = question.userAnswers[question.userAnswers.length - 1];
  const selectedAlternative = userAnswer
    ? question.alternative.find((alt) => alt.id === userAnswer.alternativeId)
    : null;
  const isCorrect = selectedAlternative?.correct ?? false;
  return (
    <div
      className={`bg-white rounded-lg shadow-sm border-l-4 p-6 ${
        isCorrect ? "border-green-500" : "border-red-500"
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg">Questão {question.order}</h3>
          <p className="text-sm text-gray-500">
            Valor: {question.value} pontos
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            isCorrect
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {isCorrect ? "✓ Correta" : "✗ Incorreta"}
        </span>
      </div>

      <p className="text-gray-800 mb-4 font-medium">{question.statement}</p>

      <div className="space-y-2">
        {question.alternative.map((alt) => {
          const isSelected = alt.id === userAnswer?.alternativeId;
          const isCorrectAlt = alt.correct;

          return (
            <div
              key={alt.id}
              className={`p-3 rounded-md border ${
                isCorrectAlt
                  ? "bg-green-50 border-green-300"
                  : isSelected
                    ? "bg-red-50 border-red-300"
                    : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-center gap-2">
                {isCorrectAlt && (
                  <span className="text-green-600 font-bold">✓</span>
                )}
                {isSelected && !isCorrectAlt && (
                  <span className="text-red-600 font-bold">✗</span>
                )}
                <p
                  className={isCorrectAlt || isSelected ? "font-semibold" : ""}
                >
                  {alt.text}
                </p>
              </div>
              {isCorrectAlt && (
                <p className="text-sm text-green-700 mt-1 ml-6">
                  ✓ Resposta correta
                </p>
              )}
              {isSelected && !isCorrectAlt && (
                <p className="text-sm text-red-700 mt-1 ml-6">
                  Sua resposta (incorreta)
                </p>
              )}
            </div>
          );
        })}
      </div>

      {!userAnswer && (
        <p className="text-yellow-600 mt-4 text-sm flex items-center gap-2">
          <span>⚠</span> Você não respondeu esta questão.
        </p>
      )}
    </div>
  );
}
