"use client";

import { useState } from "react";
import { CaretDownIcon, CaretUpIcon } from "@phosphor-icons/react";
import { StudentGradeData } from "../../utils/types";

interface TeacherHistoryProps {
  studentGrades: StudentGradeData[];
}

export function TeacherHistory({ studentGrades }: TeacherHistoryProps) {
  const [expandedStudents, setExpandedStudents] = useState<Set<number>>(
    new Set(),
  );

  const toggleStudent = (studentId: number) => {
    const newExpanded = new Set(expandedStudents);
    if (newExpanded.has(studentId)) {
      newExpanded.delete(studentId);
    } else {
      newExpanded.add(studentId);
    }
    setExpandedStudents(newExpanded);
  };
  if (!studentGrades || studentGrades.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhum aluno encontrado para esta turma.
      </div>
    );
  }

  const allQuestionnaires = new Map<number, string>();
  studentGrades.forEach((student) => {
    student.questionnaires.forEach((q) => {
      if (!allQuestionnaires.has(q.questionnaireId)) {
        allQuestionnaires.set(q.questionnaireId, q.questionnaireTitle);
      }
    });
  });

  const questionnairesList = Array.from(allQuestionnaires.entries()).sort(
    (a, b) => a[0] - b[0],
  );

  const getStudentGradeForQuestionnaire = (
    student: StudentGradeData,
    questionnaireId: number,
  ) => {
    const questionnaire = student.questionnaires.find(
      (q) => q.questionnaireId === questionnaireId,
    );
    return questionnaire;
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 70) return "text-green-600";
    if (percentage >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-gray-50 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            Desempenho dos Alunos
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Notas obtidas em cada questionário e média final
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="text-left p-3 font-semibold text-gray-700 sticky left-0 bg-gray-100">
                  Aluno
                </th>
                {questionnairesList.map(([id, title]) => (
                  <th
                    key={id}
                    className="text-center p-3 font-semibold text-gray-700 min-w-[150px]"
                  >
                    <div className="text-sm">{title}</div>
                  </th>
                ))}
                <th className="text-center p-3 font-semibold text-gray-700 bg-blue-50 min-w-[120px] sticky right-0">
                  Média Final
                </th>
              </tr>
            </thead>
            <tbody>
              {studentGrades.map((student) => (
                <tr
                  key={student.studentId}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-3 text-gray-800 font-medium sticky left-0 bg-white">
                    <div>{student.studentName}</div>
                    <div className="text-xs text-gray-500">
                      {student.studentEmail}
                    </div>
                  </td>
                  {questionnairesList.map(([id]) => {
                    const grade = getStudentGradeForQuestionnaire(student, id);
                    return (
                      <td key={id} className="p-3 text-center">
                        {grade ? (
                          <div>
                            <div
                              className={`font-semibold ${getGradeColor(grade.percentage)}`}
                            >
                              {grade.earnedPoints}/{grade.totalPoints}
                            </div>
                            <div className="text-xs text-gray-500">
                              {grade.percentage.toFixed(0)}%
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                    );
                  })}
                  <td className="p-3 text-center bg-blue-50 sticky right-0">
                    <div
                      className={`font-bold text-lg ${getGradeColor((student.finalGrade / 10) * 100)}`}
                    >
                      {student.finalGrade.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-600">
                      {student.totalEarnedPoints}/{student.totalPossiblePoints}
                      pts
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden space-y-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <h2 className="text-lg font-bold text-gray-800">
            Desempenho dos Alunos
          </h2>
          <p className="text-sm text-gray-600 mt-1">Toque para ver detalhes</p>
        </div>

        {studentGrades.map((student) => {
          const isExpanded = expandedStudents.has(student.studentId);
          return (
            <div
              key={student.studentId}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <button
                onClick={() => toggleStudent(student.studentId)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
                aria-label={`${isExpanded ? "Recolher" : "Expandir"} informações de ${student.studentName}`}
                aria-expanded={isExpanded}
              >
                <div className="flex-1 text-left">
                  <div className="font-semibold text-gray-800">
                    {student.studentName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {student.studentEmail}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div
                      className={`font-bold text-lg ${getGradeColor((student.finalGrade / 10) * 100)}`}
                    >
                      {student.finalGrade.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">Média</div>
                  </div>
                  {isExpanded ? (
                    <CaretUpIcon size={20} weight="bold" />
                  ) : (
                    <CaretDownIcon size={20} weight="bold" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                  <div className="mb-3">
                    <div className="text-sm font-semibold text-gray-700 mb-1">
                      Pontuação Total
                    </div>
                    <div className="text-gray-600">
                      {student.totalEarnedPoints}/{student.totalPossiblePoints}{" "}
                      pontos
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm font-semibold text-gray-700 mb-2">
                      Questionários
                    </div>
                    {student.questionnaires.length > 0 ? (
                      student.questionnaires.map((q) => (
                        <div
                          key={q.questionnaireId}
                          className="bg-white rounded-lg p-3 border border-gray-200"
                        >
                          <div className="text-sm font-medium text-gray-800 mb-2">
                            {q.questionnaireTitle}
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="text-xs text-gray-600">
                              Pontos: {q.earnedPoints}/{q.totalPoints}
                            </div>
                            <div
                              className={`font-semibold ${getGradeColor(q.percentage)}`}
                            >
                              {q.percentage.toFixed(0)}%
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500 text-center py-2">
                        Nenhum questionário respondido
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-xs md:text-sm font-semibold text-gray-600 mb-2">
            Total de Alunos
          </h3>
          <p className="text-2xl md:text-3xl font-bold text-blue-600">
            {studentGrades.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-xs md:text-sm font-semibold text-gray-600 mb-2">
            Questionários
          </h3>
          <p className="text-2xl md:text-3xl font-bold text-green-600">
            {questionnairesList.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 sm:col-span-2 md:col-span-1">
          <h3 className="text-xs md:text-sm font-semibold text-gray-600 mb-2">
            Média da Turma
          </h3>
          <p className="text-2xl md:text-3xl font-bold text-purple-600">
            {(
              studentGrades.reduce(
                (acc, student) => acc + student.finalGrade,
                0,
              ) / studentGrades.length
            ).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
