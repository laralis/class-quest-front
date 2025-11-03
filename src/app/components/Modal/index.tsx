import ReactModal from "react-modal";
import { XIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react";
import { Container } from "../Container";
import { InputText } from "../InputText";
import { useState } from "react";

// Configuração do ReactModal para acessibilidade
if (typeof window !== "undefined") {
  ReactModal.setAppElement("body");
}

export function Modal({
  isOpen,
  onRequestClose,
}: {
  isOpen: boolean;
  onRequestClose: () => void;
}) {
  const [options, setOptions] = useState<string[]>([""]);

  const addOption = () => {
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

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      shouldCloseOnEsc
      className="w-[500px] bg-bege-logo rounded-md mx-auto mt-40 outline-none"
    >
      <div className="flex items-center justify-between bg-blue-logo p-4 rounded-t-md text-white">
        <h2 className="font-bold text-xl">Cadastro de pergunta</h2>
        <button
          onClick={onRequestClose}
          className="cursor-pointer hover:bg-red-500 rounded-md p-1"
        >
          <XIcon size={22} weight="bold" />
        </button>
      </div>
      <Container>
        <form className="space-y-6 p-2">
          <div className="space-y-2">
            <label htmlFor="statement" className="block text-sm font-medium">
              Enunciado
            </label>
            <InputText
              id="statement"
              name="statement"
              className="w-full bg-gray-50 border border-gray-200"
              placeholder="Enunciado da pergunta"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium">Opções</label>
            {options.map((option, index) => (
              <div key={index} className="flex gap-2">
                <InputText
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200"
                  placeholder={`Opção ${index + 1}`}
                />
                {options.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="p-2 text-red-500 hover:bg-red-100 rounded-md"
                  >
                    <TrashIcon size={20} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addOption}
              className="flex items-center gap-2 text-blue-logo hover:text-blue-600"
            >
              <PlusIcon size={20} />
              Adicionar opção
            </button>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-logo text-white rounded-md hover:bg-blue-600"
            >
              Salvar pergunta
            </button>
          </div>
        </form>
      </Container>
    </ReactModal>
  );
}
