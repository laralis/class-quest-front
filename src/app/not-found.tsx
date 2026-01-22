"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";

export default function NotFound() {
  const { isAuthenticated, initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const redirectPath = isAuthenticated ? "/turmas" : "/";
  const redirectText = isAuthenticated
    ? "Voltar para turmas"
    : "Voltar para a página inicial";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Página não encontrada
        </h2>
        <p className="text-gray-600 mb-8">Parece que você se perdeu ...</p>
        <Link
          href={redirectPath}
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {redirectText}
        </Link>
      </div>
    </div>
  );
}
