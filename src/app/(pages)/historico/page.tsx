"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";

export default function HistoryPage() {
  const { user } = useAuthStore();
  const [selectedClass, setSelectedClass] = useState<string>("");

  const isTeacher = user?.role === "teacher";

  return (
    <div className="p-10 max-w-[1250px] m-auto">
      <h1 className="text-2xl font-bold mb-6">Histórico de Notas por Turma</h1>

      <div className="mb-4">
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="border rounded"
        >
          <option value="">Selecione uma turma</option>
          {/* {classHistory.map((ch) => (
            <option key={ch.className} value={ch.className}>
              {ch.className}
            </option>
          ))} */}
        </select>
      </div>

      {selectedClass && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 border">Aluno</th>
                <th className="px-6 py-3 border">Disciplina</th>
                <th className="px-6 py-3 border">Nota</th>
                <th className="px-6 py-3 border">Data</th>
              </tr>
            </thead>
            <tbody>
              {/* {classHistory
                .find((ch) => ch.className === selectedClass)
                ?.grades.map((grade, index) => (
                  <tr key={index}>
                    <td className="px-6 py-3 border">{grade.studentName}</td>
                    <td className="px-6 py-3 border">{grade.subject}</td>
                    <td className="px-6 py-3 border">{grade.grade}</td>
                    <td className="px-6 py-3 border">
                      {new Date(grade.date).toLocaleDateString("pt-BR")}
                    </td>
                  </tr>
                ))} */}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
