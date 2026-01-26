import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Class } from "../utils/types";
import { fetchMyClasses } from "../services/classService";

export function useClasses() {
  const router = useRouter();
  const { isAuthenticated, token } = useAuthStore();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClasses = async () => {
      if (!isAuthenticated || !token) {
        router.push("/login");
        return;
      }

      try {
        const data = await fetchMyClasses(token);
        setClasses(data);
      } catch (error) {
        console.error("Erro ao buscar turmas:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    loadClasses();
  }, [router, isAuthenticated, token]);

  const reloadClasses = () => {
    window.location.reload();
  };

  return {
    classes,
    loading,
    reloadClasses,
  };
}
