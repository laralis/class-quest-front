import ReactModal from "react-modal";
import { XIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react";
import { Container } from "../../../../components/Container";
import { InputText } from "../../../../components/InputText";
import { InputTextArea } from "@/app/components/InputTextArea";
import { ButtonIcon } from "@/app/components/ButtonIcon";
import { Button } from "@/app/components/Button";
import { useEffect, useState } from "react";
import { InputCheckbox } from "@/app/components/InputCheckbox";
import { InputRadio } from "@/app/components/InputRadio";

export function Modal({
  isOpen,
  onRequestClose,
  type,
}: {
  isOpen: boolean;
  onRequestClose: () => void;
  type: string;
}) {
  const MAX_OPTIONS = 5;

  useEffect(() => {
    ReactModal.setAppElement("#app-root");
  }, []);

  const [options, setOptions] = useState<string[]>([""]);
  const [hasTimer, setHasTimer] = useState<boolean>(false);
  const [timeSeconds, setTimeSeconds] = useState<number | "">("");

  const addOption = () => {
    if (options.length >= MAX_OPTIONS) return;
    setOptions([...options, ""]);
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const maxOptionsReached = options.length >= MAX_OPTIONS;
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      shouldCloseOnEsc
      overlayClassName="fixed inset-0 z-[9999] flex items-start justify-center bg-black/40"
      className="relative z-[10000] w-[500px] bg-white border-bege-logo border-2 rounded-md mx-auto mt-[5%] outline-none"
    >
      <div className="flex items-center justify-between bg-blue-logo p-4 rounded-t-md text-white">
        <h2 className="font-bold text-2xl">
          {type === "add" ? "Adicionar pergunta" : "Editar pergunta"}
        </h2>
        <ButtonIcon
          onClick={onRequestClose}
          className="hover:bg-red-logo"
          aria-label="Fechar modal"
        >
          <XIcon size={22} weight="bold" />
        </ButtonIcon>
      </div>

      <Container>
        <form className="space-y-2 p-2" onSubmit={(e) => e.preventDefault()}>
          <InputTextArea
            name="statement"
            id="statement"
            text="Enunciado"
            className="w-full bg-gray-50 border border-gray-200 rounded-md resize-none"
            placeholder="Enunciado da pergunta"
          />

          <div className="space-y-4">
            <label className="block text-m">Alternativas</label>
            <div className="space-y-2">
              {options.map((option, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <InputText
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="w-full bg-logo-bege border border-gray-200"
                    placeholder={`Alternativa ${index + 1}`}
                  />
                  {options.length > 1 && (
                    <>
                      <ButtonIcon
                        type="button"
                        onClick={() => removeOption(index)}
                        className="text-red-logo"
                        aria-label={`Remover alternativa ${index + 1}`}
                      >
                        <TrashIcon size={20} />
                      </ButtonIcon>

                      <InputRadio
                        index={index}
                        selectedOption={selectedOption}
                        setSelectedOption={setSelectedOption}
                      />
                    </>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 mt-2">
              <Button
                type="button"
                onClick={addOption}
                className={`flex items-center gap-2 ${
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
                <PlusIcon size={20} />
                Adicionar opção
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-4 my-2">
            <div className="flex items-center gap-3">
              <label className="block text-m">Temporizador</label>

              <InputCheckbox
                checked={hasTimer}
                onChange={(e) => setHasTimer(e.target.checked)}
              />
            </div>

            <InputText
              type="number"
              name="time"
              id="time"
              text="Tempo"
              placeholder="Tempo em segundos"
              value={timeSeconds}
              onChange={(e) => {
                const val =
                  e.target.value === ""
                    ? ""
                    : Math.max(0, Number(e.target.value));
                setTimeSeconds(val === "" ? "" : Number(val));
              }}
              className={`w-48 ${hasTimer ? "" : "hidden"}`}
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              onClick={onRequestClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-red-logo hover:text-white"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="px-4 py-2 bg-blue-logo text-white rounded-md hover:bg-green-logo"
            >
              Salvar
            </Button>
          </div>
        </form>
      </Container>
    </ReactModal>
  );
}
