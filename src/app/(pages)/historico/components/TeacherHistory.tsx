"use client";

import { TeacherQuestionnaireHistory } from "../utils/types";

interface TeacherHistoryProps {
  questionnaires: {
    questionnaireId: string;
    title: string;
    description: string;
    createdAt: string;
    totalStudents: number;
    answeredCount: number;
    students: {
      studentId: string;
      studentName: string;
      grade: number;
      answeredAt: string;
    }[];
  }[];
}

export function TeacherHistory({ questionnaires }: TeacherHistoryProps) {
  if (!questionnaires || questionnaires.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhum questionário encontrado para esta turma.
      </div>
    );
  }

  console.log("questionnaires", questionnaires);
  return (
    <div className="space-y-8">
      {questionnaires.map((questionnaire) => (
        <div
          key={questionnaire.questionnaireId}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              {questionnaire.title}
            </h2>
            {questionnaire.description && (
              <p className="text-gray-600 mt-1">{questionnaire.description}</p>
            )}
            <div className="flex gap-4 mt-2 text-sm text-gray-500">
              <span>
                Criado em:{" "}
                {new Date(questionnaire.createdAt).toLocaleDateString("pt-BR")}
              </span>
              <span>
                Respondido: {questionnaire.answeredCount}/
                {questionnaire.totalStudents}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left p-3 font-semibold text-gray-700">
                    Aluno
                  </th>
                  <th className="text-center p-3 font-semibold text-gray-700">
                    Nota
                  </th>
                  <th className="text-center p-3 font-semibold text-gray-700">
                    Data de Resposta
                  </th>
                </tr>
              </thead>
              <tbody>
                {questionnaire.students.map((student) => (
                  <tr
                    key={student.studentId}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-3 text-gray-800">{student.studentName}</td>
                    <td className="p-3 text-center">
                      {student.grade !== null ? (
                        <span className="font-semibold text-blue-600">
                          {student.grade.toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-gray-400">Não respondido</span>
                      )}
                    </td>
                    <td className="p-3 text-center text-gray-600">
                      {student.answeredAt
                        ? new Date(student.answeredAt).toLocaleDateString(
                            "pt-BR",
                          )
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
