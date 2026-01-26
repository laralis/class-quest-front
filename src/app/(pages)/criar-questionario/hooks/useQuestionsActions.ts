import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "react-toastify";

interface Question {
  id: number;
  statement: string;
  value: number;
  available: boolean;
  time: number | null;
  order: number;
  questionnaireId: number;
}

export function useQuestionsActions(
  fetchQuestions: () => void,
  questions: Question[],
  setQuestions: (questions: Question[]) => void
) {
  const { token } = useAuthStore();

  const moveQuestionUp = async (index: number) => {
    if (index > 0) {
      const newQuestions = [...questions];
      [newQuestions[index], newQuestions[index - 1]] = [
        newQuestions[index - 1],
        newQuestions[index],
      ];

      newQuestions.forEach((q, i) => {
        q.order = i + 1;
      });

      setQuestions(newQuestions);
      await updateQuestionsOrder(newQuestions);
    }
  };

  const moveQuestionDown = async (index: number) => {
    if (index < questions.length - 1) {
      const newQuestions = [...questions];
      [newQuestions[index], newQuestions[index + 1]] = [
        newQuestions[index + 1],
        newQuestions[index],
      ];

      newQuestions.forEach((q, i) => {
        q.order = i + 1;
      });

      setQuestions(newQuestions);
      await updateQuestionsOrder(newQuestions);
    }
  };

  const updateQuestionsOrder = async (questions: Question[]) => {
    try {
      for (const question of questions) {
        await fetch(`http://localhost:3300/question/${question.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            order: question.order,
          }),
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar ordem das perguntas:", error);
      toast.error("Erro ao atualizar ordem das perguntas");
    }
  };

  const deleteQuestion = async (questionId: number) => {
    try {
      const response = await fetch(
        `http://localhost:3300/question/${questionId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        toast.success("Pergunta excluída com sucesso!");
        fetchQuestions();
      } else {
        toast.error("Erro ao excluir pergunta");
      }
    } catch (error) {
      console.error("Erro ao excluir pergunta:", error);
      toast.error("Erro ao conectar com o servidor");
    }
  };

  return {
    moveQuestionUp,
    moveQuestionDown,
    deleteQuestion,
  };
}
