import ReactModal from "react-modal";
import { XIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react";
import { InputText } from "../../../../components/InputText";
import { InputTextArea } from "@/app/components/InputTextArea";
import { ButtonIcon } from "@/app/components/ButtonIcon";
import { Button } from "@/app/components/Button";
import { useEffect } from "react";
import { InputCheckbox } from "@/app/components/InputCheckbox";
import { InputRadio } from "@/app/components/InputRadio";
import { useQuestionForm } from "../../hooks/useQuestionForm";
import { FormField } from "../FormField";

interface ModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  type: string;
  questionnaireId: number | undefined;
  questionsCount: number;
  onQuestionAdded?: () => void;
  questionId?: number | null;
}

export function Modal({
  isOpen,
  onRequestClose,
  type,
  questionnaireId,
  questionsCount,
  onQuestionAdded,
  questionId,
}: ModalProps) {
  const MAX_OPTIONS = 5;

  useEffect(() => {
    ReactModal.setAppElement("#app-root");
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const { formik, isLoading, addOption, removeOption, handleOptionChange } =
    useQuestionForm({
      type: type as "add" | "edit",
      questionnaireId,
      questionsCount,
      questionId,
      onSuccess: onQuestionAdded,
      onRequestClose,
    });

  const maxOptionsReached = formik.values.options.length >= MAX_OPTIONS;

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      shouldCloseOnEsc
      overlayClassName="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4"
      className="relative z-[10000] w-full max-w-[500px] max-h-[90vh] bg-white border-bege-logo border-2 rounded-md outline-none overflow-y-auto"
    >
      <div className="flex items-center justify-between bg-blue-logo p-3 sm:p-4 rounded-t-md text-white">
        <h2 className="font-bold text-lg sm:text-xl md:text-2xl">
          {type === "add" ? "Adicionar pergunta" : "Editar pergunta"}
        </h2>
        <ButtonIcon
          onClick={onRequestClose}
          className="hover:bg-red-100 text-red-600"
          aria-label="Fechar modal"
          title="Fechar"
        >
          <XIcon size={20} weight="bold" className="sm:w-[22px] sm:h-[22px]" />
        </ButtonIcon>
      </div>

      <form
        className="space-y-3 sm:space-y-4 p-3 sm:p-4"
        onSubmit={formik.handleSubmit}
      >
        <FormField
          error={formik.errors.statement}
          touched={formik.touched.statement}
        >
          <InputTextArea
            id="statement"
            text="Enunciado"
            className="w-full bg-gray-50 border border-gray-200 rounded-md resize-none text-sm sm:text-base"
            placeholder="Enunciado da pergunta"
            {...formik.getFieldProps("statement")}
          />
        </FormField>

        <FormField error={formik.errors.value} touched={formik.touched.value}>
          <InputText
            type="number"
            id="value"
            text="Valor da questão"
            placeholder="Pontos"
            {...formik.getFieldProps("value")}
            step="0.5"
            min="0"
          />
        </FormField>

        <div className="space-y-3 sm:space-y-4">
          <label className="block text-sm sm:text-base font-medium">
            Alternativas
          </label>
          <FormField
            error={
              typeof formik.errors.options === "string"
                ? formik.errors.options
                : undefined
            }
            touched={formik.touched.options}
          >
            <div className="space-y-2">
              {formik.values.options.map((option, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <InputText
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    onBlur={formik.handleBlur}
                    name={`options[${index}]`}
                    className="w-full bg-logo-bege border border-gray-200 text-sm sm:text-base"
                    placeholder={`Alternativa ${index + 1}`}
                  />
                  {formik.values.options.length > 1 && (
                    <>
                      <ButtonIcon
                        type="button"
                        onClick={() => removeOption(index)}
                        className="text-red-logo flex-shrink-0"
                        aria-label={`Remover alternativa ${index + 1}`}
                      >
                        <TrashIcon size={18} className="sm:w-5 sm:h-5" />
                      </ButtonIcon>

                      <InputRadio
                        index={index}
                        selectedOption={formik.values.selectedOption}
                        setSelectedOption={(idx) =>
                          formik.setFieldValue("selectedOption", idx)
                        }
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
          </FormField>

          <FormField
            error={formik.errors.selectedOption}
            touched={formik.touched.selectedOption}
          >
            <div className="flex items-center gap-4 mt-2">
              <Button
                type="button"
                onClick={addOption}
                className={`flex items-center gap-2 text-sm sm:text-base ${
                  maxOptionsReached
                    ? "opacity-50 cursor-default! hover:bg-gray-500!"
                    : ""
                }`}
                disabled={maxOptionsReached}
                title={
                  maxOptionsReached
                    ? `Máximo de ${MAX_OPTIONS} alternativas atingido`
                    : "Adicionar opção"
                }
              >
                <PlusIcon size={18} className="sm:w-5 sm:h-5" />
                Adicionar opção
              </Button>
            </div>
          </FormField>
        </div>

        <div className="flex flex-col gap-3 sm:gap-4 my-2">
          <div className="flex items-center gap-3">
            <label className="block text-sm sm:text-base font-medium">
              Temporizador
            </label>
            <InputCheckbox
              checked={formik.values.hasTimer}
              onChange={(e) =>
                formik.setFieldValue("hasTimer", e.target.checked)
              }
            />
          </div>

          {formik.values.hasTimer && (
            <FormField
              error={formik.errors.timeSeconds}
              touched={formik.touched.timeSeconds}
            >
              <InputText
                type="number"
                name="timeSeconds"
                id="timeSeconds"
                text="Tempo"
                placeholder="Tempo em segundos"
                value={formik.values.timeSeconds || ""}
                onChange={(e) => {
                  const val =
                    e.target.value === ""
                      ? null
                      : Math.max(0, Number(e.target.value));
                  formik.setFieldValue("timeSeconds", val);
                }}
                onBlur={formik.handleBlur}
                className="w-full sm:w-48 text-sm sm:text-base"
              />
            </FormField>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-4">
          <Button
            type="button"
            onClick={onRequestClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-red-logo hover:text-white text-sm sm:text-base w-full sm:w-auto"
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="px-4 py-2 bg-blue-logo text-white rounded-md hover:bg-green-logo disabled:opacity-50 text-sm sm:text-base w-full sm:w-auto"
            disabled={isLoading}
          >
            {isLoading ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </ReactModal>
  );
}
