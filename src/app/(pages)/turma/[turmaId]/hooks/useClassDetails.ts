import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useClassStore } from "@/store/useClassStore";
import { useActiveQuestionnaireStore } from "@/store/useActiveQuestionnaireStore";
import { fetchClassByAccessCode } from "../services/classService";

export function useClassDetails(accessCode: string) {
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();
  const { setCurrentClass } = useClassStore();
  const { shouldRefreshQuestionnaires, resetRefresh } =
    useActiveQuestionnaireStore();
  const router = useRouter();

  const loadClassDetails = async () => {
    if (!accessCode || !token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await fetchClassByAccessCode(accessCode, token);
      setCurrentClass({
        id: data.id,
        logoUrl: data.logoUrl,
        createdAt: data.createdAt,
        name: data.name,
        description: data.description,
        units: data.units,
        accessCode: data.accessCode,
        teacherId: data.teacherId,
        teacher: data.teacher,
        students: data.students,
        questionnaires: data.questionnaires,
      });
    } catch (error) {
      console.error("Erro ao conectar com o servidor:", error);
      router.push("/turmas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClassDetails();
  }, [accessCode, token]);

  useEffect(() => {
    if (shouldRefreshQuestionnaires) {
      loadClassDetails();
      resetRefresh();
    }
  }, [shouldRefreshQuestionnaires]);

  return { loading };
}
