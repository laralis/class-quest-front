"use client";

import Link from "next/link";

interface Questionnaires {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  classId: number;
  createdById: number;
  ready: boolean;
}

interface FeedTabProps {
  questionnaires: Questionnaires[];
}

export function FeedTab({ questionnaires }: FeedTabProps) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Questionários Pendentes</h2>
        {questionnaires?.length > 0 ? (
          questionnaires.map((assignment) => (
            <Link
              key={assignment.id}
              className="border-b last:border-0 py-4 flex justify-between items-center"
              href={"/oi"}
            >
              <div>
                <h3 className="font-medium">{assignment.title}</h3>
                <p className="text-sm text-gray-500">
                  Criado em:{" "}
                  {new Date(assignment.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  assignment.ready === true
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {assignment.ready === true ? "Concluído" : "Rascunho"}
              </span>
            </Link>
          ))
        ) : (
          <p className="text-center text-gray-500 py-4">
            Nenhum questionário disponível
          </p>
        )}
      </div>
    </div>
  );
}
