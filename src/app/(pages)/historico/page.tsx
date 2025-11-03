'use client';

import { useState } from 'react';

interface Grade {
  studentName: string;
  subject: string;
  grade: number;
  date: string;
}

interface ClassHistory {
  className: string;
  grades: Grade[];
}

export default function HistoryPage() {
  const [selectedClass, setSelectedClass] = useState<string>('');

  // Sample data - replace with actual data from your backend
  const classHistory: ClassHistory[] = [
    {
      className: 'Turma A',
      grades: [
        { studentName: 'João Silva', subject: 'Matemática', grade: 8.5, date: '2025-10-01' },
        { studentName: 'Maria Santos', subject: 'Matemática', grade: 9.0, date: '2025-10-01' },
      ]
    },
    {
      className: 'Turma B',
      grades: [
        { studentName: 'Pedro Souza', subject: 'Português', grade: 7.5, date: '2025-10-02' },
        { studentName: 'Ana Lima', subject: 'Português', grade: 8.8, date: '2025-10-02' },
      ]
    }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Histórico de Notas por Turma</h1>
      
      <div className="mb-4">
        <select 
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Selecione uma turma</option>
          {classHistory.map((ch) => (
            <option key={ch.className} value={ch.className}>
              {ch.className}
            </option>
          ))}
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
              {classHistory
                .find((ch) => ch.className === selectedClass)
                ?.grades.map((grade, index) => (
                  <tr key={index}>
                    <td className="px-6 py-3 border">{grade.studentName}</td>
                    <td className="px-6 py-3 border">{grade.subject}</td>
                    <td className="px-6 py-3 border">{grade.grade}</td>
                    <td className="px-6 py-3 border">
                      {new Date(grade.date).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}