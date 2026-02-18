import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { questionSchema, QuestionFormData } from "../utils/schema";
import { useAuthStore } from "@/store/useAuthStore";
import { useQuestionStore } from "@/store/useQuestionStore";
import { toast } from "react-toastify";

interface UseQuestionFormProps {
  type: "add" | "edit";
  questionnaireId?: number;
  questionsCount: number;
  questionId?: number | null;
  onSuccess?: () => void;
  onRequestClose?: () => void;
}

export function useQuestionForm({
  type,
  questionnaireId,
  questionsCount,
  questionId,
  onSuccess,
  onRequestClose,
}: UseQuestionFormProps) {
  const { token } = useAuthStore();
  const { triggerRefresh } = useQuestionStore();
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik<QuestionFormData>({
    initialValues: {
      statement: "",
      value: 1,
      hasTimer: false,
      timeSeconds: null,
      options: [""],
      selectedOption: null,
    },
    validationSchema: toFormikValidationSchema(questionSchema),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting }) => {
      setIsLoading(true);

      try {
        if (type === "edit" && questionId) {
          await updateQuestion(questionId, values);
        } else {
          await createQuestion(values);
        }
      } catch (error) {
        console.error("Erro ao processar pergunta:", error);
        toast.error("Erro ao conectar com o servidor");
      } finally {
        setSubmitting(false);
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    if (type === "edit" && questionId && token) {
      fetchQuestionData();
    }
  }, [type, questionId, token]);

  const fetchQuestionData = async () => {
    if (!questionId || !token) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/question/${questionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        const correctIndex = data.options?.findIndex(
          (opt: { text: string; correct: boolean }) => opt.correct,
        );

        formik.setValues({
          statement: data.statement || "",
          value: data.value || 1,
          hasTimer: !!data.time,
          timeSeconds: data.time || null,
          options: data.options?.map(
            (opt: { text: string; correct: boolean }) => opt.text,
          ) || [""],
          selectedOption: correctIndex !== -1 ? correctIndex : null,
        });
      }
    } catch (error) {
      console.error("Erro ao buscar dados da questão:", error);
      toast.error("Erro ao carregar dados da questão");
    }
  };

  const updateQuestion = async (id: number, values: QuestionFormData) => {
    const updateResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/question/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          statement: values.statement,
          value: values.value,
          time:
            values.hasTimer && values.timeSeconds ? values.timeSeconds : null,
        }),
      },
    );

    if (!updateResponse.ok) {
      const error = await updateResponse.json();
      toast.error(error.message || "Erro ao atualizar pergunta");
      throw new Error("Failed to update question");
    }

    toast.success("Pergunta atualizada com sucesso!");
    triggerRefresh();
    formik.resetForm();
    onRequestClose?.();
  };

  const createQuestion = async (values: QuestionFormData) => {
    if (!questionnaireId) {
      toast.error("ID do questionário não encontrado");
      throw new Error("Questionnaire ID not found");
    }

    const filledOptions = values.options.filter((opt) => opt.trim() !== "");

    const questionPayload = {
      statement: values.statement,
      value: values.value,
      available: true,
      time: values.hasTimer && values.timeSeconds ? values.timeSeconds : null,
      order: questionsCount + 1,
      questionnaireId,
    };

    const questionResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/question`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(questionPayload),
      },
    );

    const questionResponseText = await questionResponse.text();

    if (!questionResponse.ok) {
      try {
        const error = JSON.parse(questionResponseText);
        toast.error(error.details || error.message || "Erro ao criar pergunta");
      } catch {
        toast.error("Erro ao criar pergunta: Erro no servidor");
      }
      throw new Error("Failed to create question");
    }

    let questionData;
    try {
      questionData = JSON.parse(questionResponseText);
    } catch {
      toast.error("Erro ao processar resposta do servidor");
      throw new Error("Failed to parse question response");
    }

    const newQuestionId = questionData.id;
    let optionsCreated = 0;

    for (let i = 0; i < filledOptions.length; i++) {
      try {
        const optionData = {
          text: filledOptions[i],
          correct: i === values.selectedOption,
          questionId: newQuestionId,
        };

        const optionResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/alternative`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(optionData),
          },
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
              }`,
            );
          } catch {
            toast.error(`Erro ao criar alternativa ${i + 1}: Erro no servidor`);
          }
        }
      } catch {
        toast.error(`Erro ao criar alternativa ${i + 1}`);
      }
    }

    if (optionsCreated === filledOptions.length) {
      toast.success("Pergunta adicionada com sucesso!");
      triggerRefresh();
      formik.resetForm();
      onSuccess?.();
      onRequestClose?.();
    } else {
      toast.warning(
        `Pergunta criada, mas apenas ${optionsCreated} de ${filledOptions.length} alternativas foram adicionadas`,
      );
    }
  };

  const addOption = () => {
    const MAX_OPTIONS = 5;
    if (formik.values.options.length >= MAX_OPTIONS) return;
    formik.setFieldValue("options", [...formik.values.options, ""]);
  };

  const removeOption = (index: number) => {
    const newOptions = formik.values.options.filter((_, i) => i !== index);
    formik.setFieldValue("options", newOptions);

    if (formik.values.selectedOption === index) {
      formik.setFieldValue("selectedOption", null);
    } else if (
      formik.values.selectedOption !== null &&
      formik.values.selectedOption > index
    ) {
      formik.setFieldValue("selectedOption", formik.values.selectedOption - 1);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formik.values.options];
    newOptions[index] = value;
    formik.setFieldValue("options", newOptions);
  };

  return {
    formik,
    isLoading,
    addOption,
    removeOption,
    handleOptionChange,
  };
}
