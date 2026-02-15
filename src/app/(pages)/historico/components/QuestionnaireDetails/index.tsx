import { QuestionList } from "../../utils/types";
import { QuestionCard } from "../QuestionCard";

interface QuestionnaireDetailsProps {
  details: QuestionList | null;
  onBack: () => void;
}

export function QuestionnaireDetails({ details }: QuestionnaireDetailsProps) {
  if (!details || details.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhum detalhe encontrado.
      </div>
    );
  }

  const firstQuestion = details[0];
  const questionnaire = firstQuestion.questionnaire;

  // Calcular estatísticas
  const totalValue = details.reduce((sum, q) => sum + q.value, 0);
  const earnedValue = details.reduce((sum, q) => {
    const userAnswer = q.userAnswers[q.userAnswers.length - 1]; // Última resposta
    if (!userAnswer) return sum;

    const selectedAlternative = q.alternative.find(
      (alt) => alt.id === userAnswer.alternativeId,
    );
    return sum + (selectedAlternative?.correct ? q.value : 0);
  }, 0);

  const percentage = (earnedValue / totalValue) * 100;
  const correctCount = details.filter((q) => {
    const userAnswer = q.userAnswers[q.userAnswers.length - 1];
    if (!userAnswer) return false;
    const selectedAlternative = q.alternative.find(
      (alt) => alt.id === userAnswer.alternativeId,
    );
    return selectedAlternative?.correct;
  }).length;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-0">
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold mb-2">
          {questionnaire.title}
        </h1>
        <p className="text-sm md:text-base text-gray-600 mb-4">
          {questionnaire.description}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 items-stretch sm:items-center flex-wrap">
          <div className="bg-blue-50 px-3 md:px-4 py-2 rounded flex-1 sm:flex-initial">
            <p className="text-xs md:text-sm text-gray-600">Nota Final</p>
            <p className="text-xl md:text-2xl font-bold text-blue-600">
              {earnedValue.toFixed(1)}/{totalValue.toFixed(1)} (
              {percentage.toFixed(0)}%)
            </p>
          </div>
          <div className="bg-green-50 px-3 md:px-4 py-2 rounded flex-1 sm:flex-initial">
            <p className="text-xs md:text-sm text-gray-600">
              Questões Corretas
            </p>
            <p className="text-lg md:text-xl font-semibold text-green-600">
              {correctCount}/{details.length}
            </p>
          </div>
          <div className="bg-gray-50 px-3 md:px-4 py-2 rounded flex-1 sm:flex-initial">
            <p className="text-xs md:text-sm text-gray-600">
              Total de Questões
            </p>
            <p className="text-lg md:text-xl font-semibold">{details.length}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3 md:space-y-4">
        <h2 className="text-lg md:text-xl font-bold px-1">
          Detalhamento das Questões
        </h2>
        {details
          .sort((a, b) => a.order - b.order)
          .map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))}
      </div>
    </div>
  );
}
