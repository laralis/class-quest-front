"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

interface Student {
  id: string;
  name: string;
  email: string;
  registration?: string;
}

interface StudentsTabProps {
  classCode: string;
}

export function StudentsTab({ classCode }: StudentsTabProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3300/class/students?accessCode=${classCode}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setStudents(data.students || []);
        } else {
          console.error("Erro ao buscar alunos");
        }
      } catch (error) {
        console.error("Erro ao conectar com o servidor:", error);
      } finally {
        setLoading(false);
      }
    };
    if (token && classCode) {
      fetchStudents();
    }
  }, [token, classCode]);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Alunos matriculados</h2>
        {loading ? (
          <div className="text-center py-8 text-gray-500">
            Carregando alunos...
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nenhum aluno encontrado
          </div>
        ) : (
          <div className="divide-y">
            {students.map((student) => (
              <div key={student.id} className="py-4 flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                  <span className="text-gray-600 font-medium">
                    {student.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium">{student.name}</h3>
                  <p className="text-sm text-gray-500">{student.email}</p>
                  {student.registration && (
                    <p className="text-xs text-gray-400">
                      Matrícula: {student.registration}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
