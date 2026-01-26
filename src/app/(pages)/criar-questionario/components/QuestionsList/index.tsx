import {
  PlusIcon,
  PencilSimpleIcon,
  TrashIcon,
  CaretUpIcon,
  CaretDownIcon,
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
    <div className="bg-white rounded-lg p-6 shadow-md mb-6">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
        <h2 className="text-xl font-bold">Perguntas do Questionário</h2>
        <span className="text-sm text-gray-500">
          {questions.length} {questions.length === 1 ? "pergunta" : "perguntas"}
        </span>
      </div>

      <Button
        type="button"
        onClick={onAddQuestion}
        className="flex items-center gap-2 bg-blue-logo text-white px-4 py-2 rounded-md hover:bg-purple-logo mb-4 transition-colors"
      >
        <PlusIcon size={20} weight="bold" />
        Adicionar nova pergunta
      </Button>

      <section className="space-y-4">
        {questions.length > 0 ? (
          questions.map((question, index) => (
            <div
              key={question.id}
              className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-blue-logo transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex gap-2">
                  <span className="text-sm text-gray-500 font-semibold">
                    {index + 1}.
                  </span>
                  <h3 className="font-medium">{question.statement}</h3>
                </div>
                <div className="flex gap-2">
                  <div className="flex flex-col">
                    <ButtonIcon
                      type="button"
                      title="Mover para cima"
                      onClick={() => onMoveUp(index)}
                      disabled={index === 0}
                    >
                      <CaretUpIcon size={20} />
                    </ButtonIcon>
                    <ButtonIcon
                      type="button"
                      title="Mover para baixo"
                      onClick={() => onMoveDown(index)}
                      disabled={index === questions.length - 1}
                    >
                      <CaretDownIcon size={20} />
                    </ButtonIcon>
                  </div>
                  <ButtonIcon
                    type="button"
                    title="Editar pergunta"
                    onClick={() => onEditQuestion(question.id)}
                  >
                    <PencilSimpleIcon size={20} />
                  </ButtonIcon>
                  <ButtonIcon
                    type="button"
                    title="Excluir pergunta"
                    onClick={() => onDeleteQuestion(question.id, index)}
                    className="text-red-logo"
                  >
                    <TrashIcon size={20} />
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

      <div className="flex justify-between items-center pt-6 mt-6 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">
            Status do questionário:
          </label>
          <div className="flex items-center gap-2">
            <span
              className={`text-sm ${
                !isReady ? "font-semibold text-blue-logo" : "text-gray-500"
              }`}
            >
              Rascunho
            </span>
            <button
              type="button"
              onClick={() => onToggleReady(!isReady)}
              disabled={isSubmitting || questions.length === 0}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-logo focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
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
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isReady ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span
              className={`text-sm ${
                isReady ? "font-semibold text-green-logo" : "text-gray-500"
              }`}
            >
              Publicado
            </span>
          </div>
        </div>

        {questions.length === 0 && (
          <p className="text-sm text-orange-600">
            ⚠️ Adicione pelo menos uma pergunta
          </p>
        )}
      </div>
    </div>
  );
}
