import {
  PlusIcon,
  PencilSimpleIcon,
  TrashIcon,
  CaretUpIcon,
  CaretDownIcon,
  TimerIcon,
} from "@phosphor-icons/react";
import { Button } from "@/app/components/Button";
import { ButtonIcon } from "@/app/components/ButtonIcon";

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

interface QuestionsListProps {
  questions: Question[];
  onAddQuestion: () => void;
  onEditQuestion: (questionId: number) => void;
  onDeleteQuestion: (questionId: number, index: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  isReady: boolean;
  onToggleReady: (ready: boolean) => void;
  isSubmitting: boolean;
}

export function QuestionsList({
  questions,
  onAddQuestion,
  onEditQuestion,
  onDeleteQuestion,
  onMoveUp,
  onMoveDown,
  isReady,
  onToggleReady,
  isSubmitting,
}: QuestionsListProps) {
  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md mb-4 sm:mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 pb-2 border-b border-gray-200 gap-2">
        <h2 className="text-lg sm:text-xl font-bold">
          Perguntas do questionário
        </h2>
        <span className="text-xs sm:text-sm text-gray-500">
          {questions.length} {questions.length === 1 ? "pergunta" : "perguntas"}
        </span>
      </div>

      <Button
        type="button"
        onClick={onAddQuestion}
        className="flex items-center justify-center gap-2 bg-blue-logo text-white px-3 sm:px-4 py-2 rounded-md hover:bg-purple-logo mb-4 transition-colors w-full sm:w-auto text-sm sm:text-base"
      >
        <PlusIcon size={18} weight="bold" className="sm:w-5 sm:h-5" />
        Adicionar nova pergunta
      </Button>

      <section className="space-y-4">
        {questions.length > 0 ? (
          questions.map((question, index) => (
            <div
              key={question.id}
              className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200 hover:border-blue-logo transition-colors"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start mb-3 gap-3">
                <div className="flex-1 w-full">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                    <span className="bg-blue-logo text-white px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                      #{index + 1}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-600">
                      {question.value}{" "}
                      {question.value === 1 ? "ponto" : "pontos"}
                    </span>
                    {question.time && (
                      <span className="text-xs sm:text-sm text-gray-600">
                        <TimerIcon size={16} /> {question.time}s
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm sm:text-base font-medium text-gray-800 mb-3">
                    {question.statement}
                  </h3>

                  {question.alternatives &&
                    question.alternatives.length > 0 && (
                      <div className="space-y-2 ml-3 sm:ml-6 mt-3">
                        {question.alternatives.map((alt, altIndex) => (
                          <div
                            key={alt.id}
                            className={`flex items-start gap-2 p-2.5 rounded-md ${
                              alt.correct
                                ? "bg-green-50 border border-green-300"
                                : "bg-white border border-gray-200"
                            }`}
                          >
                            <span className="text-sm font-semibold text-gray-700 mt-0.5 min-w-[20px]">
                              {String.fromCharCode(65 + altIndex)})
                            </span>
                            <span
                              className={`text-sm flex-1 ${
                                alt.correct
                                  ? "font-medium text-green-800"
                                  : "text-gray-700"
                              }`}
                            >
                              {alt.text}
                            </span>
                            {alt.correct && (
                              <span className="text-green-700 text-xs font-semibold bg-green-200 px-2.5 py-1 rounded-full whitespace-nowrap">
                                ✓ Correta
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                </div>

                <div className="flex gap-2 sm:ml-4 self-end sm:self-start">
                  <div className="flex flex-col">
                    <ButtonIcon
                      type="button"
                      title="Mover para cima"
                      onClick={() => onMoveUp(index)}
                      disabled={index === 0}
                    >
                      <CaretUpIcon size={18} className="sm:w-5 sm:h-5" />
                    </ButtonIcon>
                    <ButtonIcon
                      type="button"
                      title="Mover para baixo"
                      onClick={() => onMoveDown(index)}
                      disabled={index === questions.length - 1}
                    >
                      <CaretDownIcon size={18} className="sm:w-5 sm:h-5" />
                    </ButtonIcon>
                  </div>
                  <ButtonIcon
                    type="button"
                    title="Editar pergunta"
                    onClick={() => onEditQuestion(question.id)}
                  >
                    <PencilSimpleIcon size={18} className="sm:w-5 sm:h-5" />
                  </ButtonIcon>
                  <ButtonIcon
                    type="button"
                    title="Excluir pergunta"
                    onClick={() => onDeleteQuestion(question.id, index)}
                    className="text-red-logo"
                  >
                    <TrashIcon size={18} className="sm:w-5 sm:h-5" />
                  </ButtonIcon>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-500">Nenhuma pergunta adicionada ainda</p>
            <p className="text-sm text-gray-400 mt-1">
              Clique no botão acima para adicionar a primeira pergunta
            </p>
          </div>
        )}
      </section>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-gray-200 gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <label className="text-xs sm:text-sm font-medium text-gray-700">
            Status do questionário:
          </label>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs sm:text-sm ${
                !isReady ? "font-semibold text-blue-logo" : "text-gray-500"
              }`}
            >
              Rascunho
            </span>
            <button
              type="button"
              onClick={() => onToggleReady(!isReady)}
              disabled={isSubmitting || questions.length === 0}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-logo focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
                isReady ? "bg-green-logo" : "bg-gray-300"
              }`}
              title={
                questions.length === 0
                  ? "Adicione pelo menos uma pergunta para publicar"
                  : isSubmitting
                    ? "Salvando..."
                    : isReady
                      ? "Mover para rascunho"
                      : "Publicar questionário"
              }
              aria-label={
                isReady ? "Mover para rascunho" : "Publicar questionário"
              }
              role="switch"
              aria-checked={isReady}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isReady ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span
              className={`text-xs sm:text-sm ${
                isReady ? "font-semibold text-green-logo" : "text-gray-500"
              }`}
            >
              Publicado
            </span>
          </div>
        </div>

        {questions.length === 0 && (
          <p className="text-xs sm:text-sm text-orange-600">
            ⚠️ Adicione pelo menos uma pergunta
          </p>
        )}
      </div>
    </div>
  );
}
