"use client";

interface StudentHistory {
  studentId: string;
  name: string;
  grades: (number | null)[];
}

interface HistoryTabProps {
  studentHistory: StudentHistory[];
}

export function HistoryTab({ studentHistory }: HistoryTabProps) {
  const maxUnits = Math.max(0, ...studentHistory.map((h) => h.grades.length));

  return (
    <div className="bg-white rounded-lg shadow p-6 overflow-auto">
      <h2 className="text-xl font-semibold mb-4">Histórico dos Alunos</h2>

      {studentHistory.length > 0 ? (
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
            {studentHistory.map((h) => (
              <tr key={h.studentId} className="odd:bg-white even:bg-gray-50">
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
      ) : (
        <p className="text-center text-gray-500 py-4">
          Nenhum histórico disponível
        </p>
      )}
    </div>
  );
}
