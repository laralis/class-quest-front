import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useClassStore } from "@/store/useClassStore";
import { useActiveQuestionnaireStore } from "@/store/useActiveQuestionnaireStore";
import { ClassDetails } from "../utils/types";
import { fetchClassByAccessCode } from "../services/classService";

export function useClassDetails(accessCode: string) {
  const [classDetails, setClassDetails] = useState<ClassDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();
  const { setCurrentClass } = useClassStore();
  const { shouldRefreshQuestionnaires, resetRefresh } =
    useActiveQuestionnaireStore();
  const router = useRouter();

  const loadClassDetails = async () => {
    if (!accessCode || !token) return;

    setLoading(true);
    try {
      const data = await fetchClassByAccessCode(accessCode, token);
      setClassDetails(data);
      setCurrentClass(data.id, data.name);
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

  return { classDetails, loading };
}
