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
import { useAuthStore } from "@/store/useAuthStore";
import { useQuestionStore } from "@/store/useQuestionStore";
import { toast } from "react-toastify";

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

  const [statement, setStatement] = useState("");
  const [options, setOptions] = useState<string[]>([""]);
  const [hasTimer, setHasTimer] = useState<boolean>(false);
  const [timeSeconds, setTimeSeconds] = useState<number | "">("");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [value, setValue] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  const { token } = useAuthStore();
  const { triggerRefresh } = useQuestionStore();

  const addOption = () => {
    if (options.length >= MAX_OPTIONS) return;
    setOptions([...options, ""]);
  };

  const removeOption = (index: number) => {
    if (selectedOption === index) {
      setSelectedOption(null);
    } else if (selectedOption !== null && selectedOption > index) {
      setSelectedOption(selectedOption - 1);
    }
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const resetForm = () => {
    setStatement("");
    setOptions([""]);
    setHasTimer(false);
    setTimeSeconds("");
    setSelectedOption(null);
    setValue(1);
  };

  useEffect(() => {
    if (type === "edit" && questionId && isOpen) {
      fetchQuestionData();
    }
  }, [type, questionId, isOpen]);

  const fetchQuestionData = async () => {
    if (!questionId || !token) return;

    try {
      const response = await fetch(
        `http://localhost:3300/question/${questionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStatement(data.statement);
        setValue(data.value);
        setHasTimer(!!data.time);
        setTimeSeconds(data.time || "");

        if (data.options && data.options.length > 0) {
          setOptions(
            data.options.map(
              (opt: { text: string; correct: boolean }) => opt.text
            )
          );
          const correctIndex = data.options.findIndex(
            (opt: { text: string; correct: boolean }) => opt.correct
          );
          setSelectedOption(correctIndex !== -1 ? correctIndex : null);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar dados da questão:", error);
      toast.error("Erro ao carregar dados da questão");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!questionnaireId && type === "add") {
      toast.error("ID do questionário não encontrado");
      return;
    }

    if (!statement.trim()) {
      toast.error("O enunciado é obrigatório");
      return;
    }

    if (selectedOption === null) {
      toast.error("Selecione a alternativa correta");
      return;
    }

    const filledOptions = options.filter((opt) => opt.trim() !== "");
    if (filledOptions.length < 2) {
      toast.error("Adicione pelo menos 2 alternativas");
      return;
    }

    setLoading(true);

    try {
      if (type === "edit" && questionId) {
        const updateResponse = await fetch(
          `http://localhost:3300/question/${questionId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              statement,
              value,
              time: hasTimer && timeSeconds ? Number(timeSeconds) : null,
            }),
          }
        );

        if (!updateResponse.ok) {
          const error = await updateResponse.json();
          toast.error(error.message || "Erro ao atualizar pergunta");
          setLoading(false);
          return;
        }

        toast.success("Pergunta atualizada com sucesso!");
        triggerRefresh();
        resetForm();
        onRequestClose();
      } else {
        const questionPayload = {
          statement,
          value,
          available: true,
          time: hasTimer && timeSeconds ? Number(timeSeconds) : null,
          order: questionsCount + 1,
          questionnaireId,
        };

        const questionResponse = await fetch("http://localhost:3300/question", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(questionPayload),
        });

        const questionResponseText = await questionResponse.text();

        if (!questionResponse.ok) {
          try {
            const error = JSON.parse(questionResponseText);
            toast.error(
              error.details || error.message || "Erro ao criar pergunta"
            );
          } catch {
            toast.error("Erro ao criar pergunta: Erro no servidor");
          }
          setLoading(false);
          return;
        }

        let questionData;
        try {
          questionData = JSON.parse(questionResponseText);
        } catch {
          toast.error("Erro ao processar resposta do servidor");
          setLoading(false);
          return;
        }

        const newQuestionId = questionData.id;

        let optionsCreated = 0;

        for (let i = 0; i < filledOptions.length; i++) {
          try {
            const optionData = {
              text: filledOptions[i],
              correct: i === selectedOption,
              questionId: newQuestionId,
            };

            const optionResponse = await fetch(
              "http://localhost:3300/alternative",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(optionData),
              }
            );

            const responseText = await optionResponse.text();

            if (optionResponse.ok) {
              try {
                JSON.parse(responseText);
                optionsCreated++;
              } catch {
                optionsCreated++;
              }
            } else {
              try {
                const errorData = JSON.parse(responseText);
                toast.error(
                  `Erro ao criar alternativa ${i + 1}: ${
                    errorData.message || "Erro desconhecido"
                  }`
                );
              } catch {
                toast.error(
                  `Erro ao criar alternativa ${i + 1}: Erro no servidor`
                );
              }
            }
          } catch (optionError) {
            toast.error(`Erro ao criar alternativa ${i + 1}`);
          }
        }

        if (optionsCreated === filledOptions.length) {
          toast.success("Pergunta adicionada com sucesso!");
          triggerRefresh();
          resetForm();
          onQuestionAdded?.();
          onRequestClose();
        } else {
          toast.warning(
            `Pergunta criada, mas apenas ${optionsCreated} de ${filledOptions.length} alternativas foram adicionadas`
          );
        }
      }
    } catch (error) {
      console.error("Erro ao processar pergunta:", error);
      toast.error("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  };

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
        <form className="space-y-2 p-2" onSubmit={handleSubmit}>
          <InputTextArea
            name="statement"
            id="statement"
            text="Enunciado"
            className="w-full bg-gray-50 border border-gray-200 rounded-md resize-none"
            placeholder="Enunciado da pergunta"
            value={statement}
            onChange={(e) => setStatement(e.target.value)}
            required
          />

          <InputText
            type="number"
            name="value"
            id="value"
            text="Valor da questão"
            placeholder="Pontos"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            step="0.5"
            min="0"
            required
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
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="px-4 py-2 bg-blue-logo text-white rounded-md hover:bg-green-logo disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </Container>
    </ReactModal>
  );
}
