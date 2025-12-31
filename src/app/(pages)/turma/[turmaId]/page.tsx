"use client";

import { Container } from "@/app/components/Container";
import { useState } from "react";

interface ClassDetails {
  id: string;
  name: string;
  teacher: string;
  schedule: string;
  students: Student[];
  assignments: Assignment[];
  studentHistory: StudentHistory[];
}

interface Student {
  id: string;
  name: string;
  email: string;
}

interface StudentHistory {
  studentId: string;
  name: string;
  grades: (number | null)[];
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
  const [activeTab, setActiveTab] = useState<"feed" | "students" | "history">(
    "feed"
  );

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
        title: "Nivelamento de JavaScript",
        dueDate: "2025-10-15",
        status: "pending",
      },
      {
        id: "2",
        title: "JavaScript Avançado",
        dueDate: "2025-10-20",
        status: "completed",
      },
    ],
    studentHistory: [
      { studentId: "1", name: "Ana Silva", grades: [8.5, 7.0, 9.0] },
      { studentId: "2", name: "Pedro Santos", grades: [6.0, null, 7.5] },
    ],
  };

  return (
    <Container>
      <div className=" bg-gray-50 rounded-md">
        <div className="bg-blue-logo text-white p-8 rounded-t-md">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">{classDetails.name}</h1>
            <p className="text-lg">{classDetails.teacher}</p>
            <p>{classDetails.schedule}</p>
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
            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Questionários Pendentes
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
                        {new Date(assignment.dueDate).toLocaleDateString(
                          "pt-BR"
                        )}
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
                        : "Rascunho"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === "students" ? (
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
          ) : (
            <div className="bg-white rounded-lg shadow p-6 overflow-auto">
              <h2 className="text-xl font-semibold mb-4">
                Histórico dos Alunos
              </h2>

              {(() => {
                const maxUnits = Math.max(
                  0,
                  ...classDetails.studentHistory.map((h) => h.grades.length)
                );
                return (
                  <table className="min-w-full table-auto border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border px-4 py-2 text-left">Aluno</th>
                        {Array.from({ length: maxUnits }).map((_, i) => (
                          <th key={i} className="border px-4 py-2 text-left">
                            Unidade {i + 1}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {classDetails.studentHistory.map((h) => (
                        <tr
                          key={h.studentId}
                          className="odd:bg-white even:bg-gray-50"
                        >
                          <td className="border px-4 py-2">{h.name}</td>

                          {Array.from({ length: maxUnits }).map((_, i) => (
                            <td key={i} className="border px-4 py-2">
                              {h.grades[i] ?? "-"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                );
              })()}
            </div>
          )}
        </main>
      </div>
    </Container>
  );
}
