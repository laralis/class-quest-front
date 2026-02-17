import { useAuthStore } from "@/store/useAuthStore";
import { useActiveQuestionnaireStore } from "@/store/useActiveQuestionnaireStore";
import { toast } from "react-toastify";

export function useQuestionnaireActions() {
  const { token } = useAuthStore();
  const { activeQuestionnaire, setActiveQuestionnaire, triggerRefresh } =
    useActiveQuestionnaireStore();

  const updateQuestionnaire = async (
    values: { title: string; description: string },
    isReady: boolean,
    setSubmitting: (isSubmitting: boolean) => void,
  ) => {
    if (!activeQuestionnaire?.id || !token) {
      toast.error("Questionário não encontrado");
      setSubmitting(false);
      return false;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/questionnaire/${activeQuestionnaire.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: values.title,
            description: values.description,
            ready: isReady,
          }),
        },
      );

      if (response.ok) {
        toast.success("Questionário atualizado com sucesso!");

        setActiveQuestionnaire({
          ...activeQuestionnaire,
          title: values.title,
          description: values.description,
          ready: isReady,
        });

        triggerRefresh();
        return true;
      } else {
        const error = await response.json();
        toast.error(error.message || "Erro ao atualizar questionário");
        return false;
      }
    } catch (error) {
      console.error("Erro ao atualizar questionário:", error);
      toast.error("Erro ao conectar com o servidor");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const createQuestionnaire = async (
    values: { title: string; description: string },
    ready: boolean,
    currentClassId: number | null,
    setSubmitting: (isSubmitting: boolean) => void,
    setIsEditing: (isEditing: boolean) => void,
  ): Promise<boolean> => {
    if (!currentClassId) {
      toast.error("ID da turma não encontrado");
      return false;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/questionnaire`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: values.title,
            description: values.description,
            classId: currentClassId,
            ready,
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        setActiveQuestionnaire(data);
        setIsEditing(true);
        const statusMessage = ready
          ? "Questionário criado e publicado com sucesso!"
          : "Questionário criado como rascunho!";
        toast.success(statusMessage);
        triggerRefresh(); // Atualiza a lista
        return true;
      } else {
        const error = await response.json();
        toast.error(error.message || "Erro ao criar questionário");
        return false;
      }
    } catch (error) {
      console.error("Erro ao criar questionário:", error);
      toast.error("Erro ao conectar com o servidor");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    updateQuestionnaire,
    createQuestionnaire,
  };
}
