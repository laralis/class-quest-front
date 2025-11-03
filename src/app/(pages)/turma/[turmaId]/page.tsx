"use client";

import { useState } from "react";

interface ClassDetails {
  id: string;
  name: string;
  teacher: string;
  schedule: string;
  students: Student[];
  assignments: Assignment[];
}

interface Student {
  id: string;
  name: string;
  email: string;
}

interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  status: "pending" | "completed";
}

export default function ClassDetail({
  params,
}: {
  params: { turmaId: string };
}) {
  const [activeTab, setActiveTab] = useState<"feed" | "students">("feed");

  const classDetails: ClassDetails = {
    id: params.turmaId,
    name: `Programação web 1`,
    teacher: "Prof. João Silva",
    schedule: "Segunda e Quarta - 07:30-09:30",
    students: [
      { id: "1", name: "Ana Silva", email: "ana@escola.com" },
      { id: "2", name: "Pedro Santos", email: "pedro@escola.com" },
    ],
    assignments: [
      {
        id: "1",
        title: "Lista de Exercícios 1",
        dueDate: "2025-10-15",
        status: "pending",
      },
      {
        id: "2",
        title: "Trabalho em Grupo",
        dueDate: "2025-10-20",
        status: "completed",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className="bg-blue-600 text-white p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">{classDetails.name}</h1>
          <p className="text-lg">{classDetails.teacher}</p>
          <p>{classDetails.schedule}</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b bg-white">
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
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <main className="max-w-5xl mx-auto p-6">
        {activeTab === "feed" ? (
          <div className="space-y-4">
            {/* Upcoming Assignments */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">
                Atividades Pendentes
              </h2>
              {classDetails.assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="border-b last:border-0 py-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-medium">{assignment.title}</h3>
                    <p className="text-sm text-gray-500">
                      Entrega:{" "}
                      {new Date(assignment.dueDate).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      assignment.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {assignment.status === "completed"
                      ? "Concluído"
                      : "Pendente"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                Alunos Matriculados
              </h2>
              <div className="divide-y">
                {classDetails.students.map((student) => (
                  <div key={student.id} className="py-4 flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                      <span className="text-gray-600 font-medium">
                        {student.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium">{student.name}</h3>
                      <p className="text-sm text-gray-500">{student.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
