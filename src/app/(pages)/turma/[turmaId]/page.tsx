"use client";

import { Container } from "@/app/components/Container";
import { useState, useEffect } from "react";
import { StudentsTab } from "./components/StudentsTab";
import { FeedTab } from "./components/FeedTab";
import { HistoryTab } from "./components/HistoryTab";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

interface ClassDetails {
  id: number;
  name: string;
  description: string;
  units: number;
  accessCode: string;
  logoUrl: string;
  createdAt: string;
  teacherId: number;
  teacher: {
    id: number;
    name: string;
    email: string;
    role: string;
    registration: string;
  };
  students: {
    id: number;
    classId: number;
    studentId: number;
    student: {
      id: number;
      name: string;
      email: string;
      role: string;
      registration: string;
    };
  }[];
  questionnaires: {
    id: number;
    title: string;
    description: string;
    createdAt: string;
    classId: number;
    createdById: number;
    ready: boolean;
  }[];
}

export default function ClassDetail({
  params,
}: {
  params: Promise<{ turmaId: string }>;
}) {
  const [activeTab, setActiveTab] = useState<"feed" | "students" | "history">(
    "feed"
  );
  const [turmaId, setTurmaId] = useState<string>("");
  const [classDetails, setClassDetails] = useState<ClassDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    params.then((p) => setTurmaId(p.turmaId));
  }, [params]);

  useEffect(() => {
    if (turmaId && token) {
      fetchClassDetails();
    }
  }, [turmaId, token]);

  const fetchClassDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3300/class/find?accessCode=${turmaId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setClassDetails(data);
      } else {
        console.error("Erro ao buscar detalhes da turma");
        router.push("/turmas");
      }
    } catch (error) {
      console.error("Erro ao conectar com o servidor:", error);
      router.push("/turmas");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !classDetails) {
    return (
      <Container>
        <div className="text-center py-8 text-gray-500">Carregando...</div>
      </Container>
    );
  }

  return (
    <Container>
      <div className=" bg-gray-50 rounded-md">
        <div className="bg-blue-logo text-white p-8 rounded-t-md">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">{classDetails.name}</h1>
            <p className="text-lg">{classDetails.teacher.name}</p>
            <p>{classDetails.description}</p>
          </div>
        </div>

        <div className="border-b bg-white rounded-b-md">
          <div className="max-w-5xl mx-auto">
            <nav className="flex">
              <button
                onClick={() => setActiveTab("feed")}
                className={`px-6 py-4 font-medium ${
                  activeTab === "feed"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500"
                }`}
              >
                Feed
              </button>
              <button
                onClick={() => setActiveTab("students")}
                className={`px-6 py-4 font-medium ${
                  activeTab === "students"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500"
                }`}
              >
                Alunos
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`px-6 py-4 font-medium ${
                  activeTab === "history"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500"
                }`}
              >
                Histórico
              </button>
            </nav>
          </div>
        </div>

        <main className="max-w-5xl mx-auto p-6">
          {activeTab === "feed" ? (
            <FeedTab questionnaires={classDetails.questionnaires} />
          ) : activeTab === "students" ? (
            <StudentsTab turmaId={turmaId} />
          ) : (
            <HistoryTab studentHistory={[]} />
          )}
        </main>
      </div>
    </Container>
  );
}
