import { QuestionnaireHistory } from "../../utils/types";
import { Button } from "@/app/components/Button";

interface QuestionnaireListProps {
  questionnaires: QuestionnaireHistory[];
  selectedClass: string;
  onClassChange: (className: string) => void;
  onViewDetails: (questionnaireId: number) => void;
}

export function QuestionnaireList({
  questionnaires,
  selectedClass,
  onClassChange,
  onViewDetails,
}: QuestionnaireListProps) {
  const classes = ["all", ...new Set(questionnaires.map((q) => q.className))];
  const filteredQuestionnaires =
    selectedClass === "all"
      ? questionnaires
      : questionnaires.filter((q) => q.className === selectedClass);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Meu histórico de questionários
      </h1>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filtrar por turma:
        </label>
        <select
          value={selectedClass}
          onChange={(e) => onClassChange(e.target.value)}
          className="border rounded-md px-4 py-2 w-full max-w-xs"
        >
          <option value="all">Todas as turmas</option>
          {classes
            .filter((c) => c !== "all")
            .map((className) => (
              <option key={className} value={className}>
                {className}
              </option>
            ))}
        </select>
      </div>

      {filteredQuestionnaires.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Nenhum questionário encontrado.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredQuestionnaires.map((questionnaire) => (
            <QuestionnaireCard
              key={questionnaire.id}
              questionnaire={questionnaire}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function QuestionnaireCard({
  questionnaire,
  onViewDetails,
}: {
  questionnaire: QuestionnaireHistory;
  onViewDetails: (id: number) => void;
}) {
  const percentage = (questionnaire.score / questionnaire.maxScore) * 100;
  const scoreColor =
    percentage >= 70
      ? "text-green-600"
      : percentage >= 50
        ? "text-yellow-600"
        : "text-red-600";

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-lg">{questionnaire.title}</h3>
          <p className="text-sm text-gray-600">{questionnaire.className}</p>
        </div>
        <div className={`text-right ${scoreColor}`}>
          <p className="text-2xl font-bold">
            {questionnaire.score}/{questionnaire.maxScore}
          </p>
          <p className="text-sm">{percentage.toFixed(0)}%</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Concluído em:{" "}
          {new Date(questionnaire.completedAt).toLocaleDateString("pt-BR")}
        </p>
        <Button
          onClick={() => onViewDetails(questionnaire.id)}
          className="!px-4 !py-2 !bg-blue-600 hover:!bg-blue-700 text-sm"
          aria-label="Ver detalhes do questionário"
        >
          Ver detalhes
        </Button>
      </div>
    </div>
  );
}
